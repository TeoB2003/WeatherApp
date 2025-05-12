import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LeftPanelComponent } from "../left-panel/left-panel.component";
import { DayHighlightsComponent } from "../day-highlights/day-highlights.component";
import { CityContainerComponent } from "../city-container/city-container.component";
import { CityCardComponent } from "../city-container/city-card/city-card.component";
@Component({
  selector: 'app-weather-for-location',
  imports: [ButtonModule, LeftPanelComponent, DayHighlightsComponent, CityContainerComponent, CityCardComponent],
  templateUrl: './weather-for-location.component.html',
  styleUrl: './weather-for-location.component.scss'
})
export class WeatherForLocationComponent {
  city:string = "Bucharest";
  ngOnInit(): void {
    }
}
