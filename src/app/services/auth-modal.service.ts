import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  isOpen = signal(false);
  view = signal<'login' | 'signup'>('login');

  showLogin() {
    this.view.set('login');
    this.isOpen.set(true);
  }

  showSignup() {
    this.view.set('signup');
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
