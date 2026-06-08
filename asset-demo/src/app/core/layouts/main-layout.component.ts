import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar 
        [collapsed]="sidebarCollapsed()"
        (navigate)="onNavigate($event)"
      />
      <app-header (toggleSidebar)="toggleSidebar()" />
      
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
        .layout {
      min-height: 100vh;
    }

    .main-content {
      margin-left: var(--sidebar-width-expanded);
      margin-top: var(--header-height);
      min-height: calc(100vh - var(--header-height));
      background: var(--bg-main);
      transition: margin-left var(--transition-normal);
    }

    .content-wrapper {
      padding: var(--content-padding);
      max-width: 1600px;
      margin: 0 auto;
    }

    .layout.sidebar-collapsed {
      .main-content {
        margin-left: var(--sidebar-width-collapsed);
      }
    }

    @media (max-width: 1024px) {
      .main-content {
        margin-left: var(--sidebar-width-collapsed);
      }
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }

      .content-wrapper {
        padding: var(--spacing-4);
      }
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  onNavigate(route: string): void {
    console.log('Navigate to:', route);
  }
}