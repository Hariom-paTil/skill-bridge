import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from '../../../services/auth-modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  modal = inject(AuthModalService);
  
  email = '';
  password = '';

  onSubmit() {
    console.log('Login:', { email: this.email, password: this.password });
    // Add your login API call here
  }

  switchToSignup() {
    this.modal.showSignup();
  }
}
