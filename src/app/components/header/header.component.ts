import { Component, inject } from '@angular/core';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authModal = inject(AuthModalService);

  openLogin() {
    this.authModal.showLogin();
  }
}
