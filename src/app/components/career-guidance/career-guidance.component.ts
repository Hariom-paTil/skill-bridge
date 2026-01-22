import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
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
  displayedContent: string | Promise<string> = '';
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
      currentCourse: this.profile.course,
      targetCareer: this.profile.futureGoal,
      currentSkills: this.profile.currentSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
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

  async startTypingAnimation(): Promise<void> {
    this.isTyping = true;
    let index = 0;
    const speed = 10;

    if (this.typingInterval) clearInterval(this.typingInterval);

    this.typingInterval = setInterval(async () => {
      // Chunk size increases speed
      if (index < this.guidanceContent.length) {
        index += 3;
        if (index > this.guidanceContent.length) index = this.guidanceContent.length;

        const currentMarkdown = this.guidanceContent.substring(0, index);
        try {
          const parsed = marked.parse(currentMarkdown);
          this.displayedContent = parsed instanceof Promise ? await parsed : parsed;
        } catch (e) {
          this.displayedContent = currentMarkdown;
        }
      } else {
        this.finishTyping();
      }
    }, speed);
  }

  async skipTyping(): Promise<void> {
    if (this.isTyping) {
      this.finishTyping();
      const parsed = marked.parse(this.guidanceContent);
      this.displayedContent = parsed instanceof Promise ? await parsed : parsed;
    }
  }

  finishTyping(): void {
    this.isTyping = false;
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  closeModal(): void {
    this.showResultsModal = false;
    this.finishTyping();
    this.displayedContent = '';
    this.guidanceContent = '';
  }

  ngOnDestroy(): void {
    this.finishTyping();
  }
}
