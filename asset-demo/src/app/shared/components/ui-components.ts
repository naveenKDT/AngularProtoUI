import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'knod-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [ngClass]="{ 'card-clickable': clickable, 'card-bordered': bordered }">
      @if (title || headerTemplate) {
        <div class="card-header">
          @if (title) {
            <h3 class="card-title">{{ title }}</h3>
          }
          @if (subtitle) {
            <p class="card-subtitle">{{ subtitle }}</p>
          }
          <ng-content select="[card-actions]"></ng-content>
        </div>
      }
      <div class="card-body" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>
      @if (footerTemplate) {
        <div class="card-footer">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .card-bordered {
      border: 1px solid var(--color-slate-200);
      box-shadow: none;
    }

    .card-clickable {
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .card-clickable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .card-subtitle {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 4px 0 0 0;
    }

    .card-body {
      padding: 20px;
    }

    .card-body.no-padding {
      padding: 0;
    }

    .card-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--color-slate-100);
      background: var(--color-slate-50);
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() clickable = false;
  @Input() bordered = false;
  @Input() noPadding = false;
  @Input() headerTemplate = false;
  @Input() footerTemplate = false;
}

@Component({
  selector: 'knod-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-secondary]="variant === 'secondary'"
      [class.btn-outline]="variant === 'outline'"
      [class.btn-ghost]="variant === 'ghost'"
      [class.btn-danger]="variant === 'danger'"
      [class.btn-sm]="size === 'sm'"
      [class.btn-lg]="size === 'lg'"
      [class.btn-icon-only]="iconOnly"
      [disabled]="disabled || loading"
      [type]="type">
      @if (loading) {
        <span class="btn-spinner"></span>
      }
      @if (icon && !loading) {
        <span class="btn-icon" [innerHTML]="icon"></span>
      }
      @if (!iconOnly) {
        <ng-content></ng-content>
      }
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      transition: all var(--transition-fast);
      border: none;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--color-primary-600);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--color-primary-700);
    }

    .btn-secondary {
      background: var(--color-slate-100);
      color: var(--color-slate-700);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--color-slate-200);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-slate-700);
      border: 1px solid var(--color-slate-300);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--color-slate-50);
      border-color: var(--color-slate-400);
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-slate-600);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--color-slate-100);
    }

    .btn-danger {
      background: var(--color-red-600);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: var(--color-red-700);
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn-lg {
      padding: 12px 24px;
      font-size: 14px;
    }

    .btn-icon-only {
      padding: 8px;
    }

    .btn-icon-only.btn-sm {
      padding: 6px;
    }

    .btn-icon-only.btn-lg {
      padding: 10px;
    }

    .btn-icon {
      display: flex;
      align-items: center;
    }

    .btn-icon :deep(svg) {
      width: 16px;
      height: 16px;
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconOnly = false;
  @Input() icon = '';
}

@Component({
  selector: 'knod-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
    }

    .badge-blue {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }

    .badge-green {
      background: var(--color-success-50);
      color: var(--color-success-700);
    }

    .badge-amber {
      background: var(--color-warning-50);
      color: var(--color-warning-700);
    }

    .badge-red {
      background: var(--color-danger-50);
      color: var(--color-danger-700);
    }

    .badge-slate {
      background: var(--color-slate-100);
      color: var(--color-slate-600);
    }

    .badge-indigo {
      background: var(--color-indigo-50);
      color: var(--color-indigo-700);
    }

    .badge-violet {
      background: var(--color-violet-50);
      color: var(--color-violet-700);
    }

    .badge-cyan {
      background: var(--color-cyan-50);
      color: var(--color-cyan-700);
    }

    .badge-orange {
      background: var(--color-orange-50);
      color: var(--color-orange-700);
    }
  `]
})
export class BadgeComponent {
  @Input() color: 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'indigo' | 'violet' | 'cyan' | 'orange' = 'blue';
  @Input() customClass = '';

  get badgeClasses() {
    return this.customClass ? this.customClass : `badge-${this.color}`;
  }
}

@Component({
  selector: 'knod-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">{{ label }}</span>
        @if (trend) {
          <span class="stat-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
            @if (trend > 0) {
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            } @else {
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
            }
            {{ trend > 0 ? '+' : '' }}{{ trend }}%
          </span>
        }
      </div>
      <div class="stat-value">{{ value }}</div>
      @if (subtitle) {
        <div class="stat-subtitle">{{ subtitle }}</div>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 11px;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: var(--color-green-600);
    }

    .stat-trend.negative {
      color: var(--color-red-600);
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-slate-900);
      line-height: 1.2;
    }

    .stat-subtitle {
      font-size: 12px;
      color: var(--color-slate-500);
      margin-top: 4px;
    }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() subtitle = '';
  @Input() trend?: number;
}

@Component({
  selector: 'knod-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [ngClass]="'avatar-' + size" [style.background]="bgColor">
      @if (src) {
        <img [src]="src" [alt]="name" class="avatar-img">
      } @else {
        <span class="avatar-initials">{{ initials }}</span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-sm {
      width: 28px;
      height: 28px;
      font-size: 10px;
      border-radius: 6px;
    }

    .avatar-md {
      width: 36px;
      height: 36px;
      font-size: 12px;
    }

    .avatar-lg {
      width: 48px;
      height: 48px;
      font-size: 16px;
      border-radius: 10px;
    }

    .avatar-xl {
      width: 64px;
      height: 64px;
      font-size: 20px;
      border-radius: 12px;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      text-transform: uppercase;
    }
  `]
})
export class AvatarComponent {
  @Input() name = '';
  @Input() src = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: string = '';

  get initials(): string {
    return this.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get bgColor(): string {
    if (this.color) return this.color;
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
      '#f97316', '#eab308', '#22c55e', '#06b6d4'
    ];
    const index = this.name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}

@Component({
  selector: 'knod-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header" *ngIf="label || showValue">
        <span class="progress-label">{{ label }}</span>
        @if (showValue) {
          <span class="progress-value">{{ value }}%</span>
        }
      </div>
      <div class="progress-bar">
        <div class="progress-fill" [ngClass]="'fill-' + color" [style.width.%]="value"></div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .progress-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .progress-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-700);
    }

    .progress-bar {
      height: 6px;
      background: var(--color-slate-100);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width var(--transition-slow);
    }

    .fill-blue {
      background: var(--color-primary-500);
    }

    .fill-green {
      background: var(--color-success-500);
    }

    .fill-amber {
      background: var(--color-warning-500);
    }

    .fill-red {
      background: var(--color-red-500);
    }

    .fill-indigo {
      background: var(--color-indigo-500);
    }
  `]
})
export class ProgressComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() showValue = false;
  @Input() color: 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'violet' | 'cyan' | 'slate' = 'blue';
}

@Component({
  selector: 'knod-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs">
      @for (tab of tabs; track tab.key) {
        <button 
          class="tab"
          [class.active]="activeTab === tab.key"
          (click)="selectTab(tab.key)">
          @if (tab.icon) {
            <span class="tab-icon" [innerHTML]="tab.icon"></span>
          }
          {{ tab.label }}
          @if (tab.count !== undefined) {
            <span class="tab-count">{{ tab.count }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: 4px;
      padding: 4px;
      background: var(--color-slate-100);
      border-radius: 10px;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
      border-radius: 6px;
      transition: all var(--transition-fast);
    }

    .tab:hover {
      color: var(--color-slate-900);
    }

    .tab.active {
      background: white;
      color: var(--color-slate-900);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .tab-icon {
      display: flex;
    }

    .tab-icon :deep(svg) {
      width: 16px;
      height: 16px;
    }

    .tab-count {
      background: var(--color-slate-200);
      color: var(--color-slate-600);
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
    }

    .tab.active .tab-count {
      background: var(--color-primary-100);
      color: var(--color-primary-700);
    }
  `]
})
export class TabsComponent {
  @Input() tabs: Array<{ key: string; label: string; icon?: string; count?: number }> = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(key: string): void {
    this.tabChange.emit(key);
  }
}

@Component({
  selector: 'knod-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown" [class.open]="isOpen">
      <button class="dropdown-trigger" (click)="toggle()">
        <ng-content select="[dropdown-trigger]"></ng-content>
      </button>
      @if (isOpen) {
        <div class="dropdown-menu">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-trigger {
      cursor: pointer;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: white;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      z-index: 50;
      overflow: hidden;
    }
  `]
})
export class DropdownComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
}

@Component({
  selector: 'knod-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-box">
      <span class="search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </span>
      <input 
        type="text" 
        class="search-input" 
        [placeholder]="placeholder"
        [ngModel]="value"
        (ngModelChange)="valueChange.emit($event)">
      @if (value) {
        <button class="search-clear" (click)="clear()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--color-slate-400);
      display: flex;
    }

    .search-input {
      width: 100%;
      padding: 10px 12px 10px 40px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      transition: all var(--transition-fast);
      background: var(--color-slate-50);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      background: white;
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .search-input::placeholder {
      color: var(--color-slate-400);
    }

    .search-clear {
      position: absolute;
      right: 8px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--color-slate-400);
    }

    .search-clear:hover {
      background: var(--color-slate-100);
      color: var(--color-slate-600);
    }
  `]
})
export class SearchComponent {
  @Input() placeholder = 'Search...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  clear(): void {
    this.value = '';
    this.valueChange.emit('');
  }
}

@Component({
  selector: 'knod-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="select-wrapper">
      @if (label) {
        <label class="select-label">{{ label }}</label>
      }
      <div class="select-box" [class.disabled]="disabled">
        <select 
          class="select-input"
          [ngModel]="value"
          (ngModelChange)="valueChange.emit($event)"
          [disabled]="disabled">
          @if (placeholder) {
            <option value="" disabled>{{ placeholder }}</option>
          }
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <span class="select-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .select-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .select-box {
      position: relative;
    }

    .select-input {
      width: 100%;
      padding: 10px 36px 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
      cursor: pointer;
      appearance: none;
      transition: all var(--transition-fast);
    }

    .select-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .select-box.disabled .select-input {
      background: var(--color-slate-50);
      cursor: not-allowed;
    }

    .select-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-slate-400);
      pointer-events: none;
    }
  `]
})
export class SelectComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() options: Array<{ value: string; label: string }> = [];
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();
}

@Component({
  selector: 'knod-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper" [class.error]="error">
      @if (label) {
        <label class="input-label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }
      <input 
        [type]="type"
        class="input-field"
        [placeholder]="placeholder"
        [ngModel]="value"
        (ngModelChange)="valueChange.emit($event)"
        [disabled]="disabled">
      @if (error) {
        <span class="input-error">{{ error }}</span>
      }
      @if (hint && !error) {
        <span class="input-hint">{{ hint }}</span>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .required {
      color: var(--color-red-500);
    }

    .input-field {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      transition: all var(--transition-fast);
      background: white;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .input-field:disabled {
      background: var(--color-slate-50);
      cursor: not-allowed;
    }

    .input-wrapper.error .input-field {
      border-color: var(--color-red-500);
    }

    .input-error {
      font-size: 11px;
      color: var(--color-red-600);
    }

    .input-hint {
      font-size: 11px;
      color: var(--color-slate-500);
    }
  `]
})
export class InputComponent {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() error = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() required = false;
  @Output() valueChange = new EventEmitter<string>();
}

@Component({
  selector: 'knod-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="textarea-wrapper" [class.error]="error">
      @if (label) {
        <label class="textarea-label">{{ label }}</label>
      }
      <textarea 
        class="textarea-field"
        [placeholder]="placeholder"
        [rows]="rows"
        [ngModel]="value"
        (ngModelChange)="valueChange.emit($event)"
        [disabled]="disabled"></textarea>
      @if (error) {
        <span class="textarea-error">{{ error }}</span>
      }
    </div>
  `,
  styles: [`
    .textarea-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .textarea-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .textarea-field {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      resize: vertical;
      min-height: 80px;
      transition: all var(--transition-fast);
      font-family: inherit;
    }

    .textarea-field:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .textarea-field:disabled {
      background: var(--color-slate-50);
      cursor: not-allowed;
    }

    .textarea-wrapper.error .textarea-field {
      border-color: var(--color-red-500);
    }

    .textarea-error {
      font-size: 11px;
      color: var(--color-red-600);
    }
  `]
})
export class TextareaComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() error = '';
  @Input() rows = 3;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();
}

@Component({
  selector: 'knod-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon" [innerHTML]="icon"></div>
      <h3 class="empty-title">{{ title }}</h3>
      @if (description) {
        <p class="empty-description">{{ description }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-slate-100);
      border-radius: 16px;
      color: var(--color-slate-400);
      margin-bottom: 16px;
    }

    .empty-icon :deep(svg) {
      width: 28px;
      height: 28px;
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .empty-description {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0 0 16px 0;
      max-width: 320px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  @Input() title = 'No data found';
  @Input() description = '';
}