import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async login(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/budget']);
      return null;
    } catch (error: any) {
      console.error('Login error:', error.message);
      return this.getErrorMessage(error.code, 'login');
    }
  }

  async register(email: string, password: string): Promise<string | null> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/budget']);
      return null;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return this.getErrorMessage(error.code, 'register');
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getUser() {
    return this.auth.currentUser;
  }

  getUserId(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  private getErrorMessage(
    errorCode: string,
    context: 'login' | 'register'
  ): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return context === 'login'
          ? 'Account does not exist. Please check your email!'
          : 'The account could not be created. Try a different email!';
      case 'auth/wrong-password':
        return 'Incorrect password!';
      case 'auth/invalid-email':
        return 'Invalid email!';
      case 'auth/user-disabled':
        return 'This account has been disabled!';
      case 'auth/email-already-in-use':
        return 'This email is already in use!';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long!';
      default:
        return context === 'login'
          ? 'Authentication error. Please try again!'
          : 'Registration error. Please try again!';
    }
  }
}