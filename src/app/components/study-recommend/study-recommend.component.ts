import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudyPath {
  name: string;
  focus: string[];
  skills: string[];
  resources: string[];
  duration: string;
}

@Component({
  selector: 'app-study-recommend',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './study-recommend.component.html',
  styleUrl: './study-recommend.component.scss'
})
export class StudyRecommendComponent {
  query = '';
  level = 'beginner';

  paths: StudyPath[] = [
    {
      name: 'Web Fundamentals',
      focus: ['frontend', 'web', 'ui'],
      skills: ['HTML/CSS layout', 'TypeScript basics', 'Accessibility'],
      resources: ['Frontend Mentor challenges', 'MDN Web Docs', 'Angular Start guide'],
      duration: '6-8 weeks'
    },
    {
      name: 'Data Foundations',
      focus: ['data', 'sql', 'analytics'],
      skills: ['SQL joins & windows', 'Pandas basics', 'Chart literacy'],
      resources: ['Mode SQL tutorials', 'Kaggle micro-courses', 'Storytelling with Data'],
      duration: '4-6 weeks'
    },
    {
      name: 'Backend with Node',
      focus: ['backend', 'api', 'node'],
      skills: ['REST fundamentals', 'Auth patterns', 'Testing with Jest'],
      resources: ['Node.js docs', 'NestJS basics', 'Testing handbook'],
      duration: '6-8 weeks'
    },
    {
      name: 'AI & ML Primer',
      focus: ['ml', 'ai', 'models'],
      skills: ['NumPy/Pandas', 'Vector search', 'Model evaluation'],
      resources: ['fast.ai Practical Deep Learning', 'Andrew Ng short courses', 'OpenAI eval guides'],
      duration: '8-10 weeks'
    }
  ];

  recommendations: StudyPath[] = this.paths.slice(0, 3);
  note = 'Pick a focus and level to tailor study tracks.';

  recommend(): void {
    const tokens = this.query.toLowerCase().split(/[,\s]+/).filter(Boolean);

    const filtered = this.paths.filter((path) =>
      tokens.length === 0
        ? true
        : tokens.some((token) => path.focus.some((hint) => hint.toLowerCase().includes(token)))
    );

    this.recommendations = filtered.length ? filtered : this.paths.slice(0, 2);
    this.note = this.level === 'advanced'
      ? 'Lean into projects and add depth with source reading.'
      : 'Follow the tracks in order and ship small projects weekly.';
  }
}
