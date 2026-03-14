import { Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewQuestionResponse, InterviewService, InterviewStartRequest } from '../../services/interview.service';

interface InterviewQuestion {
  id: string;
  question: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; label: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

@Component({
  selector: 'app-ai-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-interview.component.html',
  styleUrl: './ai-interview.component.scss'
})
export class AiInterviewComponent implements OnDestroy {
  private interviewService = inject(InterviewService);
  private hostElement = inject(ElementRef<HTMLElement>);
  private timerId: ReturnType<typeof setInterval> | null = null;
  private scrollFrameId: number | null = null;

  formData: InterviewStartRequest = {
    qualification: '',
    skills: '',
    projects: '',
    role: ''
  };

  loading = false;
  error: string | null = null;
  questions: InterviewQuestion[] = [];
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | ''> = {};
  currentPage = 1;
  readonly pageSize = 7;

  showResult = false;
  score = 0;
  attempted = 0;
  wrong = 0;
  elapsedSeconds = 0;

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.pageSize);
  }

  get pagedQuestions(): InterviewQuestion[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter(answer => answer !== '').length;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get progressPercentage(): number {
    if (!this.questions.length) {
      return 0;
    }

    return Math.round((this.answeredCount / this.questions.length) * 100);
  }

  get performancePercentage(): number {
    if (!this.questions.length) {
      return 0;
    }

    return Number(((this.score / this.questions.length) * 100).toFixed(2));
  }

  startInterview(): void {
    this.stopTimer();
    this.error = null;
    this.showResult = false;
    this.score = 0;
    this.attempted = 0;
    this.wrong = 0;
    this.elapsedSeconds = 0;
    this.currentPage = 1;
    this.loading = true;
    this.questions = [];
    this.answers = {};

    this.interviewService.startInterview(this.formData).subscribe({
      next: (response: InterviewQuestionResponse[]) => {
        const limited = response.slice(0, 14);

        this.questions = limited.map((question, index) => ({
          id: String(index + 1),
          question: question.question,
          options: [
            { key: 'A', label: question.optionA },
            { key: 'B', label: question.optionB },
            { key: 'C', label: question.optionC },
            { key: 'D', label: question.optionD }
          ],
          correctAnswer: question.correctAnswer
        }));

        this.questions.forEach(question => {
          this.answers[question.id] = '';
        });

        this.loading = false;
        if (this.questions.length > 0) {
          this.startTimer();
          this.scrollToSection('.results-section--questions');
        }
      },
      error: (err: Error) => {
        this.stopTimer();
        this.loading = false;
        this.error = err.message || 'Failed to start interview.';
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.scrollToSection('.results-section--questions');
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.scrollToSection('.results-section--questions');
    }
  }

  checkResult(): void {
    let correct = 0;
    let attemptedCount = 0;

    this.questions.forEach(question => {
      const selected = this.answers[question.id];
      if (selected) {
        attemptedCount += 1;
        if (selected === question.correctAnswer) {
          correct += 1;
        }
      }
    });

    this.stopTimer();
    this.score = correct;
    this.attempted = attemptedCount;
    this.wrong = attemptedCount - correct;
    this.showResult = true;
    this.scrollToSection('.results-section--result');
  }

  getOptionState(question: InterviewQuestion, optionKey: 'A' | 'B' | 'C' | 'D'): 'correct' | 'incorrect' | 'neutral' {
    const selectedAnswer = this.answers[question.id];

    if (optionKey === question.correctAnswer) {
      return 'correct';
    }

    if (selectedAnswer === optionKey && selectedAnswer !== question.correctAnswer) {
      return 'incorrect';
    }

    return 'neutral';
  }

  resetSession(): void {
    this.stopTimer();
    this.formData = {
      qualification: '',
      skills: '',
      projects: '',
      role: ''
    };
    this.loading = false;
    this.error = null;
    this.questions = [];
    this.answers = {};
    this.currentPage = 1;
    this.showResult = false;
    this.score = 0;
    this.attempted = 0;
    this.wrong = 0;
    this.elapsedSeconds = 0;
    this.scrollToSection('.form-card--entry');
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.cancelScrollAnimation();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerId = setInterval(() => {
      this.elapsedSeconds += 1;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private scrollToSection(selector: string): void {
    setTimeout(() => {
      const host = this.hostElement.nativeElement;
      const target = host.querySelector(selector) as HTMLElement | null;
      const modalContent = host.closest('.modal-content') as HTMLElement | null;

      if (!target) {
        return;
      }

      if (modalContent) {
        const modalRect = modalContent.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const targetScrollTop = modalContent.scrollTop + (targetRect.top - modalRect.top) - 18;
        this.animateScroll(modalContent, Math.max(targetScrollTop, 0), 320);
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  private animateScroll(container: HTMLElement, targetScrollTop: number, duration: number): void {
    this.cancelScrollAnimation();

    const start = container.scrollTop;
    const change = targetScrollTop - start;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      container.scrollTop = start + (change * eased);

      if (progress < 1) {
        this.scrollFrameId = requestAnimationFrame(step);
      } else {
        this.scrollFrameId = null;
      }
    };

    this.scrollFrameId = requestAnimationFrame(step);
  }

  private cancelScrollAnimation(): void {
    if (this.scrollFrameId !== null) {
      cancelAnimationFrame(this.scrollFrameId);
      this.scrollFrameId = null;
    }
  }
}
