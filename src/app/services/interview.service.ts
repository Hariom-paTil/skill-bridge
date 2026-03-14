import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface InterviewStartRequest {
  qualification: string;
  skills: string;
  projects: string;
  role: string;
}

export interface InterviewQuestionResponse {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/Interview/start';

  startInterview(payload: InterviewStartRequest): Observable<InterviewQuestionResponse[]> {
    return this.http.post<InterviewQuestionResponse[]>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Interview API Error:', error);
    return throwError(() => new Error(error.error?.message || 'Failed to start interview.'));
  }
}
