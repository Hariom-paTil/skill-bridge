import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthModalService } from '../../services/auth-modal.service';

interface Expert {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  expertise: string[];
  blog: BlogPost[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  icon: string;
}

@Component({
  selector: 'app-study-road',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-road.component.html',
  styleUrl: './study-road.component.scss'
})
export class StudyRoadComponent {
  private authState = inject(AuthStateService);
  private authModal = inject(AuthModalService);

  @Output() closeModal = new EventEmitter<void>();

  selectedExpert: Expert | null = null;
  selectedBlog: BlogPost | null = null;
  showExpertDetail = false;
  showBlogDetail = false;

  experts: Expert[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Full Stack Developer',
      image: 'assets/expert-1.jpg',
      bio: 'With 8+ years of experience in web development, Sarah specializes in building scalable applications and mentoring junior developers.',
      expertise: ['Full Stack Development', 'JavaScript', 'React', 'Node.js', 'System Design'],
      blog: [
        {
          id: 1,
          title: 'The Art of Writing Clean Code',
          excerpt: 'Learn best practices for writing maintainable, readable code that your team will love.',
          content: `Writing clean code is not just about making your code work—it's about making it understandable for others and your future self.

Key Principles:
1. **Meaningful Names**: Use clear, descriptive names for variables and functions
2. **Small Functions**: Keep functions focused on a single responsibility
3. **DRY (Don't Repeat Yourself)**: Avoid code duplication
4. **Error Handling**: Always handle errors gracefully
5. **Testing**: Write tests as you code

Tips for Success:
- Refactor regularly
- Get code reviews
- Use linters and formatters
- Document complex logic
- Practice consistently`,
          date: '2024-01-10',
          readTime: '8 min read',
          icon: '📝'
        },
        {
          id: 2,
          title: 'Mastering React Hooks',
          excerpt: 'Deep dive into React Hooks and how to use them effectively in modern applications.',
          content: `React Hooks revolutionized how we write React components. Here's what you need to know:

Essential Hooks:
1. **useState**: Manage component state
2. **useEffect**: Handle side effects
3. **useContext**: Access context without props drilling
4. **useReducer**: Complex state management
5. **useCallback**: Optimize performance
6. **useMemo**: Memoize expensive calculations

Common Patterns:
- Custom hooks for reusable logic
- Hook dependencies and cleanup
- Performance optimization
- Testing hooks properly

Practice Projects:
- Todo app with custom hooks
- Data fetching with error handling
- Form management with hooks`,
          date: '2024-01-15',
          readTime: '12 min read',
          icon: '⚛️'
        }
      ]
    },
    {
      id: 2,
      name: 'Alex Chen',
      position: 'DevOps & Cloud Architect',
      image: 'assets/expert-2.jpg',
      bio: 'Alex is passionate about infrastructure automation and cloud technologies. He helps teams scale their applications efficiently.',
      expertise: ['DevOps', 'Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines'],
      blog: [
        {
          id: 3,
          title: 'Docker Fundamentals for Beginners',
          excerpt: 'Get started with containerization and understand Docker basics.',
          content: `Docker is a game-changer for development and deployment. Let's break it down:

Core Concepts:
1. **Containers**: Lightweight, isolated environments
2. **Images**: Blueprint for containers
3. **Dockerfile**: Configuration file for images
4. **Docker Compose**: Multi-container applications
5. **Registry**: Repository for images

Getting Started:
- Install Docker
- Write your first Dockerfile
- Build and run images
- Push to Docker Hub
- Use Docker Compose

Best Practices:
- Keep images small
- Use specific base image versions
- Leverage layer caching
- Security scanning
- Multi-stage builds`,
          date: '2024-01-12',
          readTime: '10 min read',
          icon: '🐳'
        },
        {
          id: 4,
          title: 'Kubernetes Deployment Guide',
          excerpt: 'Learn how to deploy and manage applications on Kubernetes.',
          content: `Kubernetes orchestrates containers at scale. Here's how to get started:

Key Concepts:
1. **Pods**: Smallest deployable units
2. **Services**: Expose pod functionality
3. **Deployments**: Manage replicas
4. **ConfigMaps**: Store configurations
5. **Secrets**: Manage sensitive data

Setting Up:
- Minikube for local development
- kubectl basics
- YAML manifest files
- Health checks and probes

Production Tips:
- Resource requests and limits
- Horizontal Pod Autoscaling
- Rolling updates
- Monitoring and logging
- Network policies`,
          date: '2024-01-18',
          readTime: '15 min read',
          icon: '☸️'
        }
      ]
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Data Science & ML Engineer',
      image: 'assets/expert-3.jpg',
      bio: 'Emma transforms data into insights. She specializes in machine learning and helping teams build intelligent solutions.',
      expertise: ['Machine Learning', 'Python', 'Data Analysis', 'TensorFlow', 'Statistical Analysis'],
      blog: [
        {
          id: 5,
          title: 'Python for Data Science',
          excerpt: 'Essential Python libraries and techniques for data analysis and machine learning.',
          content: `Python is the lingua franca of data science. Learn the essential libraries:

Core Libraries:
1. **NumPy**: Numerical computing
2. **Pandas**: Data manipulation
3. **Scikit-learn**: Machine learning
4. **Matplotlib/Seaborn**: Visualization
5. **TensorFlow/PyTorch**: Deep learning

Common Workflows:
- Data loading and cleaning
- Exploratory data analysis
- Feature engineering
- Model training and evaluation
- Visualization and reporting

Learning Path:
- Week 1-2: Python fundamentals
- Week 3-4: NumPy and Pandas
- Week 5-6: Scikit-learn basics
- Week 7-8: Build first project
- Weeks 9-10: Advanced topics`,
          date: '2024-01-14',
          readTime: '11 min read',
          icon: '🐍'
        },
        {
          id: 6,
          title: 'Getting Started with Machine Learning',
          excerpt: 'Understand ML fundamentals and build your first model.',
          content: `Machine learning enables computers to learn from data. Here's where to start:

ML Fundamentals:
1. **Supervised Learning**: Regression & Classification
2. **Unsupervised Learning**: Clustering & Dimensionality
3. **Feature Engineering**: Prepare better data
4. **Model Evaluation**: Measure performance
5. **Validation**: Train/Test split strategies

Your First Project:
- Choose a dataset (Kaggle)
- Exploratory analysis
- Data preprocessing
- Train multiple models
- Evaluate and compare
- Deploy solution

Common Pitfalls:
- Overfitting
- Ignoring data quality
- Poor feature engineering
- Not validating properly
- Forgetting about bias`,
          date: '2024-01-20',
          readTime: '13 min read',
          icon: '🤖'
        }
      ]
    }
  ];

  selectExpert(expert: Expert): void {
    if (!this.authState.isLoggedIn()) {
      this.authModal.showLogin();
      return;
    }
    this.selectedExpert = expert;
    this.showExpertDetail = true;
    this.selectedBlog = null;
  }

  selectBlog(blog: BlogPost): void {
    this.selectedBlog = blog;
    this.showBlogDetail = true;
  }

  closeBlogDetail(): void {
    this.showBlogDetail = false;
    setTimeout(() => {
      this.selectedBlog = null;
    }, 300);
  }

  closeExpertDetail(): void {
    this.showExpertDetail = false;
    setTimeout(() => {
      this.selectedExpert = null;
      this.selectedBlog = null;
    }, 300);
    this.closeModal.emit();
  }
}
