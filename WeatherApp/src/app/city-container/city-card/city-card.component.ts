import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CityCard } from '../city-card.interface';

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss',
})
export class CityCardComponent {
  @Input() city!: CityCard;
  @Output() remove = new EventEmitter<string>();
  @Output() favorite = new EventEmitter<string>();
  @Output() select = new EventEmitter<CityCard>();

  onToggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    this.favorite.emit(this.city.id);
  }

  onRemove(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(this.city.id);
  }

  onCardClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('favorite-btn')) return;
    this.select.emit(this.city);
  }
}
