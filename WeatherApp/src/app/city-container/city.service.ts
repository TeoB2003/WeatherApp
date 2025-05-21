import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CityCard } from '../city-container/city-card.interface';

@Injectable({ providedIn: 'root' })
export class CityService {
  private readonly URL =
    'https://images.unsplash.com/photo-1507961455425-0caef37ef6fe?q=80&w=2408&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  private citiesSubject = new BehaviorSubject<CityCard[]>([]);
  cities$: Observable<CityCard[]> = this.citiesSubject.asObservable();

  constructor() {}

  getCities(): CityCard[] {
    return this.citiesSubject.getValue();
  }

  getFavoriteCities(): CityCard[] {
    return this.getCities().filter((city) => city.favorite);
  }

  addFavoriteCity(id: string): void {
    const cities = this.getCities();
    const updatedCities = cities.map((city) =>
      city.id === id ? { ...city, favorite: !city.favorite} : city
    );
    this.citiesSubject.next(updatedCities);
  }

  removeFavoriteCity(id: string): void {
    const cities = this.getCities();
    const updatedCities = cities.map((city) =>
      city.id === id ? { ...city, favorite: false } : city
    );
    this.citiesSubject.next(updatedCities);
  }

  addCity(name: string, lat: number, lng: number, imageUrl:string): void {
    //const imageUrl: string = this.getCityImage();
    const newCity: CityCard = {
      id: crypto.randomUUID(),
      name,
      imageUrl,
      lat,
      lng,
      favorite: true,
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
    console.log(this.getCities());
    const updated = this.getCities().filter((city) => city.id !== id);
    this.citiesSubject.next(updated);
  }

  getCityImage(): string {
    return this.URL;
  }
}
