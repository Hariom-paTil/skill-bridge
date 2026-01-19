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
    this.topAppsService.getTopApps(educationId).subscribe({
      next: (res: ApiTopApp[]) => {
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
          'asp.net core': '🔷'
        };

        const mapped: TopApp[] = res.map((app) => {
          const appNameLower = app.appName.toLowerCase();
          const icon = iconMap[appNameLower] || '⭐';
          return {
            name: app.appName,
            description: app.appDescription,
            link: app.appLink,
            icon: icon,
            tint: 'linear-gradient(135deg, #0b63f6, #67c1ff)'
          };
        });
        this.apps = mapped;
        this.lastLoadedEducationId = educationId;
      },
      error: (err) => {
        console.error('TopApps: Failed to load top apps', err);
      }
    });
  }
}
