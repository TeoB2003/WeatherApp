import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CityContainerComponent } from './city-container/city-container.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, CityContainerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WeatherApp';
}
