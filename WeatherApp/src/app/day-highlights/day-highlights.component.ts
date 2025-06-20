import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { TemperatureComponent } from './temperature/temperature.component';
import { WeatherService } from '../shared/service/weatherService';
import { PrecipitationProbabilityComponent } from './precipitation-probability/precipitation-probability.component';
import { ApparentTemperatureComponent } from './apparent-temperature/apparent-temperature.component';
import { WeatherData } from '../shared/model/weatherData';
import { VisibilityComponent } from './visibility/visibility.component';
import { UvComponent } from './uv/uv.component';
import { PrecipitationsComponent } from './precipitations/precipitations.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { curveNatural } from 'd3-shape';

@Component({
  selector: 'app-day-highlights',
  templateUrl: './day-highlights.component.html',
  styleUrls: ['./day-highlights.component.scss'],
  standalone: true,
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
  private dataService = inject(WeatherService);
  weatherData!: WeatherData;

  @Input() city: string = '';
  chartData: any[] = [];
  view: [number, number] = [600, 300];

  colorScheme = {
    domain: ['#3182ce'],
  };

  isCelsius: boolean = true;
  curve = curveNatural
  toggleUnit() {
    this.isCelsius = !this.isCelsius;
  }

  setCelsius(isC: boolean) {
    if (this.isCelsius !== isC) {
      this.isCelsius = isC;
      this.updateChartData();
    }
  }

  updateChartData() {
    if (!this.weatherData) return;

    this.chartData = [
      {
        name: 'Temperature',
        series: this.weatherData.hourlyTemperatures
          .slice(0, 24) // iei doar primele 24 de elemente
          .map((d) => ({
            name: d.hour,
            value: this.isCelsius ? d.temp : (d.temp * 9 / 5) + 32,
          })),
      },
    ];

    console.log(this.chartData);

  }

  ngOnInit(): void {
    this.updateChartSize();
    window.addEventListener('resize', this.updateChartSize.bind(this));
    this.fetchWeatherData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city']) {
      this.fetchWeatherData();
    }
  }

  private fetchWeatherData(): void {
    this.dataService.getWeatherByCity().subscribe({
      next: (data: WeatherData) => {
        this.weatherData = data;
        console.log(this.weatherData.visibilityNow)
        this.updateChartData();
      },
      error: (err) => {
        console.error('Failed to fetch weather data:', err);
      },
    });
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

  yAxisLabel(): string {
    return this.isCelsius ? 'Temp (°C)' : 'Temp (°F)';
  }
}
