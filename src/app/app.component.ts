import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { CareerGuidanceComponent } from './components/career-guidance/career-guidance.component';
import { StudyRecommendComponent } from './components/study-recommend/study-recommend.component';
import { InternshipFinderComponent } from './components/internship-finder/internship-finder.component';
import { CodeFixerComponent } from './components/code-fixer/code-fixer.component';
import { ProjectIdeasComponent } from './components/project-ideas/project-ideas.component';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { CelebrationComponent } from './components/shared/celebration/celebration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeroSectionComponent, FeaturesSectionComponent, CareerGuidanceComponent, StudyRecommendComponent, InternshipFinderComponent, CodeFixerComponent, ProjectIdeasComponent, AuthModalComponent, CelebrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'skill-bridge';

  activeTool: 'career-guidance' | 'study-recommend' | 'internship-finder' | 'code-fixer' | 'project-ideas' | null = null;

  openTool(tool: 'career-guidance' | 'study-recommend' | 'internship-finder' | 'code-fixer' | 'project-ideas'): void {
    this.activeTool = tool;
  }

  closeTool(): void {
    this.activeTool = null;
  }
}
