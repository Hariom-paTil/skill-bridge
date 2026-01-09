import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalService } from '../../../services/auth-modal.service';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  modal = inject(AuthModalService);
}
