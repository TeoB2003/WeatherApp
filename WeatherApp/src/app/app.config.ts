import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC0-vH_OegDCVpa8myPbIvEWflW-zRgF6U",
  authDomain: "weatherapp-46044.firebaseapp.com",
  projectId: "weatherapp-46044",
  storageBucket: "weatherapp-46044.firebasestorage.app",
  messagingSenderId: "729729039555",
  appId: "1:729729039555:web:e776a85c759e7ba296b676",
  measurementId: "G-VM4WXTCG32"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),  provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })]
};
