import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface InternshipRequest {
  city: string;
  qualification: string;
  skills: string;
}

export interface Internship {
  title: string;
  company: string;
  location: string;
  platform: string;
  link: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class InternshipRecommendationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/InternshipRecommendation/find';

  recommendInternships(form: any): Observable<Internship[]> {
    const payload: InternshipRequest = {
      city: form.location, // Mapping the component's 'location' to 'city'
      qualification: form.qualification,
      skills: form.skills // Assuming UI provides comma-separated string based on prompt
    };

    return this.http.post<Internship[]>(this.apiUrl, payload).pipe(
      catchError(error => {
        console.error('Internship API Error:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch internship recommendations'));
      })
    );
  }
}
