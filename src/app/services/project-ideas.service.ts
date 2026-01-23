import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ProjectIdea, ProjectIdeasRequest } from '../models/project-idea.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectIdeasService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7152/api/ProjectIdea/generate';

    generateIdeas(request: ProjectIdeasRequest): Observable<ProjectIdea[]> {
        return this.http.post<ProjectIdea[]>(this.apiUrl, request).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
