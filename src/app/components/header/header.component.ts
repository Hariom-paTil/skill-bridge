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

  ngOnInit() {
    this.authState.checkAuthStatus();
  }

  openLogin() {
    this.authModal.showLogin();
  }

  logout() {
    this.authState.logout();
  }
}
