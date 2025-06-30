import { Component, HostListener, ViewChild } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CityService } from './city.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityCard } from './city-card.interface';
import { CitySearchBarComponent } from './city-search-bar/city-search-bar.component';
import { CarouselModule } from 'primeng/carousel';
import { WeatherService } from '../shared/service/weatherService';
import { Carousel } from 'primeng/carousel';
import { Router } from '@angular/router';

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
  visibleItems = 3;
  currentIndex = 0;
  maxIndex = 0;
  @ViewChild(Carousel) carousel?: Carousel;

  constructor(
    private cityService: CityService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe((cities) => {
      // Try to get the selected city from WeatherService (persisted)
      const selected = cities.find(
        (c) =>
          c.name === this.weatherService.currentCity.name &&
          c.lat === this.weatherService.currentCity.lat &&
          c.lng === this.weatherService.currentCity.lng
      );
      this.currentCity = selected || (cities.length ? cities[0] : null);
      this.cities = this.currentCity
        ? [this.currentCity, ...cities.filter((c) => c.id !== this.currentCity!.id && c.favorite)]
        : cities.filter((c) => c.favorite);
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
    this.maxIndex = Math.max(0, this.cities.length - this.visibleItems);
  }

  prev() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  next() {
    this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
  }

  removeCity(id: string) {
    this.cityService.removeCity(id);
    this.maxIndex = Math.max(0, this.cities.length - this.visibleItems);
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  async favoriteCity(id: string) {
    await this.cityService.toggleFavorite(id);
  }

  setCurrentCity(city: CityCard) {
    this.currentCity = city;
    this.weatherService.changeCity({ name: city.name, lat: city.lat, lng: city.lng });
    const all = this.cityService.getCities();
    this.cities = [city, ...all.filter((c) => c.id !== city.id && c.favorite)];
    if (this.carousel) {
      this.carousel.page = 0;
    }
    this.router.navigate(['/weather', city.name]);
  }
}
