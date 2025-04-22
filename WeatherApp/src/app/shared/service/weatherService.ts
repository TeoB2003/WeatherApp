import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of, throwError,tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private currentWeatherData: any =null;  
  constructor(private http: HttpClient) {}

  getCoordinatesForCity(cityName: string): Observable<{ latitude: number; longitude: number }> {
    /*const params = new HttpParams().set('name', cityName).set('count', '1');

    return this.http.get<any>(this.geocodingUrl, { params }).pipe(
      switchMap(response => {
        if (response.results && response.results.length > 0) {
          const { latitude, longitude } = response.results[0];
          return of({ latitude, longitude }); 
        } else {
          return throwError(() => new Error('not found the city')); 
        }
      })
    );*/
    const latitude = 44.4268; // Exemplu de latitudine
    const longitude = 26.1025; // Exemplu de longitudine

    return of({
        latitude,
        longitude
      });
  }

  getWeatherByCity(city: string): Observable<any> {
    return this.getCoordinatesForCity(city).pipe(
      switchMap(coords => {
        const params = new HttpParams()
          .set('latitude', coords.latitude.toString())
          .set('longitude', coords.longitude.toString())
          .set('current_weather', 'true')
          .set('timezone', 'auto');

        return this.http.get(this.weatherUrl, { params });
      }),
      tap(response => {
        this.currentWeatherData = response; 
      }),
      catchError(error => {
        console.error('Eroare la obținerea vremii:', error);
        this.currentWeatherData = null;
        return throwError(() => error);
      })
    );
  }

  getTemperature(){
    console.log(this.currentWeatherData)
    return this.currentWeatherData.current_weather.temperature
  }
}
