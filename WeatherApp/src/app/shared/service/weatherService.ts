import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of, throwError, tap, catchError, timer } from 'rxjs';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherData } from '../model/weatherData';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url = "https://api.open-meteo.com/v1/forecast";

  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  private currentWeatherData: any = null;
  constructor(private http: HttpClient) { }

  getCoordinatesForCity(cityName: string): Observable<{ latitude: number; longitude: number }> {
    const latitude = 44.439663;
    const longitude = 26.096306;

    return of({
      latitude,
      longitude
    });
  }

  async getWeatherByCity(city: string) {
    const params = {
      "latitude": 44.439663,
      "longitude": 26.096306,
      "daily": "uv_index_max",
      "hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "visibility", "surface_pressure"],
      "timezone": "auto"
    };
    const responses = await fetchWeatherApi(this.url, params);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const weatherData = {
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        apparentTemperature: hourly.variables(1)!.valuesArray()!,
        precipitationProbability: hourly.variables(2)!.valuesArray()!,
        precipitation: hourly.variables(3)!.valuesArray()!,
        visibility: hourly.variables(4)!.valuesArray()!,
        surfacePressure: hourly.variables(5)!.valuesArray()!,
      },
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        uvIndexMax: daily.variables(0)!.valuesArray()!,
      },
    };

    let now=new Date()
    console.log(now)

    let hour=now.getHours()
    console.log(hour)

    let apparentTemperatureNow=weatherData.hourly.apparentTemperature[hour]
    let maxTemperature=-100
    let minTemperature=100
    let uvIndex=0
    let visibilityNow=0
    let precipitationProbability=0 
    let maxHour=0


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

      if(maxTemperature< weatherData.hourly.temperature2m[i])
        maxTemperature= weatherData.hourly.temperature2m[i]

      if(minTemperature> weatherData.hourly.temperature2m[i])
        minTemperature= weatherData.hourly.temperature2m[i]

      if(precipitationProbability<weatherData.hourly.precipitationProbability[i])
      {
        precipitationProbability=weatherData.hourly.precipitationProbability[i]
        maxHour=i
      }
    }

    let result:WeatherData={
      maxTemperatureToday:maxTemperature,
      minTemperatureToday:minTemperature,
      maxPrecipitationProbabilityToday:{prob: precipitationProbability, hour:maxHour},
      visibilityNow:visibilityNow,
      UVIndex:uvIndex,
      apparentTemperature:apparentTemperatureNow
    }

    return result

  }
}
