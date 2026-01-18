import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface InternshipRequest {
  Role?: string;
  WorkMode: string;
  Location?: string;
  Qualification: string;
  Skills: string[];
}

export interface Internship {
  id?: number;
  companyName: string;
  role: string;
  location: string;
  workMode: string;
  stipend?: string;
  duration?: string;
  applyLink?: string;
  description?: string;
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
      Role: form.role,
      WorkMode: form.workMode, // 'remote' or 'offline'
      Location: form.workMode === 'offline' ? form.location : undefined,
      Qualification: form.qualification,
      Skills: form.skills
    };

    console.log('Sending internship recommendation request:', payload);

    return this.http.post<InternshipResponse>(this.apiUrl, payload).pipe(
      map(response => {
        console.log('Internship API Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Internship API Error:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch internship recommendations'));
      })
    );
  }
}
