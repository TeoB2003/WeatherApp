import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { CityCard } from './city-card.interface';
import { Firestore, collection, doc, setDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { user, Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class CityService {
  private readonly defaultImage = 'https://images.unsplash.com/photo-1507961455425-0caef37ef6fe?q=80&w=2408';
  private citiesSubject = new BehaviorSubject<CityCard[]>([]);
  readonly cities$ = this.citiesSubject.asObservable();
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(private authService: AuthService) {
    this.loadFavorites();
  }

  getCities(): CityCard[] {
    return this.citiesSubject.value;
  }

  getFavorites(): CityCard[] {
    return this.getCities().filter(c => c.favorite);
  }

  async toggleFavorite(id: string): Promise<void> {
    const currentUser = await firstValueFrom(user(this.auth));
    if (!currentUser) return;
    const uid = currentUser.uid;
    const cities = this.getCities();
    const updated = await Promise.all(cities.map(async city => {
      if (city.id !== id) return city;
      const updatedCity = { ...city, favorite: !city.favorite };
      const ref = doc(this.firestore, `users/${uid}/favorites/${id}`);
      if (updatedCity.favorite) {
        await setDoc(ref, updatedCity).catch(() => {});
      } else {
        await deleteDoc(ref).catch(() => {});
      }
      return updatedCity;
    }));
    this.citiesSubject.next(updated);
  }

  addCity(name: string, lat: number, lng: number, imageUrl: string): void {
    const newCity: CityCard = {
      id: crypto.randomUUID(),
      name,
      imageUrl,
      lat,
      lng,
      favorite: false,
    };
    this.citiesSubject.next([...this.getCities(), newCity]);
  }

  updateCity(index: number, city: CityCard): void {
    const cities = [...this.getCities()];
    cities[index] = city;
    this.citiesSubject.next(cities);
  }

  removeCity(id: string): void {
    this.citiesSubject.next(this.getCities().filter(c => c.id !== id));
    this.removeFavorite(id);
  }

  removeFavorite(id: string): void {
    const cities = this.getCities().map(c => c.id === id ? { ...c, favorite: false } : c);
    this.citiesSubject.next(cities);
    deleteDoc(doc(this.firestore, `favorites`, id));
  }

  getDefaultImage(): string {
    return this.defaultImage;
  }

  private async loadFavorites() {
    const currentUser = await firstValueFrom(user(this.auth));
    if (!currentUser) return;
    const snapshot = await getDocs(collection(this.firestore, `users/${currentUser.uid}/favorites`));
    const favorites = snapshot.docs.map(doc => doc.data() as CityCard);
    this.citiesSubject.next(favorites);
  }
}
