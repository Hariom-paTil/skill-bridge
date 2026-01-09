import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  isLoggedIn = signal(false);
  userName = signal('');

  login(name: string) {
    this.isLoggedIn.set(true);
    this.userName.set(name);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.userName.set('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
  }

  checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';
    if (isLoggedIn) {
      this.isLoggedIn.set(true);
      this.userName.set(userName);
    }
  }
}
