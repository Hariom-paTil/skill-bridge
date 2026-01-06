import { Routes } from '@angular/router';
import { CareerGuidanceComponent } from './components/career-guidance/career-guidance.component';
import { CodeFixerComponent } from './components/code-fixer/code-fixer.component';
import { InternshipFinderComponent } from './components/internship-finder/internship-finder.component';
import { StudyRecommendComponent } from './components/study-recommend/study-recommend.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'career-guidance' },
	{ path: 'career-guidance', component: CareerGuidanceComponent },
	{ path: 'study-recommend', component: StudyRecommendComponent },
	{ path: 'internship-finder', component: InternshipFinderComponent },
	{ path: 'code-fixer', component: CodeFixerComponent }
];
