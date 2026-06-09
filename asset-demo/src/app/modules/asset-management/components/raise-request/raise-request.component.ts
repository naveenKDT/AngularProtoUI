import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
  PageHeaderComponent
} from '../../../../shared/components';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent
} from '../../../../shared/components/ui-components';

@Component({
  selector: 'knodtec-raise-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    BreadcrumbComponent,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent
  ],
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss']
})
export class RaiseRequestComponent {
  private router: Router;

  // ─── Breadcrumb (driven by design system shared component) ───
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home',              route: '/dashboard' },
    { label: 'Asset Management',  route: '/assets' },
    { label: 'Requests',          route: '/requests' },
    { label: 'Raise Asset Request' }
  ];

  // ─── Page Header Icon ────────────────────────────────────────
  readonly pageIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  `;

  // ─── Form State (Signals) ───────────────────────────────────
  readonly requestType       = signal('');
  readonly category          = signal('');
  readonly specificAsset     = signal('');
  readonly quantity          = signal(1);
  readonly priority          = signal('medium');
  readonly justification     = signal('');
  readonly replacementReason = signal('');
  readonly currentAsset      = signal('');
  readonly specifications    = signal('');
  readonly budget            = signal('');
  readonly neededByDate      = signal('');
  readonly location          = signal('');
  readonly additionalNotes   = signal('');
  readonly attachments       = signal<Array<{ name: string; size: string }>>([]);

  // ─── Static Reference Data ──────────────────────────────────
  readonly requestTypes = [
    { value: 'new',         label: 'New Asset',    description: 'Request a new asset for new hire or new requirement', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
    { value: 'replacement', label: 'Replacement',  description: 'Replace damaged, lost, or outdated asset',           icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' },
    { value: 'upgrade',     label: 'Upgrade',      description: 'Upgrade existing asset to better specifications',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>' },
    { value: 'accessory',   label: 'Accessory',    description: 'Request additional accessories or peripherals',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' }
  ];

  readonly priorityOptions = [
    { value: 'high',   label: 'High Priority',   description: 'Urgent, blocking work' },
    { value: 'medium', label: 'Medium Priority', description: 'Needed within 1-2 weeks' },
    { value: 'low',    label: 'Low Priority',    description: 'Can wait, no immediate need' }
  ];

  constructor(router: Router) {
    this.router = router;
  }

  // ─── File Upload Helpers ───────────────────────────────────
  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files).map(file => ({
      name: file.name,
      size: this.formatFileSize(file.size)
    }));
    this.attachments.update(current => [...current, ...files]);
    input.value = '';
  }

  removeAttachment(name: string): void {
    this.attachments.update(current => current.filter(f => f.name !== name));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)            return bytes + ' B';
    if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ─── Summary ───────────────────────────────────────────────
  getRequestSummary(): string {
    const parts: string[] = [];
    if (this.requestType())  parts.push(this.requestType());
    if (this.category())     parts.push(this.category());
    if (this.quantity() > 1) parts.push(`(Qty: ${this.quantity()})`);
    return parts.join(' ') || 'No items selected';
  }

  // ─── Navigation ─────────────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/requests']);
  }

  // ─── Submit ─────────────────────────────────────────────────
  submitRequest(): void {
    if (!this.requestType() || !this.category() || !this.justification().trim() || !this.location()) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Submitting request:', {
      requestType:       this.requestType(),
      category:          this.category(),
      specificAsset:     this.specificAsset(),
      quantity:          this.quantity(),
      priority:          this.priority(),
      justification:     this.justification(),
      replacementReason: this.replacementReason(),
      currentAsset:      this.currentAsset(),
      specifications:    this.specifications(),
      budget:            this.budget(),
      neededByDate:      this.neededByDate(),
      location:          this.location(),
      additionalNotes:   this.additionalNotes(),
      attachments:       this.attachments()
    });
    this.router.navigate(['/requests']);
  }
}
