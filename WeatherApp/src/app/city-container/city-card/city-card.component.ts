import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-city-card',
  imports: [],
  templateUrl: './city-card.component.html',
  styleUrl: './city-card.component.scss'
})
export class CityCardComponent {
  @Input() cityName: string = 'City Name';
  @Input() backgroundImage: string = 'default-image.jpg';
  @Output() remove = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.backgroundImage)
  }

  onRemove(): void {
    console.log(this.backgroundImage)
    this.remove.emit();
  }
}
