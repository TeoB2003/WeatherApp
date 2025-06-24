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
  @Output() select = new EventEmitter<CityCard>();

  weatherService = inject(WeatherService)
  router = inject(Router)

  toggleFavorite() {
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

  onCardClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('favorite-btn')) {
      return;
    }
    this.select.emit(this.city);
  }
}
