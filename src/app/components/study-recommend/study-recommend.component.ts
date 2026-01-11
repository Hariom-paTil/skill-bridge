import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

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
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);

  targetedSkill = '';
  knownSkills = '';
  experienceLevel = 'beginner';
  learningGoals = '';
  timeCommitment = '5-10';
  preferredFormat = 'mixed';

  imageSrc = 'assets/study_r.png';

  paths: StudyPath[] = [
    {
      name: 'Web Fundamentals',
      focus: ['frontend', 'web', 'ui', 'angular', 'react', 'vue'],
      skills: ['HTML/CSS layout', 'TypeScript basics', 'Accessibility', 'Component Architecture'],
      resources: ['Frontend Mentor challenges', 'MDN Web Docs', 'Angular Start guide', 'Web.dev by Google'],
      duration: '6-8 weeks'
    },
    {
      name: 'Data Foundations',
      focus: ['data', 'sql', 'analytics', 'database', 'bi'],
      skills: ['SQL joins & windows', 'Pandas basics', 'Chart literacy', 'Data modeling'],
      resources: ['Mode SQL tutorials', 'Kaggle micro-courses', 'Storytelling with Data', 'SQL Zoo'],
      duration: '4-6 weeks'
    },
    {
      name: 'Backend with Node',
      focus: ['backend', 'api', 'node', 'javascript', 'typescript'],
      skills: ['REST fundamentals', 'Auth patterns', 'Testing with Jest', 'Database integration'],
      resources: ['Node.js docs', 'NestJS basics', 'Testing handbook', 'Express.js guide'],
      duration: '6-8 weeks'
    },
    {
      name: '.NET Backend Development',
      focus: ['backend', 'dotnet', '.net', 'c#', 'csharp', 'asp.net'],
      skills: ['Entity Framework Core', 'Repository Pattern', 'LINQ', 'ASP.NET Core Web API', 'Dependency Injection'],
      resources: ['Microsoft Learn', '.NET documentation', 'Pluralsight .NET paths', 'Clean Architecture by Jason Taylor'],
      duration: '8-10 weeks'
    },
    {
      name: 'Java Backend Development',
      focus: ['backend', 'java', 'spring', 'springboot'],
      skills: ['Spring Boot', 'JPA/Hibernate', 'RESTful services', 'Maven/Gradle', 'Microservices'],
      resources: ['Spring.io guides', 'Baeldung tutorials', 'Java Brains YouTube', 'Official Spring Boot docs'],
      duration: '8-10 weeks'
    },
    {
      name: 'AI & ML Primer',
      focus: ['ml', 'ai', 'models', 'python', 'machinelearning'],
      skills: ['NumPy/Pandas', 'Vector search', 'Model evaluation', 'TensorFlow basics', 'Feature engineering'],
      resources: ['fast.ai Practical Deep Learning', 'Andrew Ng short courses', 'OpenAI eval guides', 'Kaggle competitions'],
      duration: '8-10 weeks'
    },
    {
      name: 'DevOps & Cloud',
      focus: ['devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes'],
      skills: ['Docker containers', 'CI/CD pipelines', 'Cloud services', 'Infrastructure as Code', 'Monitoring'],
      resources: ['AWS Free Tier tutorials', 'Docker documentation', 'Azure Learn', 'Kubernetes.io'],
      duration: '10-12 weeks'
    },
    {
      name: 'Mobile Development',
      focus: ['mobile', 'android', 'ios', 'flutter', 'react-native'],
      skills: ['Mobile UI/UX', 'State management', 'Native APIs', 'App deployment', 'Performance optimization'],
      resources: ['Flutter.dev', 'React Native docs', 'Android developers', 'iOS Human Interface Guidelines'],
      duration: '8-10 weeks'
    }
  ];

  recommendations: StudyPath[] = [];
  note = 'Enter your targeted skill and what you already know to get personalized study recommendations.';

  recommend(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    if (!this.targetedSkill.trim()) {
      this.note = '⚠️ Please enter your targeted skill to get recommendations.';
      return;
    }

    // Combine targeted skill and known skills for better matching
    const searchTerms = [
      ...this.targetedSkill.toLowerCase().split(/[,\s]+/).filter(Boolean),
      ...this.knownSkills.toLowerCase().split(/[,\s]+/).filter(Boolean)
    ];

    const filtered = this.paths.filter((path) =>
      searchTerms.some((term) => 
        path.focus.some((hint) => hint.toLowerCase().includes(term)) ||
        path.name.toLowerCase().includes(term)
      )
    );

    this.recommendations = filtered.length ? filtered : this.paths.slice(0, 3);
    
    // Generate personalized note based on input
    if (filtered.length > 0) {
      const levelNote = this.experienceLevel === 'advanced'
        ? 'Focus on advanced patterns and architecture.'
        : this.experienceLevel === 'intermediate'
        ? 'Build projects that combine multiple concepts.'
        : 'Start with fundamentals and build strong foundations.';
      
      this.note = `✅ Found ${filtered.length} personalized learning path(s) for "${this.targetedSkill}". ${levelNote}`;
    } else {
      this.note = `No exact matches found for "${this.targetedSkill}". Showing general recommendations.`;
    }
  }
}
