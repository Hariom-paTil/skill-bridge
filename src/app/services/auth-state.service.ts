import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  educationId?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private platformId = inject(PLATFORM_ID);
  isLoggedIn = signal(false);
  userName = signal('');
  userDetails = signal<UserDetails | null>(null);

  login(firstName: string, lastName?: string, email?: string, course?: string, educationId?: number) {
    this.isLoggedIn.set(true);
    this.userName.set(firstName);
    
    const details: UserDetails = {
      firstName,
      lastName: lastName || '',
      email: email || '',
      course: course || '',
      educationId
    };
    this.userDetails.set(details);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', firstName);
      localStorage.setItem('userDetails', JSON.stringify(details));
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.userDetails.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userDetails');
    }
  }

  checkAuthStatus() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';
    const userDetailsStr = localStorage.getItem('userDetails');
    
    if (isLoggedIn) {
      this.isLoggedIn.set(true);
      this.userName.set(userName);
      if (userDetailsStr) {
        try {
          this.userDetails.set(JSON.parse(userDetailsStr));
        } catch (e) {
          console.error('Error parsing user details:', e);
        }
      }
    }
  }
}
