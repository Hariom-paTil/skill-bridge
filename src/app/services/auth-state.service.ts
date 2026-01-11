import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private platformId = inject(PLATFORM_ID);
  isLoggedIn = signal(false);
  userName = signal('');

  login(name: string) {
    this.isLoggedIn.set(true);
    this.userName.set(name);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', name);
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    this.userName.set('');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
    }
  }

  checkAuthStatus() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';
    if (isLoggedIn) {
      this.isLoggedIn.set(true);
      this.userName.set(userName);
    }
  }
}
