import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipRecommendationService } from '../../services/internship-recommendation.service';

interface InternshipForm {
  role: string;
  workMode: '' | 'remote' | 'offline';
  location: string;
  qualification: string;
  skills: string[];
}

@Component({
  selector: 'app-internship-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-finder.component.html',
  styleUrl: './internship-finder.component.scss'
})
export class InternshipFinderComponent {
  private internshipService = inject(InternshipRecommendationService);
  isOpen = true;
  isLoading = false;

  form: InternshipForm = {
    role: '',
    workMode: '',
    location: '',
    qualification: '',
    skills: []
  };

  manualSkill = '';

  roles = ['Backend', 'Frontend', 'AI/ML', 'Data Analyst', 'Data Engineer', 'Full Stack', 'UI/UX'];
  locations = ['Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi', 'Chennai'];
  qualifications = ['BCA', 'MCA', 'Diploma in IT', 'B.Sc CS', 'B.Tech CS', 'BBA', 'MBA'];

  skillsByQualification: Record<string, string[]> = {
    BCA: ['Java', 'HTML/CSS', 'JavaScript', 'SQL'],
    MCA: ['Angular', 'C#', 'Java', 'SQL'],
    'Diploma in IT': ['HTML/CSS', 'Basic Programming', 'IT Support'],
    'B.Sc CS': ['Python', 'C', 'DBMS', 'Data Structures'],
    'B.Tech CS': ['React', 'Node.js', 'SQL', 'DSA'],
    BBA: ['Excel', 'Business Analysis', 'Communication'],
    MBA: ['Excel', 'Power BI', 'Strategy']
  };

  availableSkills: string[] = [];

  close(): void {
    this.isOpen = false;
  }

  updateSkills(): void {
    this.availableSkills = this.skillsByQualification[this.form.qualification] ?? [];
    this.form.skills = [];
  }

  onWorkModeChange(): void {
    if (this.form.workMode === 'remote') {
      this.form.location = '';
    }
  }

  toggleSkill(event: Event, skill: string): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }

    if (input.checked) {
      if (!this.form.skills.includes(skill)) {
        this.form.skills = [...this.form.skills, skill];
      }
    } else {
      this.form.skills = this.form.skills.filter(item => item !== skill);
    }
  }

  addManualSkill(): void {
    const skill = this.manualSkill.trim();
    if (!skill) {
      return;
    }

    if (!this.availableSkills.includes(skill)) {
      this.availableSkills = [...this.availableSkills, skill];
    }

    if (!this.form.skills.includes(skill)) {
      this.form.skills = [...this.form.skills, skill];
    }

    this.manualSkill = '';
  }

  resetForm(): void {
    this.form = { role: '', workMode: '', location: '', qualification: '', skills: [] };
    this.availableSkills = [];
    this.manualSkill = '';
  }

  submitForm(): void {
    if (this.form.workMode && this.form.qualification && (this.form.workMode === 'remote' || this.form.location)) {
      this.isLoading = true;
      this.internshipService.recommendInternships(this.form).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            console.log('Internships found:', response.data);
            alert('Internship recommendations fetched successfully! check console for data');
            // TODO: Navigate to a results page or show results in a modal
            this.close();
          } else {
            alert('No internships found matching your criteria.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Failed to fetch recommendations. Please try again.');
        }
      });
    } else {
      alert('Please choose work mode and qualification. Location is required only for offline.');
    }
  }
}
