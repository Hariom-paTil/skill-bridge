import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

interface CareerTrack {
  title: string;
  summary: string;
  bestFor: string[];
  skills: string[];
  firstSteps: string[];
  sampleRoles: string[];
}

@Component({
  selector: 'app-career-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-guidance.component.html',
  styleUrl: './career-guidance.component.scss'
})
export class CareerGuidanceComponent {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);

  profile = {
    interests: '',
    strengths: '',
    goal: 'break-into-tech'
  };

  imageSrc = 'assets/careerlogo.png';

  tracks: CareerTrack[] = [
    {
      title: 'Backend Engineering',
      summary: 'Design reliable APIs, databases, and distributed services.',
      bestFor: ['system design', 'databases', 'api', 'scalability'],
      skills: ['Node/Nest', 'SQL + NoSQL', 'API design', 'Cloud basics'],
      firstSteps: ['Ship a REST API with auth', 'Add caching + pagination', 'Deploy to a free cloud tier'],
      sampleRoles: ['Backend Engineer', 'Platform Engineer', 'API Developer']
    },
    {
      title: 'Frontend Engineering',
      summary: 'Craft responsive interfaces and UX that convert.',
      bestFor: ['ui', 'ux', 'design', 'javascript', 'angular', 'react'],
      skills: ['Component patterns', 'Accessibility', 'State management', 'Testing'],
      firstSteps: ['Clone a landing page', 'Add form validation', 'Ship a responsive layout'],
      sampleRoles: ['Frontend Engineer', 'UI Engineer', 'Web Engineer']
    },
    {
      title: 'Data & Analytics',
      summary: 'Turn product events and datasets into insights and dashboards.',
      bestFor: ['data', 'analytics', 'sql', 'dashboards', 'metrics'],
      skills: ['SQL + dbt basics', 'Python notebooks', 'Storytelling with charts', 'Experimentation'],
      firstSteps: ['Analyze a public dataset', 'Build a KPI dashboard', 'Write a short insight memo'],
      sampleRoles: ['Data Analyst', 'Analytics Engineer', 'BI Developer']
    },
    {
      title: 'Machine Learning',
      summary: 'Prototype models, evaluate them, and ship ML-backed features.',
      bestFor: ['ml', 'ai', 'models', 'math', 'experimentation'],
      skills: ['Python + notebooks', 'Vector search', 'Model evaluation', 'Prompt design'],
      firstSteps: ['Train a simple classifier', 'Evaluate with a test set', 'Deploy a demo endpoint'],
      sampleRoles: ['ML Engineer', 'Applied Scientist', 'AI Engineer']
    },
    {
      title: 'DevOps & Cloud',
      summary: 'Automate delivery, observability, and cloud environments.',
      bestFor: ['devops', 'automation', 'infrastructure', 'cloud'],
      skills: ['CI/CD pipelines', 'Docker', 'Monitoring', 'Infra as code'],
      firstSteps: ['Dockerize a service', 'Add CI for tests', 'Set up basic logging'],
      sampleRoles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer']
    }
  ];

  recommendations: CareerTrack[] = this.tracks.slice(0, 3);
  statusText = 'Share what you enjoy and we will tailor a path.';

  generateGuidance(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    const interestTokens = `${this.profile.interests} ${this.profile.strengths}`
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    const matches = this.tracks.filter((track) =>
      interestTokens.some((token) => track.bestFor.some((hint) => hint.toLowerCase().includes(token)))
    );

    this.recommendations = matches.length ? matches : this.tracks.slice(0, 3);
    this.statusText = matches.length
      ? `Showing ${matches.length} matching tracks`
      : 'Showing starter tracks to explore.';
  }
}
