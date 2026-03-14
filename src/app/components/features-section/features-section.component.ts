import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss'
})
export class FeaturesSectionComponent {
  @Output() toolSelected = new EventEmitter<'career-guidance' | 'study-recommend' | 'internship-finder' | 'ai-interview' | 'project-ideas'>();

  selectTool(tool: 'career-guidance' | 'study-recommend' | 'internship-finder' | 'ai-interview' | 'project-ideas'): void {
    this.toolSelected.emit(tool);
  }
}
