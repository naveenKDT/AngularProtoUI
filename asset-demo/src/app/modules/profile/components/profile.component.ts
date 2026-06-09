import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageHeaderComponent,
  BreadcrumbComponent,
  BadgeComponent
} from '../../../shared/components';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, BadgeComponent],
  template: `
    <div class="profile-page">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="My Profile"
        description="Manage your personal information and account settings"
        [icon]="pageIcon"
        iconBg="#EFF6FF"
      >
        <div slot="actions">
          <button class="btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </app-page-header>

      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <div class="profile-cover">
          <div class="cover-pattern"></div>
        </div>
        <div class="profile-info">
          <div class="profile-avatar">
            <span>JD</span>
            <div class="status-indicator online"></div>
          </div>
          <div class="profile-details">
            <h2 class="profile-name">John Doe</h2>
            <p class="profile-role">Senior Software Engineer</p>
            <div class="profile-meta">
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Engineering Department
              </span>
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Joined Jan 15, 2024
              </span>
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                San Francisco, CA
              </span>
            </div>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">248</span>
              <span class="stat-label">Employees</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">3.5</span>
              <span class="stat-label">Years</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">15</span>
              <span class="stat-label">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Column - Profile Details -->
        <div class="left-column">
          <!-- Personal Information -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Personal Information</h3>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Full Name</span>
                  <span class="info-value">John Doe</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Employee ID</span>
                  <span class="info-value">EMP-2024-001</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">john.doe&#64;company.com</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone</span>
                  <span class="info-value">+1 (555) 123-4567</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date of Birth</span>
                  <span class="info-value">March 15, 1992</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Gender</span>
                  <span class="info-value">Male</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Information -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Work Information</h3>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Department</span>
                  <span class="info-value">Engineering</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Designation</span>
                  <span class="info-value">Senior Software Engineer</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Reporting Manager</span>
                  <span class="info-value">Sarah Mitchell</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Work Location</span>
                  <span class="info-value">San Francisco HQ</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Employment Type</span>
                  <app-badge variant="success">Full-time</app-badge>
                </div>
                <div class="info-item">
                  <span class="info-label">Work Schedule</span>
                  <span class="info-value">9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Info -->
        <div class="right-column">
          <!-- Skills Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Skills &amp; Expertise</h3>
            </div>
            <div class="card-body">
              <div class="skills-list">
                <span class="skill-tag">Angular</span>
                <span class="skill-tag">TypeScript</span>
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">AWS</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">Git</span>
                <span class="skill-tag">Agile</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Quick Actions</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button class="quick-action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span>Team Directory</span>
                </button>
                <button class="quick-action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <span>Request Leave</span>
                </button>
                <button class="quick-action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <span>Documents</span>
                </button>
                <button class="quick-action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Activity Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Activity</h3>
            </div>
            <div class="card-body">
              <div class="activity-list">
                <div class="activity-item">
                  <div class="activity-icon success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <span class="activity-text">Completed project milestone</span>
                    <span class="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <span class="activity-text">Joined team meeting</span>
                    <span class="activity-time">Yesterday</span>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <span class="activity-text">Leave request approved</span>
                    <span class="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
        .profile-page {
      animation: fadeIn 300ms ease;
    }

    .profile-header-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      overflow: hidden;
      margin-bottom: var(--spacing-8);
    }

    .profile-cover {
      height: 160px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 50%, var(--purple) 100%);
      position: relative;
      overflow: hidden;
    }

    .cover-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    }

    .profile-info {
      padding: var(--spacing-6) var(--spacing-8);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-6);
      position: relative;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      border-radius: var(--radius-3xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: var(--font-weight-bold);
      color: white;
      margin-top: -80px;
      border: 4px solid var(--bg-card);
      position: relative;
      flex-shrink: 0;
    }

    .status-indicator {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      border: 3px solid var(--bg-card);

      &.online {
        background: var(--success);
      }
    }

    .profile-details {
      flex: 1;
      padding-top: var(--spacing-4);
    }

    .profile-name {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-1) 0;
    }

    .profile-role {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-4) 0;
    }

    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-5);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);

      svg {
        color: var(--text-secondary);
      }
    }

    .profile-stats {
      display: flex;
      gap: var(--spacing-8);
      padding-top: var(--spacing-4);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-6);
    }

    .left-column,
    .right-column {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      overflow: hidden;
    }

    .card-header {
      padding: var(--spacing-5) var(--spacing-6);
      border-bottom: 1px solid var(--bg-border);
    }

    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .card-body {
      padding: var(--spacing-6);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-5);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .info-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
    }

    .skill-tag {
      padding: var(--spacing-2) var(--spacing-4);
      background: rgba(var(--primary-blue), 0.1);
      color: var(--primary-blue);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-full);
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-4);
    }

    .quick-action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-5);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        border-color: var(--primary-blue);
        transform: translateY(-2px);
      }

      span {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }
    }

    .action-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-blue);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 18px;
        height: 18px;
      }

      &.success {
        background: var(--success)-light;
        color: var(--success);
      }

      &.info {
        background: var(--info)-light;
        color: var(--info);
      }

      &.warning {
        background: var(--warning)-light;
        color: var(--warning);
      }
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .activity-text {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .activity-time {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 52px;
      padding: 0 var(--spacing-6);
      background: transparent;
      color: var(--primary-blue);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: 1px solid var(--primary-blue);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(var(--primary-blue), 0.05);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .profile-meta {
        justify-content: center;
      }

      .profile-stats {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent {
  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'My Profile' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
}