import { Component, inject, input } from '@angular/core';
import { TemperatureComponent } from "../temperature/temperature.component";
import { WeatherService } from '../shared/service/weatherService';
import { ActivatedRoute } from '@angular/router';
import { PrecipitationProbabilityComponent } from "../precipitation-probability/precipitation-probability.component";
import { ApparentTemperatureComponent } from "../apparent-temperature/apparent-temperature.component";
import { WeatherData } from '../shared/model/weatherData';

@Component({
  selector: 'app-day-highlights',
  imports: [TemperatureComponent, PrecipitationProbabilityComponent, ApparentTemperatureComponent],
  templateUrl: './day-highlights.component.html',
  styleUrl: './day-highlights.component.scss'
})
export class DayHighlightsComponent {
    dataService=inject(WeatherService);
    weatherData!:WeatherData
    city= input<string>("");

  async ngOnInit(): Promise<void> {
      this.weatherData=await this.dataService.getWeatherByCity('')
  }
}
