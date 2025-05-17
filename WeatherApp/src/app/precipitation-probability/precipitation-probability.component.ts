import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card'; 

@Component({
  selector: 'app-precipitation-probability',
  imports: [CardModule],
  templateUrl: './precipitation-probability.component.html',
  styleUrl: './precipitation-probability.component.scss'
})
export class PrecipitationProbabilityComponent {
  maxProbabiliy=input(0);
  maxHour=input(0)
  probabilityNow=input(0)
}
