import { Component, inject, OnInit } from '@angular/core';
import { ViewportScroller, CommonModule } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  authModal = inject(AuthModalService);
  authState = inject(AuthStateService);
  viewportScroller = inject(ViewportScroller);
  showProfileDropdown = false;
  showAboutModal = false;

  ngOnInit() {
    this.authState.checkAuthStatus();
  }

  openLogin() {
    this.authModal.showLogin();
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  logout() {
    this.authState.logout();
    this.showProfileDropdown = false;
  }

  getInitials(): string {
    const details = this.authState.userDetails();
    if (details) {
      return (details.firstName.charAt(0) + details.lastName.charAt(0)).toUpperCase();
    }
    return this.authState.userName().charAt(0).toUpperCase();
  }

  scrollToTopApps() {
    this.viewportScroller.scrollToPosition([0, 0]);
    setTimeout(() => {
      const element = document.getElementById('top-apps-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  scrollToCodeFixer(event: Event) {
    event.preventDefault();
    const element = document.getElementById('code-fixer-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-card');
      setTimeout(() => {
        element.classList.remove('highlight-card');
      }, 3000);
    }
  }

  scrollToInternships(event: Event) {
    event.preventDefault();
    const element = document.getElementById('internship-finder-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-card');
      setTimeout(() => {
        element.classList.remove('highlight-card');
      }, 3000);
    }
  }
  scrollToCareerGuide(event: Event) {
    event.preventDefault();
    const element = document.getElementById('career-guidance-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-card');
      setTimeout(() => {
        element.classList.remove('highlight-card');
      }, 3000);
    }
  }

  scrollToStudyRecommend(event: Event) {
    event.preventDefault();
    const element = document.getElementById('study-recommend-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-card');
      setTimeout(() => {
        element.classList.remove('highlight-card');
      }, 3000);
    }
  }

  openAboutModal(event: Event) {
    event.preventDefault();
    this.showAboutModal = true;
  }

  closeAboutModal() {
    this.showAboutModal = false;
  }
}
