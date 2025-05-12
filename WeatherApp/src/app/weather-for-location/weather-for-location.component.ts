import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LeftPanelComponent } from "../left-panel/left-panel.component";
import { DayHighlightsComponent } from "../day-highlights/day-highlights.component";
import { CityContainerComponent } from '../city-container/city-container.component';
@Component({
  selector: 'app-weather-for-location',
  imports: [ButtonModule, LeftPanelComponent, DayHighlightsComponent, CityContainerComponent],
  templateUrl: './weather-for-location.component.html',
  styleUrl: './weather-for-location.component.scss'
})
export class WeatherForLocationComponent {
  city:string = "";
  route=inject(ActivatedRoute)
  ngOnInit(): void {
    console.log(this.route.snapshot)
    this.city = this.route.snapshot.paramMap.get('cityName') || '';
    console.log('City din path:', this.city);
    }
}
