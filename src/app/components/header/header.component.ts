import { Component, inject, OnInit } from '@angular/core';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  authModal = inject(AuthModalService);
  authState = inject(AuthStateService);
  showProfileDropdown = false;

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
}
