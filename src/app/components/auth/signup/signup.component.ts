import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  modal = inject(AuthModalService);
  authService = inject(AuthService);
  
  firstName = '';
  lastName = '';
  email = '';
  education = 'imca';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const educationIdMap: Record<string, number> = {
      'imca': 101,
      'bca': 101,
      'bba': 102,
      'bms': 103
    };

    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      educationId: educationIdMap[this.education],
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Registration successful!';
        console.log('Signup success:', response);
        // Auto switch to login after 1.5 seconds
        setTimeout(() => this.modal.showLogin(), 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }

  switchToLogin() {
    this.modal.showLogin();
  }
}
