import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Observable,
  switchMap,
  of,
  throwError,
  tap,
  catchError,
  timer,
  last, map
} from 'rxjs';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from '../model/weatherData';
import { BehaviorSubject } from 'rxjs';
import { City } from '../model/city';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  url = 'https://api.open-meteo.com/v1/forecast';

  private readonly geocodingUrl =
    'https://geocoding-api.open-meteo.com/v1/search';

  private currentWeatherData: any = null;

  http = inject(HttpClient);

  currentCity: City;
  private citySubject: BehaviorSubject<City>;
  currentCity$: Observable<City>;

  constructor() {
    const saved = localStorage.getItem('selectedCity');
    this.currentCity = saved ? JSON.parse(saved) : {
      name: 'Bucharest',
      lat: 44.439663,
      lng: 26.096306,
    };
    this.citySubject = new BehaviorSubject<City>(this.currentCity);
    this.currentCity$ = this.citySubject.asObservable();
  }

  changeCity(newCity: City) {
    this.currentCity = newCity;
    this.citySubject.next(newCity);
    localStorage.setItem('selectedCity', JSON.stringify(newCity));
  }

getWeatherByCity(): Observable<WeatherData> {
  const params = new URLSearchParams({
    latitude: this.currentCity.lat.toString(),
    longitude: this.currentCity.lng.toString(),
    daily: 'uv_index_max',
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'visibility',
      'rain',
      'showers',
      'snowfall',
    ].join(','),
    current: ['apparent_temperature', 'rain', 'showers', 'snowfall', 'visibility'].join(','),
    timezone: 'auto',
  });

  return this.http.get<any>(`${this.url}?${params}`).pipe(
    map(response => {
      const current = response.current;
      const hourly = response.hourly;
      const daily = response.daily;

      const hourlyTimes: Date[] = hourly.time.map((t: string) => new Date(t));

      const temperatureArray = hourly.temperature_2m;
      const precipitationProbabilityArray = hourly.precipitation_probability;

      const first24 = precipitationProbabilityArray.slice(0, 24);
      const maxProb = Math.max(...first24);
      const maxHourIndex = first24.indexOf(maxProb);

      const weatherData: WeatherData = {
        maxTemperatureToday: Math.max(...temperatureArray),
        minTemperatureToday: Math.min(...temperatureArray),
        maxPrecipitationProbabilityToday: {
          prob: maxProb,
          hour: maxHourIndex,
        },
        visibilityNow: current.visibility,
        UVIndex: daily.uv_index_max[0],
        apparentTemperature: current.apparent_temperature,
        precipitation: {
          showers: current.showers,
          snowfall: current.snowfall,
          rain: current.rain,
        },
        precipitationNow: precipitationProbabilityArray[new Date().getHours()],
        hourlyTemperatures: temperatureArray.map((temp: number, i: number) => ({
          hour: hourlyTimes[i].toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          temp,
        })),
      };
      return weatherData;
    }),
    catchError(error => {
      console.error('Failed to fetch weather data:', error);
      return throwError(() => error);
    })
  );
}

}

