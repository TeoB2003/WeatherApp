import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {}

  async login(email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      let username = '';

      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as { username: string };
        username = data.username;
      } else {
        username = user.displayName ?? 'User';
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          username: username,
          createdAt: new Date(),
        });
      }

      localStorage.setItem('username', username);
      this.router.navigate(['/weather/bucharest']);
      return null;
    } catch (error: any) {
      console.error('Login error:', error.message);
      return this.getErrorMessage(error.code, 'login');
    }
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
      });

      localStorage.setItem('username', username);

      this.router.navigate(['/weather/bucharest']);
      return null;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return this.getErrorMessage(error.code, 'register');
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async resetPassword(email: string): Promise<string | null> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return null;
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      return this.getErrorMessage(error.code, 'reset');
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
    context: 'login' | 'register' | 'reset'
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
