import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; 
@Component({
  selector: 'app-uv',
  imports: [CardModule, CommonModule],
  templateUrl: './uv.component.html',
  styleUrl: './uv.component.scss'
})
export class UvComponent {
    uv=input(0)
}
