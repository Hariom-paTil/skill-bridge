import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  showAboutModal = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  scrollToTop(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToFeatures(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Apply glow effect
        // We select elements that are within the features section
        const cards = featuresSection.querySelectorAll('.feature-card, .project-ideas-card');

        cards.forEach(card => {
          card.classList.add('highlight-card');
        });

        // Remove the class after animation (approx 2s)
        setTimeout(() => {
          cards.forEach(card => {
            card.classList.remove('highlight-card');
          });
        }, 3000);
      }
    }
  }

  openAboutModal(event: Event) {
    event.preventDefault();
    this.showAboutModal = true;
  }

  closeAboutModal() {
    this.showAboutModal = false;
  }

  // Placeholder for other links if needed in future
  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
