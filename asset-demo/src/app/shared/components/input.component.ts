import { Component, input, signal, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="error()" [class.disabled]="disabled()">
      @if (label()) {
        <label class="input-label">{{ label() }}</label>
      }
      <div class="input-container">
        @if (prefixIcon()) {
          <span class="input-prefix" [innerHTML]="prefixIcon()"></span>
        }
        @if (type() === 'textarea') {
          <textarea
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            [rows]="rows()"
            [value]="value()"
            (input)="onInput($event)"
            (blur)="onTouched()"
            class="input-textarea"
          ></textarea>
        } @else {
          <input
            [type]="type()"
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            [value]="value()"
            (input)="onInput($event)"
            (blur)="onTouched()"
            class="input-field"
          />
        }
        @if (suffixIcon()) {
          <span class="input-suffix" [innerHTML]="suffixIcon()"></span>
        }
      </div>
      @if (error()) {
        <span class="input-error">{{ error() }}</span>
      }
      @if (hint() && !error()) {
        <span class="input-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .input-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field,
    .input-textarea {
      width: 100%;
      height: 52px;
      padding: 0 var(--spacing-4);
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      outline: none;
      transition: all var(--transition-normal);

      &::placeholder {
        color: var(--text-secondary);
      }

      &:focus {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }

      &:disabled {
        background: rgba(229, 234, 243, 0.5);
        cursor: not-allowed;
      }
    }

    .input-textarea {
      height: auto;
      min-height: 120px;
      padding: var(--spacing-4);
      resize: vertical;
    }

    .has-error {
      .input-field,
      .input-textarea {
        border-color: var(--danger);

        &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
      }
    }

    .disabled {
      opacity: 0.6;
    }

    .input-prefix,
    .input-suffix {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      pointer-events: none;

      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    .input-prefix {
      left: var(--spacing-4);
    }

    .input-suffix {
      right: var(--spacing-4);
    }

    .input-field {
      &:has(+ .input-prefix) {
        padding-left: 48px;
      }
    }

    .input-prefix + .input-field,
    .input-field:has(~ .input-suffix) {
      padding-left: 48px;
      padding-right: 48px;
    }

    .input-error {
      font-size: var(--font-size-xs);
      color: var(--danger);
    }

    .input-hint {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea'>('text');
  placeholder = input<string>('');
  disabled = input(false);
  error = input<string>('');
  hint = input<string>('');
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  rows = input<number>(4);

  value = signal('');
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }
}