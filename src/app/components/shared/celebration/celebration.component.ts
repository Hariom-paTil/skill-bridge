import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrationService } from '../../../services/celebration.service';

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="celebration-overlay" *ngIf="celebration.showCelebration()">
      <div class="lightning-effect"></div>
      <div class="welcome-box">
        <div class="sparkle"></div>
        <h1>Welcome to Skill Bridge!</h1>
        <p>Hello {{ celebration.userName() }}!</p>
        <div class="success-icon">✓</div>
      </div>
    </div>
  `,
  styleUrl: './celebration.component.scss'
})
export class CelebrationComponent {
  celebration = inject(CelebrationService);
}
