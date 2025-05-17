import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of, throwError, tap, catchError, timer, last } from 'rxjs';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from '../model/weatherData';
import { city } from '../model/city';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url = "https://api.open-meteo.com/v1/forecast";

  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  private currentWeatherData: any = null;
  constructor(private http: HttpClient) { }

  currentCity: city = {
    name: 'Bucharest',
    lat: 44.439663,
    lng: 26.096306
  }

  private citySubject = new BehaviorSubject<city>(this.currentCity);

  // Expose the observable part of the BehaviorSubject
  currentCity$ = this.citySubject.asObservable();
  changeCity(newCity: city)
  {
    this.currentCity=newCity
    this.citySubject.next(newCity);
  }
  async getWeatherByCity() {
    const params = {
      "latitude": this.currentCity.lat,
      "longitude": this.currentCity.lng,
      "daily": "uv_index_max",
      "hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "visibility", "rain", "showers", "snowfall"],
      "current": ["apparent_temperature", "rain", "showers", "snowfall"],
      "timezone": "auto"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        apparentTemperature: current.variables(0)!.value(),
        rain: current.variables(1)!.value(),
        showers: current.variables(2)!.value(),
        snowfall: current.variables(3)!.value(),
      },
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        apparentTemperature: hourly.variables(1)!.valuesArray()!,
        precipitationProbability: hourly.variables(2)!.valuesArray()!,
        precipitation: hourly.variables(3)!.valuesArray()!,
        visibility: hourly.variables(4)!.valuesArray()!,
        rain: hourly.variables(5)!.valuesArray()!,
        showers: hourly.variables(6)!.valuesArray()!,
        snowfall: hourly.variables(7)!.valuesArray()!,
      },
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        uvIndexMax: daily.variables(0)!.valuesArray()!,
      },
    };

    let now = new Date()


    let hour = now.getHours()

    let maxTemperature = -100
    let minTemperature = 100
    let visibilityNow = weatherData.hourly.visibility[hour]
    let precipitationProbability = 0
    let maxHour = 0


    //merg doar pe ziua curenta
    for (let i = 0; i < 24; i++) {
      /*console.log(
        weatherData.hourly.time[i].toISOString(),
        weatherData.hourly.temperature2m[i],
        weatherData.hourly.apparentTemperature[i],
        weatherData.hourly.precipitationProbability[i],
        weatherData.hourly.precipitation[i],
        weatherData.hourly.visibility[i],
        weatherData.hourly.surfacePressure[i]
      );*/

      if (maxTemperature < weatherData.hourly.temperature2m[i])
        maxTemperature = weatherData.hourly.temperature2m[i]

      if (minTemperature > weatherData.hourly.temperature2m[i])
        minTemperature = weatherData.hourly.temperature2m[i]

      if (precipitationProbability < weatherData.hourly.precipitationProbability[i] && i>=hour) {
        precipitationProbability = weatherData.hourly.precipitationProbability[i]
        maxHour = i
      }
    }

    let result: WeatherData = {
      maxTemperatureToday: maxTemperature,
      minTemperatureToday: minTemperature,
      maxPrecipitationProbabilityToday: { prob: precipitationProbability, hour: maxHour },
      visibilityNow: visibilityNow,
      UVIndex: weatherData.daily.uvIndexMax[0],
      apparentTemperature: weatherData.current.apparentTemperature,
      precipitation: {
        showers: weatherData.current.showers,
        snowfall: weatherData.current.snowfall,
        rain: weatherData.current.rain
      },
      precipitationNow: weatherData.hourly.precipitationProbability[hour]
    }

    return result

  }
}
