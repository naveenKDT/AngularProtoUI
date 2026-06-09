import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  serialNumber: string;
}

@Component({
  selector: 'knodtec-raise-ticket',
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
  templateUrl: './raise-ticket.component.html',
  styleUrls: ['./raise-ticket.component.scss']
})
export class RaiseTicketComponent {
  private router: Router;
  private route: ActivatedRoute;

  // ─── Breadcrumb (driven by design system shared component) ───
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home',              route: '/dashboard' },
    { label: 'Asset Management',  route: '/assets' },
    { label: 'Tickets',           route: '/tickets' },
    { label: 'Raise Support Ticket' }
  ];

  // ─── Page Header Icon (wrench / support) ────────────────────
  readonly pageIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  `;

  // ─── Form State (Signals) ───────────────────────────────────
  readonly assetSearchQuery = signal('');
  readonly selectedAsset    = signal<Asset | null>(null);
  readonly category         = signal('');
  readonly subcategory      = signal('');
  readonly priority         = signal('medium');
  readonly title            = signal('');
  readonly description      = signal('');
  readonly issueDate        = signal('');
  readonly urgency          = signal('');
  readonly attachments      = signal<Array<{ name: string; size: string }>>([]);
  readonly contactMethod    = signal('email');
  readonly contactDetail    = signal('');

  // ─── Static Reference Data ──────────────────────────────────
  readonly priorityOptions = [
    { value: 'critical', label: 'Critical',  description: 'System down, work blocked' },
    { value: 'high',     label: 'High',      description: 'Major issue, limited functionality' },
    { value: 'medium',   label: 'Medium',    description: 'Moderate issue, workaround available' },
    { value: 'low',      label: 'Low',       description: 'Minor issue, no significant impact' }
  ];

  readonly assets = signal<Asset[]>([
    { id: 'AST-1045', tag: 'AST-1045', name: 'MacBook Pro 14" M3',        category: 'Laptop',    serialNumber: 'C02X1234ABCD' },
    { id: 'AST-1056', tag: 'AST-1056', name: 'Dell UltraSharp U2723QE',   category: 'Monitor',   serialNumber: 'DELL-U27-1234' },
    { id: 'AST-1067', tag: 'AST-1067', name: 'iPhone 15 Pro',             category: 'Phone',     serialNumber: 'IP15P-123456' },
    { id: 'AST-1078', tag: 'AST-1078', name: 'Magic Keyboard',            category: 'Accessory', serialNumber: 'MK-1234' },
    { id: 'AST-1089', tag: 'AST-1089', name: 'AirPods Pro',               category: 'Accessory', serialNumber: 'APP-1234' }
  ]);

  // ─── Computed ───────────────────────────────────────────────
  readonly filteredAssets = computed(() => {
    const query = this.assetSearchQuery().toLowerCase().trim();
    if (!query) return this.assets();
    return this.assets().filter(a =>
      a.tag.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    );
  });

  constructor(router: Router, route: ActivatedRoute) {
    this.router = router;
    this.route  = route;

    const assetId = this.route.snapshot.queryParams['assetId'];
    if (assetId) {
      const asset = this.assets().find(a => a.id === assetId);
      if (asset) this.selectedAsset.set(asset);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" width="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      'Accessory': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Printer':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      'Desktop':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };
    return icons[category] || icons['Laptop'];
  }

  selectAsset(asset: Asset): void {
    this.selectedAsset.set(asset);
    this.assetSearchQuery.set('');
  }

  clearAsset(): void { this.selectedAsset.set(null); }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files).map(file => ({
      name: file.name,
      size: this.formatFileSize(file.size)
    }));
    this.attachments.update(current => [...current, ...files]);
    input.value = ''; // allow re-uploading the same file
  }

  removeAttachment(name: string): void {
    this.attachments.update(current => current.filter(f => f.name !== name));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)            return bytes + ' B';
    if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getSlaTime(): string {
    const map: Record<string, string> = {
      critical: '2 hours',
      high:     '4 hours',
      medium:   '1 business day',
      low:      '2 business days'
    };
    return map[this.priority()] || '1 business day';
  }

  // ─── Navigation ─────────────────────────────────────────────
  goBack(): void { this.router.navigate(['/tickets']); }

  // ─── Submit ─────────────────────────────────────────────────
  submitTicket(): void {
    if (!this.selectedAsset() || !this.category() || !this.title().trim() || !this.description().trim()) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Submitting ticket:', {
      asset:         this.selectedAsset(),
      category:      this.category(),
      subcategory:   this.subcategory(),
      priority:      this.priority(),
      title:         this.title(),
      description:   this.description(),
      issueDate:     this.issueDate(),
      urgency:       this.urgency(),
      attachments:   this.attachments(),
      contactMethod: this.contactMethod(),
      contactDetail: this.contactDetail()
    });
    this.router.navigate(['/tickets']);
  }
}
