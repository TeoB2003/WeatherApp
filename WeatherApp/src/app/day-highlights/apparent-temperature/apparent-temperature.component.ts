import { CommonModule } from '@angular/common';
import { Component,input } from '@angular/core';
import { CardModule } from 'primeng/card'; 
@Component({
  selector: 'app-apparent-temperature',
  imports: [CardModule, CommonModule],
  templateUrl: './apparent-temperature.component.html',
  styleUrl: './apparent-temperature.component.scss'
})
export class ApparentTemperatureComponent {
  temperature=input(0)
}
