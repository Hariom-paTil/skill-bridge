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

type NormalizedCodeFixData = {
  errorReason: string;
  fixedCode: string;
  explanation: string;
  bestPractices: string[];
};

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

        const normalized = this.normalizeResponseData(res.data);
        this.result = normalized;
        this.startTypingAnimation(normalized.fixedCode || '');
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

  private normalizeResponseData(rawData: any): NormalizedCodeFixData {
    const rawReason = this.asText(rawData?.errorReason);
    const rawExplanation = this.asText(rawData?.explanation);
    const rawFixedCode = this.asText(rawData?.fixedCode);
    const rawBestPractices = Array.isArray(rawData?.bestPractices)
      ? rawData.bestPractices.map((item: unknown) => this.asText(item)).filter(Boolean)
      : [];

    const combinedText = [rawReason, rawExplanation].filter(Boolean).join('\n\n');
    const safeCombined = this.stripModelMetaNoise(combinedText);

    const extractedCode = this.extractCodeBlock(safeCombined);
    const extractedPractices = this.extractBestPractices(safeCombined);
    const extractedReason = this.extractReason(rawReason || safeCombined);
    const extractedExplanation = this.extractExplanation(rawExplanation || safeCombined);

    return {
      errorReason: extractedReason || 'Issue detected in the provided snippet.',
      fixedCode: (rawFixedCode || extractedCode || '').trim(),
      explanation: extractedExplanation || 'The fixer analyzed your code and generated corrections.',
      bestPractices: rawBestPractices.length > 0 ? rawBestPractices : extractedPractices
    };
  }

  private asText(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value === null || value === undefined) {
      return '';
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private stripModelMetaNoise(text: string): string {
    if (!text) {
      return '';
    }

    return text
      .replace(/\},\s*"logprobs"[\s\S]*$/i, '')
      .replace(/\},\s*logprobs[\s\S]*$/i, '')
      .replace(/"usage"\s*:\s*\{[\s\S]*$/i, '')
      .trim();
  }

  private extractCodeBlock(text: string): string {
    if (!text) {
      return '';
    }

    const markerMatch = text.match(/<+CODE>+\s*([\s\S]*?)\s*<+END_CODE>+/i);
    if (markerMatch?.[1]) {
      return markerMatch[1].trim();
    }

    const fencedMatch = text.match(/```(?:\w+)?\s*([\s\S]*?)\s*```/);
    return fencedMatch?.[1]?.trim() || '';
  }

  private extractBestPractices(text: string): string[] {
    if (!text) {
      return [];
    }

    const sectionMatch = text.match(/BEST_PRACTICES\s*:\s*([\s\S]*)/i);
    const source = sectionMatch?.[1] || '';
    if (!source) {
      return [];
    }

    return source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^[-*]\s+/.test(line))
      .map((line) => line.replace(/^[-*]\s+/, '').trim())
      .filter(Boolean);
  }

  private extractReason(text: string): string {
    if (!text) {
      return '';
    }

    const cleaned = this.stripModelMetaNoise(text);
    const stopMatch = cleaned.split(/EXPLANATION\s*:|FIXED_CODE\s*:|BEST_PRACTICES\s*:/i)[0] || '';

    return stopMatch
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  private extractExplanation(text: string): string {
    if (!text) {
      return '';
    }

    const cleaned = this.stripModelMetaNoise(text);
    const explanationMatch = cleaned.match(/EXPLANATION\s*:\s*([\s\S]*)/i);
    const source = explanationMatch?.[1] || cleaned;
    const withoutCode = source.replace(/FIXED_CODE\s*:[\s\S]*/i, '').trim();

    return withoutCode
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
  }
}
