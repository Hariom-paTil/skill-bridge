import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  modal = inject(AuthModalService);
  authService = inject(AuthService);
  authState = inject(AuthStateService);
  
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Login successful!';
        console.log('Login success:', response);
        
        // Extract user name from response or email
        const firstName = response.firstName || this.email.split('@')[0];
        const lastName = response.lastName || '';
        const email = this.email;
        const course = response.course || response.education || '';
        
        this.authState.login(firstName, lastName, email, course);
        
        // Store token if needed: localStorage.setItem('token', response.token);
        // Close modal after 1 second
        setTimeout(() => this.modal.close(), 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }

  switchToSignup() {
    this.modal.showSignup();
  }
}
