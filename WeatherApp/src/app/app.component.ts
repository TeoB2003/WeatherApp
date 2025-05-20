import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DayHighlightsComponent } from './day-highlights/day-highlights.component';
import { CityContainerComponent } from './city-container/city-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'WeatherApp';
  router = inject(Router);
}
