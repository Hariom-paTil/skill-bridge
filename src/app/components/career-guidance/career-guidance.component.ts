import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { CareerGuidanceService } from '../../services/career-guidance.service';

@Component({
  selector: 'app-career-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-guidance.component.html',
  styleUrl: './career-guidance.component.scss'
})
export class CareerGuidanceComponent implements OnInit, OnDestroy {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);
  private guidanceService = inject(CareerGuidanceService);

  profile = {
    name: '',
    course: '',
    futureGoal: '',
    currentSkills: '',
    description: ''
  };

  imageSrc = 'assets/careerlogo.png';

  guidanceContent = '';
  displayedContent = '';
  statusText = '';
  loading = false;
  errorMessage = '';
  showResultsModal = false;
  isTyping = false;
  private typingInterval: any;

  ngOnInit(): void {
    const details = this.authState.userDetails();
    if (details) {
      this.profile.name = [details.firstName, details.lastName].filter(Boolean).join(' ');
      this.profile.course = details.course || '';
    }
  }

  generateGuidance(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      name: this.profile.name,
      course: this.profile.course,
      futureGoal: this.profile.futureGoal,
      currentSkills: this.profile.currentSkills,
      description: this.profile.description
    };

    this.guidanceService.requestGuidance(payload).subscribe({
      next: (content: string) => {
        this.guidanceContent = content;
        this.loading = false;
        this.showResultsModal = true;
        this.startTypingAnimation();
      },
      error: (err) => {
        console.error('Guidance error', err);
        this.errorMessage = 'Unable to fetch guidance right now. Please try again later.';
        this.loading = false;
      }
    });
  }

  startTypingAnimation(): void {
    this.displayedContent = '';
    this.isTyping = true;
    let index = 0;
    const speed = 20; // milliseconds per character

    this.typingInterval = setInterval(() => {
      if (index < this.guidanceContent.length) {
        this.displayedContent += this.guidanceContent[index];
        index++;
      } else {
        this.isTyping = false;
        clearInterval(this.typingInterval);
      }
    }, speed);
  }

  skipTyping(): void {
    if (this.isTyping) {
      clearInterval(this.typingInterval);
      this.displayedContent = this.guidanceContent;
      this.isTyping = false;
    }
  }

  closeModal(): void {
    this.showResultsModal = false;
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    this.displayedContent = '';
    this.guidanceContent = '';
    this.isTyping = false;
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }
}
