import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  educationId: number;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/Auth';

  register(payload: SignupRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, { email, password });
  }
}
