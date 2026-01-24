import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopAppsService, TopApp as ApiTopApp } from '../../services/top-apps.service';
import { AuthStateService } from '../../services/auth-state.service';

interface TopApp {
  name: string;
  description: string;
  link: string;
  icon: string;
  tint: string;
}

@Component({
  selector: 'app-top-apps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-apps.component.html',
  styleUrl: './top-apps.component.scss'
})
export class TopAppsComponent implements OnInit {
  apps: TopApp[] = [];
  selectedApp: TopApp | null = null;
  isLoading = false;
  private lastLoadedEducationId: number | null = null;

  constructor(private topAppsService: TopAppsService, public authState: AuthStateService) {
    effect(() => {
      const loggedIn = this.authState.isLoggedIn();
      const user = this.authState.userDetails();
      const eduId = user?.educationId;

      if (loggedIn && eduId) {
        if (this.lastLoadedEducationId !== eduId) {
          this.loadTopApps(eduId);
        }
      } else if (!loggedIn) {
        this.apps = [];
        this.lastLoadedEducationId = null;
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    // ngOnInit no longer needed, effect handles all auth state monitoring
  }

  get doubledApps(): TopApp[] {
    // Repeat to keep marquee populated even if the API returns a single app.
    return [...this.apps, ...this.apps, ...this.apps];
  }

  selectApp(app: TopApp): void {
    this.selectedApp = app;
  }

  closeModal(): void {
    this.selectedApp = null;
  }

  trackByName(_index: number, app: TopApp): string {
    return app.name;
  }

  showSection(): boolean {
    const isLoggedIn = this.authState.isLoggedIn();
    return isLoggedIn;
  }

  private loadTopApps(educationId: number): void {
    this.isLoading = true;
    this.topAppsService.getTopApps(educationId).subscribe({
      next: (res: ApiTopApp[]) => {
        let appsToMap = res;

        // Fallback if no specific apps are found
        if (!res || res.length === 0) {
          appsToMap = [
            { appName: 'Visual Studio Code', educationId: 0, appLink: 'https://code.visualstudio.com', appDescription: 'VS Code is a lightweight but powerful code editor defining modern development.' },
            { appName: 'GitHub', educationId: 0, appLink: 'https://github.com', appDescription: 'GitHub is the world’s leading platform for version control and collaboration.' },
            { appName: 'Postman', educationId: 0, appLink: 'https://www.postman.com', appDescription: 'Postman is an essential tool for building and testing APIs.' },
            { appName: 'Docker', educationId: 0, appLink: 'https://www.docker.com', appDescription: 'Docker helps developers build, share, and run applications anywhere using containers.' },
            { appName: 'Stack Overflow', educationId: 0, appLink: 'https://stackoverflow.com', appDescription: 'The largest, most trusted online community for developers to learn and share knowledge.' },
            { appName: 'ChatGPT', educationId: 0, appLink: 'https://chat.openai.com', appDescription: 'AI assistant that helps debug code, write documentation, and brainstorm ideas.' }
          ];
        }

        const iconMap: Record<string, string> = {
          'github': '🐙',
          'gitlab': '🦊',
          'bitbucket': '⚙️',
          'postman': '📮',
          'swagger': '📋',
          'visual studio code': '💻',
          'visual studio': '🛠️',
          'intellij idea': '💡',
          'eclipse': '🌑',
          'netbeans': '🔧',
          'docker': '🐳',
          'kubernetes': '☸️',
          'mysql': '🐬',
          'postgresql': '🐘',
          'mongodb': '🍃',
          'redis': '⚡',
          'firebase': '🔥',
          'aws': '☁️',
          'azure': '☁️',
          'google cloud': '☁️',
          'jenkins': '🤖',
          'apache maven': '📦',
          'gradle': '📦',
          'npm': '📚',
          'yarn': '🧶',
          'angular': '🅰️',
          'react': '⚛️',
          'node.js': '🟩',
          'spring boot': '🍃',
          'asp.net core': '🔷',
          'stack overflow': '🥞',
          'chatgpt': '🤖'
        };

        const mapped: TopApp[] = appsToMap.map((app) => {
          // Safety check: ensure appName exists
          const appName = app.appName || '';
          const appNameLower = appName.toLowerCase();
          const icon = iconMap[appNameLower] || '⭐';
          return {
            name: appName || 'Unknown App',
            description: app.appDescription || 'No description available',
            link: app.appLink || '#',
            icon: icon,
            tint: 'linear-gradient(135deg, #0b63f6, #67c1ff)'
          };
        });
        this.apps = mapped;
        this.lastLoadedEducationId = educationId;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('TopApps: Failed to load top apps', err);
        this.isLoading = false;
      }
    });
  }
}
