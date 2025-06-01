import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CityService } from '../city-container/city.service';
import { CityCard } from '../city-container/city-card.interface';
import { SidebarCityCardComponent } from '../city-container/sidebar-city-card/sidebar-city-card.component';

@Component({
  selector: 'app-left-panel',
  imports: [SidebarCityCardComponent],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  favoriteCities: CityCard[] = [];
  username: string = '';
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.cities$.subscribe((cities) => {
      this.favoriteCities = cities.filter((city) => city.favorite);
    });
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  removeFavoriteCity(id: string): void {
    this.cityService.removeFavoriteCity(id);
  }

  logout(): void {
    localStorage.removeItem('username');
    this.username = '';

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
