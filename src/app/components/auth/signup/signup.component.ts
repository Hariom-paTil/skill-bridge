import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthService } from '../../../services/auth.service';
import { CelebrationService } from '../../../services/celebration.service';
import { AuthStateService } from '../../../services/auth-state.service';

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
  celebration = inject(CelebrationService);
  authState = inject(AuthStateService);
  
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
      'bca': 104,
      'bba': 102,
      'bms': 103
    };

    const courseNames: Record<string, string> = {
      'imca': 'IMCA',
      'bca': 'BCA',
      'bba': 'BBA',
      'bms': 'BMS'
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
        console.log('Signup success - Full response:', response);
        console.log('Response status: SUCCESS (200)');
        
        this.successMessage = 'Registration successful!';
        
        // Set logged in state with full details
        const educationId = educationIdMap[this.education];
        this.authState.login(
          this.firstName, 
          this.lastName, 
          this.email, 
          courseNames[this.education],
          educationId
        );
        
        // Close modal first
        this.modal.close();
        
        // Show celebration effect
        setTimeout(() => {
          this.celebration.celebrate(this.firstName);
        }, 300);
      },
      error: (error) => {
        this.loading = false;
        console.error('Full signup error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error body:', error.error);
        
        // If status is 200, it's actually a success (some APIs return errors incorrectly)
        if (error.status === 200 || error.status === 201) {
          console.log('Status 200/201 detected - treating as success');
          this.successMessage = 'Registration successful!';
          const courseName = courseNames[this.education];
          const educationId = educationIdMap[this.education];
          this.authState.login(this.firstName, this.lastName, this.email, courseName, educationId);
          this.modal.close();
          setTimeout(() => {
            this.celebration.celebrate(this.firstName);
          }, 300);
          return;
        }
        
        // Check if email already exists
        const errorMsg = error.error?.message || error.error?.title || '';
        const emailExists = errorMsg.toLowerCase().includes('email') && 
                           (errorMsg.toLowerCase().includes('already') || 
                            errorMsg.toLowerCase().includes('exist') ||
                            errorMsg.toLowerCase().includes('present'));
        
        // Better error messages
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the API is running.';
        } else if (error.status === 400 && emailExists) {
          this.errorMessage = 'Email already registered. Redirecting to login...';
          setTimeout(() => this.modal.showLogin(), 2000);
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || error.error?.title || 'Invalid data. Please check all fields.';
        } else if (error.status === 409) {
          this.errorMessage = 'Email already registered. Redirecting to login...';
          setTimeout(() => this.modal.showLogin(), 2000);
        } else if (emailExists) {
          this.errorMessage = 'Email already registered. Redirecting to login...';
          setTimeout(() => this.modal.showLogin(), 2000);
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.title) {
          this.errorMessage = error.error.title;
        } else {
          this.errorMessage = `Registration failed (${error.status}). Please try again.`;
        }
      }
    });
  }

  switchToLogin() {
    this.modal.showLogin();
  }
}
