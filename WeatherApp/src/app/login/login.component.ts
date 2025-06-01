import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    const error = await this.authService.login(this.email, this.password);
    if (error) {
      alert('Login failed: ' + error);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToReset() {
    this.router.navigate(['/reset-password']);
  }
}
