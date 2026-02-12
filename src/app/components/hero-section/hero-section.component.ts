import { Component, Output, EventEmitter } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Output() toolSelected = new EventEmitter<'career-guidance' | 'study-recommend' | 'internship-finder' | 'code-fixer' | 'project-ideas'>();

  onSelectTool(tool: 'career-guidance' | 'study-recommend' | 'internship-finder' | 'code-fixer' | 'project-ideas') {
    this.toolSelected.emit(tool);
  }
}
