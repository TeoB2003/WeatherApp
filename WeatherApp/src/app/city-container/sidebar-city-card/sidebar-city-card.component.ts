import { Component, Input } from '@angular/core';
import { CityCard } from '../city-card.interface';
import {ListboxModule} from 'primeng/listbox';
import {ButtonModule} from 'primeng/button';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';


@Component({
  selector: 'app-sidebar-city-card',
  imports: [ ListboxModule, ButtonModule],
  templateUrl: './sidebar-city-card.component.html',
  styleUrl: './sidebar-city-card.component.scss',
})
export class SidebarCityCardComponent {
  @Input() city!: CityCard;
  @Output() remove = new EventEmitter<string>();
  @Output() click = new EventEmitter<string>();

  onRemove(): void {
    this.remove.emit(this.city.id);
  }

  onClick(): void{
    console.log(this.city.id);
    this.click.emit(this.city.id);
  }
}
