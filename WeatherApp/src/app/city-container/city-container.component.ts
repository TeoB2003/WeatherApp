import { Component,  ViewChild, ElementRef  } from '@angular/core';
import { CityCardComponent } from './city-card/city-card.component';
import { CityImageService } from './city-image.service';
import { FormsModule } from '@angular/forms';

interface CityCard {
  name: string;
  imageUrl: string;
}


@Component({
  selector: 'app-city-container',
  imports: [CityCardComponent, FormsModule],
  templateUrl: './city-container.component.html',
  styleUrl: './city-container.component.scss'
})
export class CityContainerComponent {
  cities: CityCard[] = [];
  newCity = '';
  @ViewChild('carousel') carousel!: ElementRef;

  constructor(private cityImageService: CityImageService) {}

  addCity(): void {
    if (this.newCity.trim()) {
      const cityName = this.newCity.trim();
      const cityCard: CityCard = {
        name: cityName,
        imageUrl: this.cityImageService.getCityImage()
      };

      this.cities.push(cityCard);
      this.newCity = '';
    }
  }

  removeCity(index: number): void {
    this.cities.splice(index, 1);
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }

  updateScrollState() {
    const element = this.carousel.nativeElement;
    const threshold = 5;
  }
}
