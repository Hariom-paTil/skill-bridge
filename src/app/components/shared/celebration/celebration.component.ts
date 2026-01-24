import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrationService } from '../../../services/celebration.service';

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="celebration-overlay" *ngIf="celebration.showCelebration()">
      <div class="lightning-container">
          <div class="lightning-flash"></div>
      </div>
      <div class="welcome-box">
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
