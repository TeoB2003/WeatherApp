import { Component, HostListener } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CityService } from './city.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CityCard } from './city-card.interface';
import { CitySearchBarComponent } from './city-search-bar/city-search-bar.component';

@Component({
  selector: 'app-city-container',
  imports: [
    CityCardComponent,
    FormsModule,
    CommonModule,
    CitySearchBarComponent,
  ],
  templateUrl: './city-container.component.html',
  styleUrl: './city-container.component.scss',
})
export class CityContainerComponent {
  cities: CityCard[] = [];
  currentCity: CityCard | null = null;
  cities$: Observable<CityCard[]> | undefined;
  newCity: string = '';

  currentIndex = 0;
  visibleItems = 3;
  maxIndex = 0;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe((cities) => {
      this.cities = cities;
      if (this.currentCity) {
        this.currentCity =
          cities.find((c) => c.id === this.currentCity?.id) || null;
      } else {
        this.currentCity = cities.length > 0 ? cities[0] : null;
      }
      if (this.currentCity) {
        this.cities = [
          this.currentCity,
          ...cities.filter((c) => c.id !== this.currentCity!.id),
        ];
      }
      this.updateVisibleItems();
    });
    this.updateVisibleItems();
  }
  @HostListener('window:resize')
  onResize() {
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    const width = window.innerWidth;
    this.visibleItems =
      width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 768 ? 2 : 1;
    this.calculateMaxIndex();
  }

  calculateMaxIndex() {
    this.maxIndex = Math.max(0, this.cities.length - this.visibleItems);
  }

  get transformValue() {
    const percentage = (100 / this.visibleItems) * this.currentIndex;
    return `translateX(-${percentage}%)`;
  }

  prev() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  next() {
    this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
  }

  removeCity(id: string): void {
    this.cityService.removeCity(id);
    this.cities$?.forEach((cities) => {
      console.log(cities);
    });
    this.calculateMaxIndex();
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  editCity(index: number, newName: string): void {
    const cities = this.cityService.getCities();
    const updatedCity = {
      ...cities[index],
      name: newName,
    };
    this.cityService.updateCity(index, updatedCity);
  }

  favoriteCity(id: string): void {
    console.log('📌 favoriteCity called with:', id);
    this.cityService.addFavoriteCity(id);
  }

  setCurrentCity(city: CityCard) {
    this.currentCity = city;
    this.cities = [city, ...this.cities.filter((c) => c.id !== city.id)];
  }
}
