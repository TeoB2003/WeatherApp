import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    try {
      const error = await this.authService.register(
        this.username,
        this.email,
        this.password
      );
      if (error) {
        this.errorMessage = error;
      }
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
