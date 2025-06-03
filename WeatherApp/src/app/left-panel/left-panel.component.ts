import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CityService } from '../city-container/city.service';

@Component({
  selector: 'app-left-panel',
  imports: [],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  username: string = '';
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe((cities) => {});
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('username');
    this.username = '';

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
