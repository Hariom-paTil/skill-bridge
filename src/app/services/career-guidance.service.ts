import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GuidanceRequest {
  name: string;
  currentCourse: string;
  targetCareer: string;
  currentSkills: string[];
  description: string;
}

interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    total_time: number;
  };
  service_tier: string;
}

@Injectable({ providedIn: 'root' })
export class CareerGuidanceService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7152/api/CareerGuidance';

  requestGuidance(payload: GuidanceRequest): Observable<string> {
    return this.http.post<ApiResponse>(this.apiUrl, payload).pipe(
      map(response => {
        if (response.choices && response.choices.length > 0) {
          return response.choices[0].message.content;
        }
        return 'No guidance available at this time.';
      }),
      catchError((error) => {
        console.error('API error:', error);
        return this.localSuggest(payload);
      })
    );
  }

  private localSuggest(payload: GuidanceRequest): Observable<string> {
    const skillsList = payload.currentSkills.join(', ');
    const fallbackGuidance = `Based on your profile, here's personalized career guidance:

**Career Path Recommendation**
Given your goal of "${payload.targetCareer}" and current skills in ${skillsList}, you're well-positioned for several career paths.

**1. Skill Gaps to Address:**
- Advanced framework knowledge
- System design principles
- Cloud computing platforms
- DevOps and CI/CD
- Testing and quality assurance

**2. Learning Roadmap:**

**Phase 1: Foundation (2-3 months)**
- Strengthen core programming fundamentals
- Learn Git and version control
- Practice data structures and algorithms

**Phase 2: Specialization (3-4 months)**
- Deep dive into your chosen tech stack
- Build 2-3 portfolio projects
- Learn relevant frameworks and tools

**Phase 3: Advanced Topics (2-3 months)**
- System design patterns
- Performance optimization
- Security best practices

**3. Career Advice:**
- Build a strong GitHub profile with quality projects
- Contribute to open source projects
- Network with professionals in your target field
- Practice technical interviews regularly
- Consider internships or freelance work

**4. Recommended Resources:**
- Online courses: Coursera, Udemy, freeCodeCamp
- Practice platforms: LeetCode, HackerRank
- Documentation: MDN, official framework docs
- Communities: Stack Overflow, Reddit, Discord servers

Stay consistent with your learning and build projects regularly. Good luck with your career journey!`;

    return of(fallbackGuidance);
  }
}
