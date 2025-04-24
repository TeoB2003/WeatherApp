import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CityCard } from '../city-card.interface';

@Component({
  selector: 'app-city-card',
  imports: [],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss'
})
export class CityCardComponent {
  @Input() city!: CityCard;
  @Output() remove = new EventEmitter<string>();

  onRemove(): void {
    this.remove.emit(this.city.id);
  }
}
