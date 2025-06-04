import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-temperature',
  imports: [CardModule, CommonModule],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss'
})
export class TemperatureComponent {
    minT=input(0)
    maxT=input(0)
    @Input() isCelsius: boolean = true;
}
