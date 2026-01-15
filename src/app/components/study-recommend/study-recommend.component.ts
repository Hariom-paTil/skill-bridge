import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { StudyRecommendationService, StudyRecommendationResponse, LearningPathStep } from '../../services/study-recommendation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class StudyRecommendComponent implements OnDestroy {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);
  private studyRecommendationService = inject(StudyRecommendationService);
  private destroy$ = new Subject<void>();

  targetedSkill = '';
  knownSkills = '';
  experienceLevel = 'beginner';
  learningGoals = '';
  timeCommitment = '5-10';
  preferredFormat = 'mixed';

  imageSrc = 'assets/study_r.png';
  
  // API Response properties
  apiResponse: StudyRecommendationResponse | null = null;
  displayedContent: string = '';
  isLoading = false;
  error: string | null = null;
  showApiResult = false;
  
  // Typing animation
  isTypingAnimation = true;
  typingSpeed = 15; // milliseconds per character

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

    this.isLoading = true;
    this.error = null;
    this.showApiResult = false;
    this.displayedContent = '';

    const payload = {
      targetedSkill: this.targetedSkill,
      knownSkills: this.knownSkills,
      experienceLevel: this.experienceLevel,
      learningGoals: this.learningGoals,
      timeCommitment: this.timeCommitment,
      preferredFormat: this.preferredFormat
    };

    this.studyRecommendationService.getRecommendations(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.apiResponse = response;
          this.isLoading = false;
          this.showApiResult = true;
          this.note = `✅ Found personalized learning path for "${response.data.targetRole}"`;
          this.startTypingAnimation();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = error?.message || 'Failed to fetch recommendations. Please try again.';
          this.error = errorMsg;
          this.note = `❌ ${errorMsg}`;
          console.error('Recommendation error:', error);
        }
      });
  }

  /**
   * Start typing animation for the response content
   */
  private startTypingAnimation(): void {
    if (!this.apiResponse) return;

    const content = this.generateFormattedContent();
    let index = 0;

    const typeNextCharacter = () => {
      if (index < content.length) {
        this.displayedContent += content[index];
        index++;
        setTimeout(typeNextCharacter, this.typingSpeed);
      }
    };

    typeNextCharacter();
  }

  /**
   * Generate formatted content from API response
   */
  private generateFormattedContent(): string {
    if (!this.apiResponse?.data) return '';

    const { targetRole, learningPath } = this.apiResponse.data;
    let content = '';

    // Title
    content += `🎯 Recommended Role: ${targetRole}\n\n`;
    content += `📚 Your Learning Path:\n\n`;

    // Learning steps
    learningPath.forEach((step) => {
      content += `Step ${step.step}: ${step.topic}\n`;
      content += `Why: ${step.why}\n\n`;
    });

    return content;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
