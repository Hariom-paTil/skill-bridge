import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from '../../../services/auth-modal.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  modal = inject(AuthModalService);
  
  firstName = '';
  lastName = '';
  email = '';
  education = 'imca';
  password = '';

  onSubmit() {
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

    console.log('Signup:', payload);
    // Add your signup API call here
  }

  switchToLogin() {
    this.modal.showLogin();
  }
}
