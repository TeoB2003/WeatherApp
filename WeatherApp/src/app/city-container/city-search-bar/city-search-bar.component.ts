import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { CityService } from '../city.service';
import { WeatherService } from '../../shared/service/weatherService';
import { CityCard } from '../city-card.interface';

declare const google: any;

@Component({
  selector: 'app-city-search-bar',
  templateUrl: './city-search-bar.component.html',
  styleUrl: './city-search-bar.component.scss',
})
export class CitySearchBarComponent implements AfterViewInit {
  @ViewChild('searchBox') searchBox!: ElementRef;
  @Output() citySelected = new EventEmitter<CityCard>();

  selectedCityName: string = '';
  selectedLat: number = 0;
  selectedLng: number = 0;
  imageURL: string = ''

  weatherService = inject(WeatherService)

  constructor(private ngZone: NgZone, private cityService: CityService) { }


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

        if (place.photos) {
          const photo = place.photos[1];
          const photoUrl = photo.getUrl({ maxWidth: 700, maxHeight: 400 });
          //console.log(photoUrl);
          this.imageURL=photoUrl
        }
      });
    });

  }

  addCity(): void {
    if (this.selectedCityName && this.selectedLat && this.selectedLng) {
      this.cityService.addCity(
        this.selectedCityName,
        this.selectedLat,
        this.selectedLng,
        this.imageURL,
      );
      const newCity = this.cityService.getCities().find(
        c => c.name === this.selectedCityName && c.lat === this.selectedLat && c.lng === this.selectedLng
      );
      if (newCity) {
        this.citySelected.emit(newCity);
      }

      this.searchBox.nativeElement.value = '';
      this.selectedCityName = '';
      this.selectedLat = 0;
      this.selectedLng = 0;
    }
  }
  searchCity() {
    this.weatherService.changeCity({
      name: this.selectedCityName,
      lat: this.selectedLat,
      lng: this.selectedLng
    })
    const foundCity = this.cityService.getCities().find(
      c => c.name === this.selectedCityName && c.lat === this.selectedLat && c.lng === this.selectedLng
    );
    if (foundCity) {
      this.citySelected.emit(foundCity);
    }
  }
}
