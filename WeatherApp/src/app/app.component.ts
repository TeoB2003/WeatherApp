import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LeftPanelComponent } from "./left-panel/left-panel.component";
import { DayHighlightsComponent } from "./day-highlights/day-highlights.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, LeftPanelComponent, DayHighlightsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WeatherApp';
}
