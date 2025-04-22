import { Component, inject, input } from '@angular/core';
import { TemperatureComponent } from "../temperature/temperature.component";
import { WeatherService } from '../shared/service/weatherService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-day-highlights',
  imports: [TemperatureComponent],
  templateUrl: './day-highlights.component.html',
  styleUrl: './day-highlights.component.scss'
})
export class DayHighlightsComponent {
    dataService=inject(WeatherService);

    city= input<string>("");

    temperature=0
  ngOnInit(): void {

    if (this.city) {
      this.dataService.getWeatherByCity(this.city()).subscribe({
        next: (data) => {
          console.log('meteo data:', data);
          this.temperature=data.current_weather.temperature
          console.log(this.temperature)
        },
        error: (err) => {
          console.error('fetch error:', err.message);
        }
      });
    }
  }
}
