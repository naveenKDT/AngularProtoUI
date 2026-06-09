import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      @if (title() || subtitle()) {
        <div class="card-header">
          <div class="card-header-content">
            @if (title()) {
              <div class="card-title-row">
                <div class="card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M9 12h6M9 16h6M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                  </svg>
                </div>
                <h3 class="card-title">{{ title() }}</h3>
              </div>
            }
            @if (subtitle()) {
              <p class="card-subtitle">{{ subtitle() }}</p>
            }
          </div>
        </div>
      }
      <div class="card-body" [class.no-padding]="noPadding()">
        <ng-content />
      </div>
      @if (hasFooter()) {
        <div class="card-footer">
          <ng-content select="[slot=footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
      border: 1px solid rgba(226, 232, 240, 0.8);
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%);
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .card:hover {
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.1);
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .card:hover::before {
      opacity: 1;
    }

    .hoverable:hover {
      transform: translateY(-4px);
    }

    .no-padding .card-body {
      padding: 0;
    }

    .card-header {
      padding: 24px 28px;
      border-bottom: 1px solid rgba(226, 232, 240, 0.6);
      background: linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%);
    }

    .card-header-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
      border-radius: 10px;
      color: #6366F1;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
    }

    .card-title {
      font-size: 17px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .card-subtitle {
      font-size: 14px;
      color: #64748B;
      margin: 0;
      line-height: 1.5;
    }

    .card-body {
      padding: 28px;
    }

    .card-footer {
      padding: 20px 28px;
      border-top: 1px solid rgba(226, 232, 240, 0.6);
      background: linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%);
    }

    @media (max-width: 768px) {
      .card-header,
      .card-body,
      .card-footer {
        padding: 20px;
      }
    }
  `]
})
export class CardComponent {
  title = input<string>('');
  subtitle = input<string>('');
  hoverable = input(true);
  noPadding = input(false);
  hasFooter = input(false);
  paddingSize = input<'sm' | 'md' | 'lg'>('lg');

  cardClasses(): string {
    const classes = ['card'];
    if (this.hoverable()) {
      classes.push('hoverable');
    }
    if (this.noPadding()) {
      classes.push('no-padding');
    }
    return classes.join(' ');
  }
}