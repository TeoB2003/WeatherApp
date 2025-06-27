import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CityCard } from '../city-card.interface';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar-city-card',
  imports: [ListboxModule, ButtonModule],
  templateUrl: './sidebar-city-card.component.html',
  styleUrl: './sidebar-city-card.component.scss',
})
export class SidebarCityCardComponent {
  @Input() city!: CityCard;
  @Output() remove = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();

  onRemove(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(this.city.id);
  }

  onSelect() {
    this.select.emit(this.city.id);
  }
}
