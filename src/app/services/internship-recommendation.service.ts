import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface InternshipRequest {
  location: string;
  internshipMode: string;
  qualification: string;
  skills: string[];
}

export interface Internship {
  internshipId?: number;
  companyName: string;
  internshipRole: string;
  companyLocation: string;
  internshipMode: string;
  internshipType: string;
  stipendAmount?: number;
  durationMonths?: number;
  applyLink?: string;
  companyDescription?: string;
  skillMatchScore?: number;
}

export interface InternshipResponse {
  success: boolean;
  message?: string;
  data: Internship[];
}

@Injectable({
  providedIn: 'root'
})
export class InternshipRecommendationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/InternshipRecommendation/recommend';

  recommendInternships(form: any): Observable<InternshipResponse> {
    const payload: InternshipRequest = {
      location: form.location,
      internshipMode: form.internshipMode,
      qualification: form.qualification,
      skills: form.skills
    };

    return this.http.post<InternshipResponse>(this.apiUrl, payload).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Internship API Error:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch internship recommendations'));
      })
    );
  }
  // Interface updated for API consistency
}
