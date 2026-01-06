import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Finding {
  issue: string;
  fix: string;
  severity: 'info' | 'warn' | 'error';
}

@Component({
  selector: 'app-code-fixer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-fixer.component.html',
  styleUrl: './code-fixer.component.scss'
})
export class CodeFixerComponent {
  snippet = '';
  language = 'typescript';
  context = '';
  findings: Finding[] = [];
  suggestion = 'Paste a snippet or stack trace to get quick checks.';

  analyze(): void {
    const trimmed = this.snippet.trim();
    this.findings = [];

    if (!trimmed) {
      this.suggestion = 'Paste a snippet or stack trace to get quick checks.';
      return;
    }

    const lower = trimmed.toLowerCase();

    if (lower.includes('console.log') && !lower.includes('try')) {
      this.findings.push({
        issue: 'Debug logs left in code',
        fix: 'Wrap logging behind a flag or remove before merging.',
        severity: 'info'
      });
    }

    if (trimmed.includes('==') && !trimmed.includes('===')) {
      this.findings.push({
        issue: 'Loose equality detected',
        fix: 'Prefer strict equality (===) to avoid coercion surprises.',
        severity: 'warn'
      });
    }

    if (lower.includes('any ')) {
      this.findings.push({
        issue: 'TypeScript any usage',
        fix: 'Replace `any` with a typed interface to keep static guarantees.',
        severity: 'warn'
      });
    }

    if (lower.includes('fetch(') && !lower.includes('catch')) {
      this.findings.push({
        issue: 'Missing error handling around fetch',
        fix: 'Add try/catch or .catch to surface failures to the UI.',
        severity: 'error'
      });
    }

    if (this.findings.length === 0) {
      this.findings = [
        {
          issue: 'No obvious issues detected',
          fix: 'Add tests around the tricky branch and run a formatter for consistency.',
          severity: 'info'
        }
      ];
    }

    this.suggestion = this.buildSummary();
  }

  private buildSummary(): string {
    const severities = this.findings.map((f) => f.severity);
    if (severities.includes('error')) {
      return 'Address the blocking errors first, then the warnings.';
    }
    if (severities.includes('warn')) {
      return 'Tighten the warnings and you should be merge-ready.';
    }
    return 'Looks clean. Ship it with a quick test run.';
  }
}
