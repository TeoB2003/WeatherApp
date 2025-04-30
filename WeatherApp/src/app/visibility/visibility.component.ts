import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card'; 
@Component({
  selector: 'app-visibility',
  imports: [CardModule],
  templateUrl: './visibility.component.html',
  styleUrl: './visibility.component.scss'
})
export class VisibilityComponent {
  visibility=input(0)
}
