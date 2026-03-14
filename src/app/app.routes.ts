import { Routes } from '@angular/router';
import { AiInterviewComponent } from './components/ai-interview/ai-interview.component';
import { CareerGuidanceComponent } from './components/career-guidance/career-guidance.component';
import { InternshipFinderComponent } from './components/internship-finder/internship-finder.component';
import { StudyRecommendComponent } from './components/study-recommend/study-recommend.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'career-guidance' },
	{ path: 'career-guidance', component: CareerGuidanceComponent },
	{ path: 'study-recommend', component: StudyRecommendComponent },
	{ path: 'internship-finder', component: InternshipFinderComponent },
	{ path: 'ai-interview', component: AiInterviewComponent }
];
