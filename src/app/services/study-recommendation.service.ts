import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LearningPathStep {
  step: number;
  topic: string;
  why: string;
}

export interface RecommendationData {
  targetRole: string;
  learningPath: LearningPathStep[];
}

export interface StudyRecommendationResponse {
  success: boolean;
  data: RecommendationData;
}

export interface StudyRecommendationRequest {
  targetedSkill: string;
  knownSkills: string;
  experienceLevel: string;
  learningGoals: string;
  timeCommitment: string;
  preferredFormat: string;
}

@Injectable({ providedIn: 'root' })
export class StudyRecommendationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/StudyRecommendation/GetRecommendations';

  /**
   * Fetch study recommendations from the API
   * @param payload - Request payload with user preferences
   * @returns Observable of the API response
   */
  getRecommendations(payload: StudyRecommendationRequest): Observable<StudyRecommendationResponse> {
    // Convert currentSkills from comma-separated string to array
    const skillsArray = payload.knownSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    // Map frontend field names to API field names (PascalCase) at top level
    const apiPayload = {
      TargetRole: payload.targetedSkill,
      CurrentSkills: skillsArray,  // Array of strings
      ExperienceLevel: payload.experienceLevel,
      LearningGoals: payload.learningGoals || '',
      TimeCommitmentPerWeek: payload.timeCommitment,
      PreferredFormat: payload.preferredFormat
    };

    console.log('Sending payload to API:', apiPayload);

    return this.http.post<any>(this.apiUrl, apiPayload).pipe(
      map(response => {
        // Log response for debugging
        console.log('API Response:', response);
        
        // Validate response structure
        if (!response) {
          throw new Error('Empty response from API');
        }
        
        // If success is false, throw error with message
        if (response.success === false) {
          throw new Error(response.message || 'API returned failure status');
        }
        
        // If data is missing, throw error
        if (!response.data) {
          throw new Error('No data in API response');
        }
        
        return response as StudyRecommendationResponse;
      }),
      catchError((error) => {
        console.error('Study Recommendation API Error:', error);
        
        // Extract meaningful error message
        let errorMessage = 'Failed to fetch recommendations. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error.error?.title) {
          // Handle validation errors from API
          errorMessage = error.error.title;
          
          // If there are specific field validation errors, add them
          if (error.error.errors && typeof error.error.errors === 'object') {
            const fieldErrors = Object.entries(error.error.errors)
              .map(([field, messages]: any) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n');
            
            if (fieldErrors) {
              errorMessage += '\n\nField Errors:\n' + fieldErrors;
            }
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = `API Error: ${error.statusText}`;
        }
        
        console.error('Processed Error Message:', errorMessage);
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status || 500,
          originalError: error
        }));
      })
    );
  }
}
