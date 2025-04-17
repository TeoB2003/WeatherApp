import { Component } from '@angular/core';
import { TemperatureComponent } from "../temperature/temperature.component";

@Component({
  selector: 'app-day-highlights',
  imports: [TemperatureComponent],
  templateUrl: './day-highlights.component.html',
  styleUrl: './day-highlights.component.scss'
})
export class DayHighlightsComponent {

}
