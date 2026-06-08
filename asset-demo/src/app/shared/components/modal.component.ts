import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container" [class]="'modal-' + size()" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ title() }}</h2>
            <button class="modal-close" (click)="close()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
          @if (showFooter()) {
            <div class="modal-footer">
              <ng-content select="[slot=footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
        .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(var(--sidebar-gradient-start), 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
      padding: var(--spacing-4);
      animation: fadeIn 200ms ease;
    }

    .modal-container {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-dropdown);
      max-height: 90vh;
      overflow: auto;
      animation: scaleIn 200ms ease;
      width: 100%;

      &.modal-sm {
        max-width: 400px;
      }

      &.modal-md {
        max-width: 560px;
      }

      &.modal-lg {
        max-width: 720px;
      }

      &.modal-xl {
        max-width: 960px;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-6) var(--spacing-8);
      border-bottom: 1px solid var(--bg-border);
    }

    .modal-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .modal-close {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: rgba(var(--bg-border), 0.5);
        color: var(--text-primary);
      }
    }

    .modal-body {
      padding: var(--spacing-6) var(--spacing-8);
    }

    .modal-footer {
      padding: var(--spacing-5) var(--spacing-8);
      border-top: 1px solid var(--bg-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class ModalComponent {
  isOpen = input(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  showFooter = input(true);
  closeOnOverlay = input(true);

  closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlay()) {
      this.close();
    }
  }
}