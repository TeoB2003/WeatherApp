import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CityCard } from '../city-container/city-card.interface';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { user, Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class CityService {
  private readonly URL =
    'https://images.unsplash.com/photo-1507961455425-0caef37ef6fe?q=80&w=2408';
  private citiesSubject = new BehaviorSubject<CityCard[]>([]);
  cities$: Observable<CityCard[]> = this.citiesSubject.asObservable();
  private auth: Auth = inject(Auth);

  private firestore: Firestore = inject(Firestore);
  private FAVORITES_PATH = 'favorites';

  constructor(private authService: AuthService) {
    console.log('📦 CityService initialized');
    this.loadFavoritesFromFirestore();
  }

  getCities(): CityCard[] {
    return this.citiesSubject.getValue();
  }

  getFavoriteCities(): CityCard[] {
    return this.getCities().filter((city) => city.favorite);
  }

  async addFavoriteCity(id: string): Promise<void> {
    const currentUser = await firstValueFrom(user(this.auth));
    if (!currentUser) {
      console.warn('⚠️ User not logged in');
      return;
    }

    const uid = currentUser.uid;
    const cities = this.getCities();

    const updatedCities = cities.map((city) => {
      if (city.id === id) {
        const updatedCity = { ...city, favorite: !city.favorite };
        const ref = doc(this.firestore, `users/${uid}/favorites/${id}`);

        if (updatedCity.favorite) {
          console.log('⭐ Adding to favorites:', updatedCity.name);
          setDoc(ref, updatedCity)
            .then(() => console.log('✅ Added'))
            .catch((err) => console.error('❌ Error adding:', err));
        } else {
          console.log('🗑️ Removing from favorites:', updatedCity.name);
          deleteDoc(ref)
            .then(() => console.log('✅ Removed'))
            .catch((err) => console.error('❌ Error removing:', err));
        }

        return updatedCity;
      }

      return city;
    });

    this.citiesSubject.next(updatedCities);
  }

  removeFavoriteCity(id: string): void {
    const cities = this.getCities();
    const updatedCities = cities.map((city) =>
      city.id === id ? { ...city, favorite: false } : city
    );
    this.citiesSubject.next(updatedCities);
    deleteDoc(doc(this.firestore, this.FAVORITES_PATH, id));
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

    const updated = [...this.getCities(), newCity];
    this.citiesSubject.next(updated);
  }

  updateCity(index: number, updatedCity: CityCard): void {
    const cities = [...this.getCities()];
    cities[index] = updatedCity;
    this.citiesSubject.next(cities);
  }

  removeCity(id: string): void {
    const updated = this.getCities().filter((city) => city.id !== id);
    this.citiesSubject.next(updated);
    this.removeFavoriteCity(id);
  }

  getCityImage(): string {
    return this.URL;
  }

  private async loadFavoritesFromFirestore() {
    console.log('🔄 Waiting for user...');

    const currentUser = await firstValueFrom(user(this.auth));

    if (!currentUser) {
      console.warn('❌ No logged-in user');
      return;
    }

    console.log('✅ Logged-in UID:', currentUser.uid);

    const snapshot = await getDocs(
      collection(this.firestore, `users/${currentUser.uid}/favorites`)
    );

    const favoriteDocs = snapshot.docs.map((doc) => doc.data() as CityCard);
    console.log('📥 Loaded favorites:', favoriteDocs);

    this.citiesSubject.next(favoriteDocs);
  }
}
