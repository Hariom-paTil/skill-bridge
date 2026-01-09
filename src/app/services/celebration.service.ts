import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CelebrationService {
  showCelebration = signal(false);
  userName = signal('');

  celebrate(name: string) {
    this.userName.set(name);
    this.showCelebration.set(true);
    setTimeout(() => this.showCelebration.set(false), 4000);
  }
}
