import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DayHighlightsComponent } from "./day-highlights/day-highlights.component";
import { CityContainerComponent } from './city-container/city-container.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WeatherApp';
  router=inject(Router)
  goToCity(city: string): void {
    this.router.navigate(['/weather', city]);
  }

  shouldShowButtons(): boolean {
    return this.router.url === '/';
  }
}
