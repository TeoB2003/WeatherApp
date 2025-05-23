import { Component, inject } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CityCard } from '../city-card.interface';
import { WeatherService } from '../../shared/service/weatherService';
import { Router, RouterOutlet } from '@angular/router';
import { City } from '../../shared/model/city'
@Component({
  selector: 'app-city-card',
  imports: [],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss',
})
export class CityCardComponent {
  @Input() city!: CityCard;
  @Output() remove = new EventEmitter<string>();
  @Output() favorite = new EventEmitter<string>();

  weatherService = inject(WeatherService)
  router = inject(Router)
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favorite.emit(this.city.id);
  }

  onRemove(): void {
    this.remove.emit(this.city.id);
  }

  showData() {
    let newCity: City = { name: this.city.name, lat: this.city.lat, lng: this.city.lng }
    this.weatherService.changeCity(newCity)
    this.router.navigate(['/weather', this.city.name]);
  }
}
