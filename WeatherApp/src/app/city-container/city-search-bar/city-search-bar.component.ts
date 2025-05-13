import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  inject,
} from '@angular/core';
import { CityService } from '../city.service';
import { WeatherService } from '../../shared/service/weatherService';

declare const google: any;

@Component({
  selector: 'app-city-search-bar',
  templateUrl: './city-search-bar.component.html',
  styleUrl: './city-search-bar.component.scss',
})
export class CitySearchBarComponent implements AfterViewInit {
  @ViewChild('searchBox') searchBox!: ElementRef;

  selectedCityName: string = '';
  selectedLat: number = 0;
  selectedLng: number = 0;
  weatherService=inject(WeatherService)

  constructor(private ngZone: NgZone, private cityService: CityService) {}


  ngAfterViewInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(
      this.searchBox.nativeElement,
      {
        types: ['(cities)'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location && place.name) {
          this.selectedCityName = place.name;
          this.selectedLat = place.geometry.location.lat();
          this.selectedLng = place.geometry.location.lng();
        }
      });
    });
  }

  addCity(): void {
    if (this.selectedCityName && this.selectedLat && this.selectedLng) {
      this.cityService.addCity(
        this.selectedCityName,
        this.selectedLat,
        this.selectedLng
      );

      this.searchBox.nativeElement.value = '';
      this.selectedCityName = '';
      this.selectedLat = 0;
      this.selectedLng = 0;
    }
  }
  searchCity()
  {
    this.weatherService.changeCity({
       name:this.selectedCityName,
        lat: this.selectedLat,
        lng: this.selectedLng
    })
  }
}
