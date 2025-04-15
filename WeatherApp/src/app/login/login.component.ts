import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = null;

    try {
      const error = await this.authService.login(this.email, this.password);
      if (error) {
        this.errorMessage = error;
      }
    } catch (error) {
      this.errorMessage = 'A apărut o eroare neașteptată. Încearcă din nou!';
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}