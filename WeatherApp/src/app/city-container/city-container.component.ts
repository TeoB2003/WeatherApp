import { Component} from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CityService } from './city.service';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CityCard } from './city-card.interface';

@Component({
  selector: 'app-city-container',
  imports: [CityCardComponent, FormsModule, CarouselModule, CommonModule],
  templateUrl: './city-container.component.html',
  styleUrl: './city-container.component.scss'
})
export class CityContainerComponent {
  cities: CityCard[] = [];
  cities$: Observable<CityCard[]> | undefined;
  newCity: string = '';

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];


  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe(cities => {
      this.cities = [...cities];
    });
  }

  addCity(): void {
    const trimmedName = this.newCity.trim();
    if (trimmedName) {
      const imageUrl = this.cityService.getCityImage();
      this.cityService.addCity(trimmedName, imageUrl);
      this.newCity = '';
    }
  }

  removeCity(id: string): void {
    this.cityService.removeCity(id);
    this.cities$?.forEach(cities => {console.log(cities)});
  }


  editCity(index: number, newName: string): void {
    const cities = this.cityService.getCities();
    const updatedCity = {
      ...cities[index],
      name: newName
    };
    this.cityService.updateCity(index, updatedCity);
  }
}
