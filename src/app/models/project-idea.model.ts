export interface ProjectIdeasRequest {
    level: string;
    techStack: string[];
    category: string;
    purpose: string;
    features: string[];
}

export interface ProjectIdea {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skills: string[];
    features: string[];
    timeEstimate: string;
}
