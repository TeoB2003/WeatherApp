import { Component, inject, input } from '@angular/core';
import { TemperatureComponent } from "../temperature/temperature.component";
import { WeatherService } from '../shared/service/weatherService';
import { ActivatedRoute } from '@angular/router';
import { PrecipitationProbabilityComponent } from "../precipitation-probability/precipitation-probability.component";
import { ApparentTemperatureComponent } from "../apparent-temperature/apparent-temperature.component";
import { WeatherData } from '../shared/model/weatherData';
import { VisibilityComponent } from "../visibility/visibility.component";
import { UvComponent } from "../uv/uv.component";
import { PrecipitationsComponent } from "../precipitations/precipitations.component";

@Component({
  selector: 'app-day-highlights',
  imports: [TemperatureComponent, PrecipitationProbabilityComponent, ApparentTemperatureComponent, VisibilityComponent, UvComponent, PrecipitationsComponent],
  templateUrl: './day-highlights.component.html',
  styleUrl: './day-highlights.component.scss'
})
export class DayHighlightsComponent {
    dataService=inject(WeatherService);
    weatherData!:WeatherData
    city= input<string>("");

  async ngOnInit(): Promise<void> {
      this.weatherData=await this.dataService.getWeatherByCity('')
      console.log(this.weatherData)
  }
}
