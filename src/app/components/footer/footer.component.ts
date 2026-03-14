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
  showPrivacyModal = false;
  showTermsModal = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  scrollToTop(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Scroll to generic features section
  scrollToFeatures(event: Event) {
    event.preventDefault();
    this.scrollToElement('features-section', ['.feature-card', '.project-ideas-card']);
  }

  // Scroll to Contact section
  scrollToContact(event: Event) {
    event.preventDefault();
    this.scrollToElement('connect-with-us', [], 'highlight-section');
  }

  // Specific Resource Links
  scrollToCareerRoadmap(event: Event) {
    event.preventDefault();
    this.scrollToElement('career-guidance-card', ['#career-guidance-card']);
  }

  scrollToInternships(event: Event) {
    event.preventDefault();
    this.scrollToElement('internship-finder-card', ['#internship-finder-card']);
  }

  scrollToAiInterview(event: Event) {
    event.preventDefault();
    this.scrollToElement('ai-interview-card', ['#ai-interview-card']);
  }

  // Helper method for scrolling and highlighting
  private scrollToElement(elementId: string, highlightSelectors: string[] = [], highlightClass: string = 'highlight-card') {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (highlightSelectors.length > 0) {
          // If selectors are provided, highlight those specifically (or the element itself if selector matches)
          // For simple cases where we just passed the ID as a selector
          highlightSelectors.forEach(selector => {
            const targets = document.querySelectorAll(selector);
            targets.forEach(target => {
              target.classList.add(highlightClass);
              setTimeout(() => target.classList.remove(highlightClass), 3000);
            });
          });
        } else if (highlightClass === 'highlight-section') {
          // Special case for sections
          element.classList.add(highlightClass);
          setTimeout(() => element.classList.remove(highlightClass), 3000);
        }
      }
    }
  }

  // Modals
  openAboutModal(event: Event) {
    event.preventDefault();
    this.showAboutModal = true;
  }

  closeAboutModal() {
    this.showAboutModal = false;
  }

  openPrivacyModal(event: Event) {
    event.preventDefault();
    this.showPrivacyModal = true;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }

  openTermsModal(event: Event) {
    event.preventDefault();
    this.showTermsModal = true;
  }

  closeTermsModal() {
    this.showTermsModal = false;
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
