import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card'; 

@Component({
  selector: 'app-precipitation-probability',
  imports: [CardModule],
  templateUrl: './precipitation-probability.component.html',
  styleUrl: './precipitation-probability.component.scss'
})
export class PrecipitationProbabilityComponent {
  probabiliy=input(0);
}
