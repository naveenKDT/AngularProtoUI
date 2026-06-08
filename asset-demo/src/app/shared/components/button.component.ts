import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled()"
    >
      @if (icon()) {
        <span class="btn-icon" [innerHTML]="icon()"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      font-family: var(--font-family);
      font-weight: var(--font-weight-semibold);
      border: none;
      cursor: pointer;
      transition: all var(--transition-normal);
      white-space: nowrap;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }
    }

    // Variants
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    .btn-secondary {
      background: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--bg-border);

      &:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.05);
        border-color: var(--primary-blue);
      }
    }

    .btn-outline {
      background: transparent;
      color: var(--primary-blue);
      border: 1px solid var(--primary-blue);

      &:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.05);
      }
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);

      &:hover:not(:disabled) {
        background: rgba(229, 234, 243, 0.5);
        color: var(--text-primary);
      }
    }

    // Sizes
    .btn-sm {
      height: 36px;
      padding: 0 var(--spacing-4);
      font-size: var(--font-size-xs);
      border-radius: var(--radius-md);
    }

    .btn-md {
      height: 44px;
      padding: 0 var(--spacing-5);
      font-size: var(--font-size-sm);
      border-radius: var(--radius-lg);
    }

    .btn-lg {
      height: 52px;
      padding: 0 var(--spacing-8);
      font-size: var(--font-size-base);
      border-radius: var(--radius-lg);
    }

    // Icon button
    .btn-icon-only {
      &.btn-sm {
        width: 36px;
        padding: 0;
      }

      &.btn-md {
        width: 44px;
        padding: 0;
      }

      &.btn-lg {
        width: 52px;
        padding: 0;
      }
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(svg) {
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  icon = input<string>('');
  iconOnly = input(false);

  buttonClasses(): string {
    const classes = [
      `btn-${this.variant()}`,
      `btn-${this.size()}`,
    ];
    if (this.iconOnly()) {
      classes.push('btn-icon-only');
    }
    return classes.join(' ');
  }
}