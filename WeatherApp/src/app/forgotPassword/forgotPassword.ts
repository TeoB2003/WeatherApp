import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './forgotPassword.html',
  styleUrls: ['./forgotPassword.scss'],
  imports: [FormsModule, CommonModule],
})
export class ResetPasswordComponent {
  email = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    const error = await this.authService.resetPassword(this.email);
    this.message = error ? error : 'Check your inbox for the reset link!';
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
