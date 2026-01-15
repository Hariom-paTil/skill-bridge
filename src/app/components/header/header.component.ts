import { Component, inject, OnInit } from '@angular/core';
import { ViewportScroller, CommonModule } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthStateService } from '../../services/auth-state.service';
import { StudyRoadComponent } from '../study-road/study-road.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, StudyRoadComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  authModal = inject(AuthModalService);
  authState = inject(AuthStateService);
  viewportScroller = inject(ViewportScroller);
  showProfileDropdown = false;
  showStudyRoad = false;

  ngOnInit() {
    this.authState.checkAuthStatus();
  }

  openLogin() {
    this.authModal.showLogin();
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  toggleStudyRoad() {
    this.showStudyRoad = !this.showStudyRoad;
  }

  closeStudyRoad() {
    this.showStudyRoad = false;
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
}
