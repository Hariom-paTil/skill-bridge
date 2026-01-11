import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopApp {
  appName: string;
  educationId: number;
  appLink: string;
  appDescription: string;
}

@Injectable({ providedIn: 'root' })
export class TopAppsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/TopApp';

  getTopApps(educationId: number): Observable<TopApp[]> {
    return this.http.get<TopApp[]>(`${this.apiUrl}?id=${educationId}`);
  }
}
