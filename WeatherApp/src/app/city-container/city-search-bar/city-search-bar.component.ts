import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { CityService } from '../city.service';
import { WeatherService } from '../../shared/service/weatherService';
import { CityCard } from '../city-card.interface';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-city-search-bar',
  templateUrl: './city-search-bar.component.html',
  styleUrl: './city-search-bar.component.scss',
})
export class CitySearchBarComponent implements AfterViewInit {
  @ViewChild('searchBox') searchBox!: ElementRef;
  @Output() citySelected = new EventEmitter<CityCard>();

  cityName = '';
  lat = 0;
  lng = 0;
  imageUrl = '';

  constructor(
    private ngZone: NgZone,
    private cityService: CityService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchBox.nativeElement, { types: ['(cities)'] });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location && place.name) {
          this.cityName = place.name;
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
        }
        if (place.photos) {
          const photo = place.photos[1];
          this.imageUrl = photo.getUrl({ maxWidth: 700, maxHeight: 400 });
        }
      });
    });
  }

  addCity(): void {
    if (this.cityName && this.lat && this.lng) {
      this.cityService.addCity(this.cityName, this.lat, this.lng, this.imageUrl);
      const newCity = this.cityService.getCities().find(c => c.name === this.cityName && c.lat === this.lat && c.lng === this.lng);
      if (newCity) this.citySelected.emit(newCity);
      this.clear();
    }
  }

  searchCity(): void {
    this.router.navigate(['/weather', this.cityName]);
    this.weatherService.changeCity({ name: this.cityName, lat: this.lat, lng: this.lng });
    const foundCity = this.cityService.getCities().find(c => c.name === this.cityName && c.lat === this.lat && c.lng === this.lng);
    if (foundCity) this.citySelected.emit(foundCity);
  }

  addCityAndSearch(): void {
    if (this.cityName && this.lat && this.lng) {
      this.cityService.addCity(this.cityName, this.lat, this.lng, this.imageUrl);
      const newCity = this.cityService.getCities().find(c => c.name === this.cityName && c.lat === this.lat && c.lng === this.lng);
      if (newCity) {
        this.citySelected.emit(newCity);
        this.weatherService.changeCity({ name: newCity.name, lat: newCity.lat, lng: newCity.lng });
        this.router.navigate(['/weather', newCity.name]);
      }
      this.clear();
    }
  }

  private clear() {
    this.searchBox.nativeElement.value = '';
    this.cityName = '';
    this.lat = 0;
    this.lng = 0;
    this.imageUrl = '';
  }
}
