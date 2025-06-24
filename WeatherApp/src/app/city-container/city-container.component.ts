import { Component, HostListener } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CityService } from './city.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CityCard } from './city-card.interface';
import { CitySearchBarComponent } from './city-search-bar/city-search-bar.component';
import { CarouselModule } from 'primeng/carousel';
import { WeatherService } from '../shared/service/weatherService';

@Component({
  selector: 'app-city-container',
  imports: [
    CityCardComponent,
    FormsModule,
    CommonModule,
    CitySearchBarComponent,
    CarouselModule,
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

  constructor(
    private cityService: CityService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe((cities) => {
      if (this.currentCity) {
        this.currentCity =
          cities.find((c) => c.id === this.currentCity?.id) || null;
      }
      if (!this.currentCity) {
        this.currentCity = cities.find((c) => c.favorite) || null;
      }
      if (this.currentCity) {
        this.cities = [
          this.currentCity,
          ...cities.filter((c) => c.id !== this.currentCity!.id && c.favorite),
        ];
      } else {
        this.cities = cities.filter((c) => c.favorite);
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

  async favoriteCity(id: string): Promise<void> {
    await this.cityService.addFavoriteCity(id);
  }

  setCurrentCity(city: CityCard) {
    this.currentCity = city;
    this.weatherService.changeCity({
      name: city.name,
      lat: city.lat,
      lng: city.lng,
    });
    const allCities = this.cityService.getCities();
    if (city.favorite) {
      this.cities = [
        city,
        ...allCities.filter((c) => c.id !== city.id && c.favorite),
      ];
    } else {
      this.cities = [
        city,
        ...allCities.filter((c) => c.id !== city.id && c.favorite),
      ];
    }
  }
}
