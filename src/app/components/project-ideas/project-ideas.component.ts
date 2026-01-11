import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

interface ProjectIdea {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  features: string[];
  timeEstimate: string;
}

@Component({
  selector: 'app-project-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-ideas.component.html',
  styleUrl: './project-ideas.component.scss'
})
export class ProjectIdeasComponent {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);

  filters = {
    domain: 'web',
    level: 'beginner'
  };

  projectIdeas: ProjectIdea[] = [
    {
      title: 'Task Manager App',
      description: 'Build a full-featured task manager with drag-and-drop, deadlines, and priority levels.',
      difficulty: 'beginner',
      skills: ['HTML/CSS', 'JavaScript', 'Local Storage'],
      features: ['Add/Edit/Delete tasks', 'Priority tags', 'Due dates', 'Filter & Search'],
      timeEstimate: '2-3 weeks'
    },
    {
      title: 'Weather Dashboard',
      description: 'Create a weather app that fetches real-time data from an API and displays forecasts.',
      difficulty: 'beginner',
      skills: ['JavaScript', 'API Integration', 'CSS Grid'],
      features: ['Current weather', '5-day forecast', 'Location search', 'Responsive design'],
      timeEstimate: '1-2 weeks'
    },
    {
      title: 'E-commerce Store',
      description: 'Develop a full-stack online store with cart, checkout, and payment integration.',
      difficulty: 'intermediate',
      skills: ['React/Angular', 'Node.js', 'MongoDB', 'Stripe API'],
      features: ['Product catalog', 'Shopping cart', 'User auth', 'Payment gateway'],
      timeEstimate: '6-8 weeks'
    },
    {
      title: 'Social Media Dashboard',
      description: 'Build a real-time social media analytics dashboard with charts and insights.',
      difficulty: 'intermediate',
      skills: ['TypeScript', 'Chart.js', 'REST APIs', 'WebSockets'],
      features: ['Live updates', 'Analytics charts', 'Post scheduler', 'Engagement metrics'],
      timeEstimate: '4-5 weeks'
    },
    {
      title: 'AI Chatbot Platform',
      description: 'Create an intelligent chatbot using NLP and machine learning models.',
      difficulty: 'advanced',
      skills: ['Python', 'NLP', 'TensorFlow', 'FastAPI'],
      features: ['Intent recognition', 'Context handling', 'Multi-language', 'Training dashboard'],
      timeEstimate: '8-10 weeks'
    },
    {
      title: 'Real-time Collaboration Tool',
      description: 'Build a collaborative whiteboard or code editor with live synchronization.',
      difficulty: 'advanced',
      skills: ['WebSockets', 'Operational Transform', 'Redis', 'Docker'],
      features: ['Real-time sync', 'Multi-user cursors', 'Version history', 'Video chat'],
      timeEstimate: '10-12 weeks'
    }
  ];

  ideas: ProjectIdea[] = [];
  statusText = 'Choose your domain and level to get personalized project ideas.';

  generate(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    const filtered = this.projectIdeas.filter(idea => idea.difficulty === this.filters.level);
    this.ideas = filtered.length ? filtered : this.projectIdeas.slice(0, 3);
    this.statusText = `Showing ${this.ideas.length} project ideas for ${this.filters.level} level`;
  }
}
