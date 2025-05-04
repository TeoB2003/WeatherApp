import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { WeatherForLocationComponent } from './weather-for-location/weather-for-location.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'weather/:cityName', component: WeatherForLocationComponent },
  { path: '**', redirectTo: 'login' }
];
