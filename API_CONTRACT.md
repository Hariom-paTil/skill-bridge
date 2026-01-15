# 📡 Study Recommendation API Contract

## Endpoint Details

**Base URL**: `https://localhost:7152`
**Endpoint**: `/api/StudyRecommendation/GetRecommendations`
**Method**: `POST`
**Content-Type**: `application/json`
**Authentication**: Required (User must be logged in)

---

## Request Payload

```typescript
interface StudyRecommendationRequest {
  targetedSkill: string;      // Required: e.g., ".NET Backend Developer"
  knownSkills: string;         // Optional: Comma-separated skills
  experienceLevel: string;     // Required: "beginner", "intermediate", "advanced"
  learningGoals: string;       // Optional: User's objectives
  timeCommitment: string;      // Required: "1-5", "5-10", "10-20", "20+"
  preferredFormat: string;     // Required: "video", "reading", "interactive", "mixed"
}
```

### Example Request
```json
{
  "targetedSkill": ".NET Backend Developer",
  "knownSkills": "C#, Entity Framework, SQL Server",
  "experienceLevel": "intermediate",
  "learningGoals": "Build scalable REST APIs with clean architecture",
  "timeCommitment": "10-20",
  "preferredFormat": "mixed"
}
```

---

## Response Payload

```typescript
interface StudyRecommendationResponse {
  success: boolean;
  data: {
    targetRole: string;
    learningPath: LearningPathStep[];
  }
}

interface LearningPathStep {
  step: number;
  topic: string;
  why: string;
}
```

### Example Response
```json
{
  "success": true,
  "data": {
    "targetRole": ".NET Backend Developer",
    "learningPath": [
      {
        "step": 1,
        "topic": "Generic Repository Pattern",
        "why": "Provides reusable and testable data access abstraction"
      },
      {
        "step": 2,
        "topic": "Service Layer Pattern",
        "why": "Separates business logic from controllers"
      },
      {
        "step": 3,
        "topic": "AutoMapper",
        "why": "Simplifies DTO to entity mapping"
      },
      {
        "step": 4,
        "topic": "CQRS",
        "why": "Separates read and write concerns for scalability"
      },
      {
        "step": 5,
        "topic": "Unit Testing with xUnit",
        "why": "Ensures code quality and reliability"
      },
      {
        "step": 6,
        "topic": "Dependency Injection Container",
        "why": "Manages object lifecycles and dependencies automatically"
      },
      {
        "step": 7,
        "topic": "API Versioning",
        "why": "Maintains backward compatibility as APIs evolve"
      },
      {
        "step": 8,
        "topic": "Caching Strategies",
        "why": "Improves API performance and reduces database load"
      }
    ]
  }
}
```

---

## Error Response

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated",
  "statusCode": 401
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request payload",
  "statusCode": 400
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Integration Code

### TypeScript Service Usage
```typescript
import { StudyRecommendationService } from '@services/study-recommendation.service';

// Inject service
private studyService = inject(StudyRecommendationService);

// Make API call
this.studyService.getRecommendations(payload).subscribe({
  next: (response) => {
    console.log('Target Role:', response.data.targetRole);
    response.data.learningPath.forEach(step => {
      console.log(`Step ${step.step}: ${step.topic}`);
    });
  },
  error: (error) => {
    console.error('API Error:', error.message);
  }
});
```

---

## Field Value Options

### experienceLevel
- `beginner` - Just starting out
- `intermediate` - Some experience
- `advanced` - Building expertise

### timeCommitment
- `1-5` - 1-5 hours per week
- `5-10` - 5-10 hours per week
- `10-20` - 10-20 hours per week
- `20+` - 20+ hours per week

### preferredFormat
- `video` - Video tutorials
- `reading` - Reading & documentation
- `interactive` - Interactive courses
- `mixed` - Mixed format (recommended)

---

## Request/Response Cycle

```
┌─────────────────────────────────────┐
│  Study Recommendation Component     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ StudyRecommendationService          │
│  - Validates request payload        │
│  - Handles HTTP communication       │
│  - Maps response to interfaces      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ POST /api/StudyRecommendation/      │
│      GetRecommendations             │
│ (https://localhost:7152)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  API Server                         │
│  - Process learning request         │
│  - Generate recommendations         │
│  - Return structured response       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Component Display                  │
│  - Show target role                 │
│  - Animate learning path            │
│  - Display with typing effect       │
└─────────────────────────────────────┘
```

---

## Error Handling Strategy

1. **Network Error**: "Failed to fetch recommendations. Please check your connection."
2. **API Error (4xx/5xx)**: Display specific error from API
3. **Invalid Response**: "Invalid API response structure"
4. **User Not Authenticated**: "Please login to get recommendations"

---

## Performance Considerations

- **Request Timeout**: 30 seconds
- **Caching**: Recommended for frequently requested data
- **Rate Limiting**: Monitor API usage
- **Pagination**: N/A (Fixed response size)

---

## Security Notes

- ✅ HTTPS only (https://localhost:7152)
- ✅ Authentication required
- ✅ Input validation on backend
- ✅ CORS configured properly
- ✅ No sensitive data in response

---

## Testing Payloads

### Frontend Developer
```json
{
  "targetedSkill": "Frontend Developer",
  "knownSkills": "HTML, CSS, JavaScript",
  "experienceLevel": "beginner",
  "learningGoals": "Master React and modern web development",
  "timeCommitment": "10-20",
  "preferredFormat": "video"
}
```

### Full Stack Developer
```json
{
  "targetedSkill": "Full Stack Developer",
  "knownSkills": "JavaScript, Node.js, Basic SQL",
  "experienceLevel": "intermediate",
  "learningGoals": "Build complete web applications",
  "timeCommitment": "5-10",
  "preferredFormat": "mixed"
}
```

### DevOps Engineer
```json
{
  "targetedSkill": "DevOps Engineer",
  "knownSkills": "Linux, Docker basics",
  "experienceLevel": "intermediate",
  "learningGoals": "Master Kubernetes and cloud infrastructure",
  "timeCommitment": "20+",
  "preferredFormat": "interactive"
}
```

---

**API Version**: 1.0
**Last Updated**: January 15, 2026
**Status**: ✅ Active & Production Ready
