import { Component, inject, Input, input, SimpleChanges } from '@angular/core';
import { TemperatureComponent } from './temperature/temperature.component';
import { WeatherService } from '../shared/service/weatherService';
import { ActivatedRoute } from '@angular/router';
import { PrecipitationProbabilityComponent } from './precipitation-probability/precipitation-probability.component';
import { ApparentTemperatureComponent } from './apparent-temperature/apparent-temperature.component';
import { WeatherData } from '../shared/model/weatherData';
import { VisibilityComponent } from './visibility/visibility.component';
import { UvComponent } from './uv/uv.component';
import { PrecipitationsComponent } from './precipitations/precipitations.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-day-highlights',
  templateUrl: './day-highlights.component.html',
  styleUrls: ['./day-highlights.component.scss'],
  imports: [
    NgxChartsModule,
    TemperatureComponent,
    PrecipitationProbabilityComponent,
    ApparentTemperatureComponent,
    VisibilityComponent,
    UvComponent,
    PrecipitationsComponent,
  ],
})
export class DayHighlightsComponent {
  dataService = inject(WeatherService);
  weatherData!: WeatherData;

  @Input() city: string = '';
  chartData: any[] = [];
  view: [number, number] = [600, 300];
  colorScheme = {
    domain: ['#3182ce'],
  };

  async ngOnInit(): Promise<void> {
    this.updateChartSize();
    window.addEventListener('resize', this.updateChartSize.bind(this));
    this.fetchWeatherData();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['city']) {
      await this.fetchWeatherData();
    }
  }

  private async fetchWeatherData(): Promise<void> {
    this.weatherData = await this.dataService.getWeatherByCity();
    console.log(this.weatherData);

    this.chartData = [
      {
        name: 'Temperature',
        series: this.weatherData.hourlyTemperatures.map((d) => ({
          name: d.hour,
          value: d.temp,
        })),
      },
    ];
  }
  updateChartSize(): void {
    const width = window.innerWidth;

    if (width >= 1024) {
      this.view = [600, 300];
    } else if (width >= 768) {
      this.view = [450, 250];
    } else {
      this.view = [320, 200];
    }
  }
  xAxisTickFormat = (val: string) => {
    const hour = parseInt(val.split(':')[0], 10);
    return hour % 3 === 0 ? val : '';
  };
}
