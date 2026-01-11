import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

interface Internship {
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  stipend: string;
  focus: string[];
}

@Component({
  selector: 'app-internship-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-finder.component.html',
  styleUrl: './internship-finder.component.scss'
})
export class InternshipFinderComponent {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);

  filters = {
    keyword: '',
    location: '',
    type: 'any'
  };

  imageSrc = 'assets/internship.png';

  internships: Internship[] = [
    {
      title: 'Backend Intern',
      company: 'CloudForge',
      location: 'Remote',
      type: 'remote',
      stipend: '$1200/mo',
      focus: ['node', 'api', 'sql']
    },
    {
      title: 'Frontend Intern',
      company: 'PixelCraft',
      location: 'New York, NY',
      type: 'onsite',
      stipend: '$1100/mo',
      focus: ['angular', 'typescript', 'ux']
    },
    {
      title: 'Data Intern',
      company: 'InsightLab',
      location: 'Remote',
      type: 'remote',
      stipend: '$1300/mo',
      focus: ['python', 'sql', 'analytics']
    },
    {
      title: 'DevOps Intern',
      company: 'ShipFast',
      location: 'Austin, TX',
      type: 'hybrid',
      stipend: '$1250/mo',
      focus: ['ci/cd', 'docker', 'monitoring']
    }
  ];

  matches: Internship[] = this.internships;
  resultNote = 'Filter by role, location, or mode to see matching internships.';

  find(): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }

    const keyword = this.filters.keyword.toLowerCase();
    const location = this.filters.location.toLowerCase();
    const type = this.filters.type;

    this.matches = this.internships.filter((internship) => {
      const keywordMatch =
        !keyword ||
        internship.title.toLowerCase().includes(keyword) ||
        internship.focus.some((tag) => tag.toLowerCase().includes(keyword));

      const locationMatch = !location || internship.location.toLowerCase().includes(location);
      const typeMatch = type === 'any' || internship.type === type;

      return keywordMatch && locationMatch && typeMatch;
    });

    if (this.matches.length === 0) {
      this.resultNote = 'No matches yet. Try a broader keyword like "frontend" or "python".';
    } else {
      this.resultNote = `Showing ${this.matches.length} internships`;
    }
  }
}
