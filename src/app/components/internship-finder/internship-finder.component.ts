import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Internship, InternshipRecommendationService } from '../../services/internship-recommendation.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-internship-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-finder.component.html',
  styleUrl: './internship-finder.component.scss'
})
export class InternshipFinderComponent {
  private internshipService = inject(InternshipRecommendationService);
  private authState = inject(AuthStateService);

  showModal = false;
  loading = false;
  error: string | null = null;
  internships: Internship[] = [];
  showResults = false;

  formData = {
    username: '',
    role: '',
    internshipMode: 'offline', // Default to offline
    location: '',
    qualification: '',
    skills: ''
  };

  ngOnInit() {
    // Auto-fill username if logged in
    this.formData.username = this.authState.userName();
  }

  // NOTE: openModal and closeModal are removed as this component is now displayed directly by the parent modal.

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.internships = [];
    this.showResults = false;

    const payload = {
      location: this.formData.location,
      internshipMode: this.formData.internshipMode,
      qualification: this.formData.qualification,
      skills: this.formData.skills
    };

    this.internshipService.recommendInternships(payload).subscribe({
      next: (res: Internship[]) => {
        this.loading = false;
        if (res && res.length > 0) {
          this.internships = res;
          this.showResults = true;
        } else {
          this.internships = [];
          this.showResults = true; // Show empty state correctly
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }

  closeResults() {
    this.showResults = false;
  }
}
