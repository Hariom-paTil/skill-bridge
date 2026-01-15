import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

interface CodeFixRequest {
  code: string;
  language: string;
  context?: string;
  errorMessage?: string;
}

interface CodeFixResponse {
  success: boolean;
  data?: {
    errorReason: string;
    fixedCode: string;
    explanation: string;
    bestPractices: string[];
  };
  message?: string;
}

@Component({
  selector: 'app-code-fixer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './code-fixer.component.html',
  styleUrl: './code-fixer.component.scss'
})
export class CodeFixerComponent implements OnDestroy {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);
  private http = inject(HttpClient);

  snippet = '';
  language = 'C#';
  context = '';
  isLoading = false;
  errorMessage: string | null = null;
  result: CodeFixResponse['data'] | null = null;
  displayedCode = '';
  private typingTimer: any;
  imageSrc = 'assets/code.png';

  ngOnDestroy(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  fixCode(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    const trimmed = this.snippet.trim();
    if (!trimmed) {
      this.errorMessage = 'Please paste some code to fix.';
      this.result = null;
      this.displayedCode = '';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;
    this.result = null;
    this.displayedCode = '';
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    const normalizedContext = this.context.trim();
    const payload: CodeFixRequest = {
      code: trimmed,
      language: this.language,
      context: normalizedContext || undefined,
      errorMessage: normalizedContext || 'User did not provide an error message.'
    };

    // Send a clean JSON object; HttpClient serializes and escapes quotes correctly
    this.http.post<CodeFixResponse>('/api/CodeFixer/Fix', payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!res?.success || !res.data) {
          this.errorMessage = res?.message || 'Unexpected response from server.';
          return;
        }
        this.result = res.data;
        this.startTypingAnimation(res.data.fixedCode || '');
      },
      error: (err) => {
        this.isLoading = false;
        const serverMessage = err?.error?.message || err?.message;
        const validation = err?.error?.errors;
        if (validation && typeof validation === 'object') {
          const messages = Object.entries(validation)
            .flatMap(([key, value]) => Array.isArray(value) ? value : [String(value)])
            .join(' | ');
          this.errorMessage = messages || serverMessage || 'Failed to reach CodeFixer API.';
        } else {
          this.errorMessage = serverMessage || 'Failed to reach CodeFixer API.';
        }
      }
    });
  }

  private startTypingAnimation(code: string): void {
    const lines = code.split('\n');
    this.displayedCode = '';
    let index = 0;

    const typeNext = () => {
      if (index >= lines.length) return;
      this.displayedCode += (index === 0 ? '' : '\n') + lines[index];
      index += 1;
      this.typingTimer = setTimeout(typeNext, 90);
    };

    typeNext();
  }
}
