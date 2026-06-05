import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent
} from '../../shared/components/ui/ui-components';

@Component({
  selector: 'knodtec-raise-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent
  ],
  template: `
    <div class="raise-request-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-title">
            <h1>Raise Asset Request</h1>
            <p>Request a new asset, replacement, or additional equipment</p>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="banner-content">
          <strong>What is a Request?</strong>
          <span>Use this form to <em>request new assets, replacements, upgrades, accessories, or software</em>. For reporting issues with existing assets, use the <a href="/raise-ticket">Raise Ticket</a> form instead.</span>
        </div>
      </div>

      <!-- Form -->
      <div class="form-container">
        <knod-card title="Request Information">
          <div class="form-grid">
            <!-- Request Type -->
            <div class="form-group">
              <label class="form-label">
                Request Type <span class="required">*</span>
              </label>
              <div class="request-type-options">
                @for (type of requestTypes; track type.value) {
                  <label class="type-option" [class.selected]="requestType() === type.value">
                    <input 
                      type="radio" 
                      name="requestType" 
                      [value]="type.value"
                      [ngModel]="requestType()"
                      (ngModelChange)="requestType.set($event)">
                    <div class="type-icon" [innerHTML]="type.icon"></div>
                    <div class="type-content">
                      <span class="type-label">{{ type.label }}</span>
                      <span class="type-desc">{{ type.description }}</span>
                    </div>
                  </label>
                }
              </div>
            </div>

            <!-- Asset Category -->
            <div class="form-group">
              <label class="form-label">
                Asset Category <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="category()" (ngModelChange)="category.set($event)">
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Monitor">Monitor</option>
                <option value="Phone">Phone/Tablet</option>
                <option value="Accessory">Accessories</option>
                <option value="Software">Software License</option>
                <option value="Networking">Networking Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Specific Asset (optional) -->
            <div class="form-group">
              <label class="form-label">
                Specific Asset <span class="optional">(optional)</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., MacBook Pro 14-inch M3"
                [ngModel]="specificAsset()"
                (ngModelChange)="specificAsset.set($event)">
            </div>

            <!-- Quantity -->
            <div class="form-group">
              <label class="form-label">
                Quantity <span class="required">*</span>
              </label>
              <input 
                type="number" 
                class="form-input"
                min="1"
                value="1"
                [ngModel]="quantity()"
                (ngModelChange)="quantity.set($event)">
            </div>

            <!-- Priority/Justification -->
            <div class="form-group">
              <label class="form-label">
                Priority Level <span class="required">*</span>
              </label>
              <div class="priority-options">
                @for (option of priorityOptions; track option.value) {
                  <label class="priority-option" [class.selected]="priority() === option.value">
                    <input 
                      type="radio" 
                      name="priority" 
                      [value]="option.value"
                      [ngModel]="priority()"
                      (ngModelChange)="priority.set($event)">
                    <div class="priority-content">
                      <span class="priority-label">{{ option.label }}</span>
                      <span class="priority-desc">{{ option.description }}</span>
                    </div>
                  </label>
                }
              </div>
            </div>

            <!-- Justification -->
            <div class="form-group full-width">
              <label class="form-label">
                Business Justification <span class="required">*</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="4"
                placeholder="Explain why this asset is needed. Include details about the work it will be used for, team size, specific requirements, etc."
                [ngModel]="justification()"
                (ngModelChange)="justification.set($event)">
              </textarea>
            </div>

            <!-- Replacement Reason -->
            @if (requestType() === 'replacement') {
              <div class="form-group full-width">
                <label class="form-label">
                  Reason for Replacement <span class="required">*</span>
                </label>
                <select class="form-select" [ngModel]="replacementReason()" (ngModelChange)="replacementReason.set($event)">
                  <option value="">Select reason</option>
                  <option value="damaged">Asset is damaged</option>
                  <option value="lost">Asset is lost/stolen</option>
                  <option value="outdated">Asset is outdated/slow</option>
                  <option value="upgrade">Required upgrade for new role</option>
                  <option value="upgrade_team">Team expansion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label class="form-label">
                  Current Asset Details <span class="optional">(if applicable)</span>
                </label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="Asset tag or name of asset being replaced"
                  [ngModel]="currentAsset()"
                  (ngModelChange)="currentAsset.set($event)">
              </div>
            }

            <!-- Preferred Specifications -->
            <div class="form-group full-width">
              <label class="form-label">
                Preferred Specifications <span class="optional">(optional)</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="3"
                placeholder="List any specific requirements: RAM, storage, processor, OS version, screen size, etc."
                [ngModel]="specifications()"
                (ngModelChange)="specifications.set($event)">
              </textarea>
            </div>

            <!-- Budget -->
            <div class="form-group">
              <label class="form-label">
                Estimated Budget <span class="optional">(optional)</span>
              </label>
              <div class="budget-input">
                <span class="currency">₹</span>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="0.00"
                  [ngModel]="budget()"
                  (ngModelChange)="budget.set($event)">
              </div>
            </div>

            <!-- Needed By Date -->
            <div class="form-group">
              <label class="form-label">
                Needed By Date <span class="optional">(optional)</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="neededByDate()"
                (ngModelChange)="neededByDate.set($event)">
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="form-label">
                Delivery Location <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="location()" (ngModelChange)="location.set($event)">
                <option value="">Select location</option>
                <option value="Bangalore HQ">Knodtec HQ - Bangalore</option>
                <option value="Mumbai">Mumbai Office</option>
                <option value="Delhi">Delhi Office</option>
                <option value="Chennai">Chennai Office</option>
                <option value="Pune">Pune Office</option>
                <option value="Remote">Remote Employee</option>
              </select>
            </div>

            <!-- Additional Notes -->
            <div class="form-group full-width">
              <label class="form-label">
                Additional Notes <span class="optional">(optional)</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="3"
                placeholder="Any other information that would help process this request..."
                [ngModel]="additionalNotes()"
                (ngModelChange)="additionalNotes.set($event)">
              </textarea>
            </div>

            <!-- Attachments -->
            <div class="form-group full-width">
              <label class="form-label">Attachments</label>
              <div class="file-upload">
                <input type="file" id="file-upload" multiple (change)="handleFileUpload($event)">
                <label for="file-upload" class="upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Drop files here or click to upload</span>
                  <span class="upload-hint">Approval documents, screenshots, or other relevant files</span>
                </label>
              </div>
              @if (attachments().length > 0) {
                <div class="attachment-list">
                  @for (file of attachments(); track file.name) {
                    <div class="attachment-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ file.size }}</span>
                      <button class="remove-btn" (click)="removeAttachment(file.name)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Manager Approval Info -->
            <div class="form-group full-width">
              <div class="approval-info">
                <div class="info-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="info-content">
                  <strong>Approval Workflow</strong>
                  <p>This request will be sent to your manager for approval. Once approved, it will be forwarded to IT Asset Management for processing.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <div class="summary-info">
              <span>Request Summary:</span>
              <span>{{ getRequestSummary() }}</span>
            </div>
            <div class="form-actions">
              <knod-button variant="outline" (click)="goBack()">Cancel</knod-button>
              <knod-button variant="primary" (click)="submitRequest()">Submit Request</knod-button>
            </div>
          </div>
        </knod-card>
      </div>
    </div>
  `,
  styles: [`
    .raise-request-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid var(--color-slate-200);
      color: var(--color-slate-600);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      background: var(--color-slate-50);
      border-color: var(--color-slate-300);
    }

    .header-title h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0;
    }

    .header-title p {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 4px 0 0 0;
    }

    .info-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--color-indigo-50);
      border: 1px solid var(--color-indigo-100);
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--color-indigo-100);
      color: var(--color-indigo-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: var(--color-slate-700);
    }

    .banner-content strong {
      color: var(--color-slate-900);
    }

    .banner-content em {
      color: var(--color-indigo-600);
      font-style: normal;
      font-weight: 500;
    }

    .banner-content a {
      color: var(--color-primary-600);
      text-decoration: none;
      font-weight: 500;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .required {
      color: var(--color-red-500);
    }

    .optional {
      color: var(--color-slate-400);
      font-weight: 400;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
      transition: all var(--transition-fast);
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Request Type Options */
    .request-type-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .type-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .type-option:hover {
      border-color: var(--color-slate-300);
    }

    .type-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .type-option input {
      margin-top: 4px;
    }

    .type-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-slate-100);
      color: var(--color-slate-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .type-option.selected .type-icon {
      background: var(--color-primary-100);
      color: var(--color-primary-600);
    }

    .type-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .type-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .type-desc {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Priority Options */
    .priority-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .priority-option {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .priority-option:hover {
      border-color: var(--color-slate-300);
    }

    .priority-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .priority-option input {
      margin-top: 2px;
    }

    .priority-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .priority-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .priority-desc {
      font-size: 10px;
      color: var(--color-slate-500);
    }

    /* Budget Input */
    .budget-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .currency {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-600);
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-radius: 8px 0 0 8px;
    }

    .budget-input .form-input {
      border-radius: 0 8px 8px 0;
    }

    /* File Upload */
    .file-upload {
      position: relative;
    }

    .file-upload input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
      border: 2px dashed var(--color-slate-200);
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .upload-label:hover {
      border-color: var(--color-primary-400);
      background: var(--color-primary-50);
    }

    .upload-label svg {
      color: var(--color-slate-400);
    }

    .upload-label span {
      font-size: 13px;
      color: var(--color-slate-600);
    }

    .upload-hint {
      font-size: 11px !important;
      color: var(--color-slate-400) !important;
    }

    .attachment-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--color-slate-50);
      border-radius: 6px;
      font-size: 12px;
    }

    .attachment-item svg {
      color: var(--color-slate-400);
    }

    .file-name {
      flex: 1;
      color: var(--color-slate-700);
    }

    .file-size {
      color: var(--color-slate-400);
    }

    .remove-btn {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--color-slate-400);
      cursor: pointer;
    }

    .remove-btn:hover {
      background: var(--color-slate-200);
      color: var(--color-slate-600);
    }

    /* Approval Info */
    .approval-info {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--color-success-50);
      border: 1px solid var(--color-success-100);
      border-radius: 8px;
    }

    .info-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-success-100);
      color: var(--color-success-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-content strong {
      font-size: 13px;
      color: var(--color-slate-900);
    }

    .info-content p {
      font-size: 12px;
      color: var(--color-slate-600);
      margin: 0;
    }

    /* Form Footer */
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid var(--color-slate-100);
      margin-top: 24px;
    }

    .summary-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .summary-info span:last-child {
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .form-actions {
      display: flex;
      gap: 12px;
    }
  `]
})
export class RaiseRequestComponent {
  private router: Router;

  readonly requestType = signal('');
  readonly category = signal('');
  readonly specificAsset = signal('');
  readonly quantity = signal(1);
  readonly priority = signal('medium');
  readonly justification = signal('');
  readonly replacementReason = signal('');
  readonly currentAsset = signal('');
  readonly specifications = signal('');
  readonly budget = signal('');
  readonly neededByDate = signal('');
  readonly location = signal('');
  readonly additionalNotes = signal('');
  readonly attachments = signal<Array<{ name: string; size: string }>>([]);

  readonly requestTypes = [
    { value: 'new', label: 'New Asset', description: 'Request a new asset for new hire or new requirement', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
    { value: 'replacement', label: 'Replacement', description: 'Replace damaged, lost, or outdated asset', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' },
    { value: 'upgrade', label: 'Upgrade', description: 'Upgrade existing asset to better specifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>' },
    { value: 'accessory', label: 'Accessory', description: 'Request additional accessories or peripherals', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' }
  ];

  readonly priorityOptions = [
    { value: 'high', label: 'High Priority', description: 'Urgent, blocking work' },
    { value: 'medium', label: 'Medium Priority', description: 'Needed within 1-2 weeks' },
    { value: 'low', label: 'Low Priority', description: 'Can wait, no immediate need' }
  ];

  constructor(router: Router) {
    this.router = router;
  }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).map(file => ({
        name: file.name,
        size: this.formatFileSize(file.size)
      }));
      this.attachments.update(current => [...current, ...files]);
    }
  }

  removeAttachment(name: string): void {
    this.attachments.update(current => current.filter(f => f.name !== name));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getRequestSummary(): string {
    const parts = [];
    if (this.requestType()) parts.push(this.requestType());
    if (this.category()) parts.push(this.category());
    if (this.quantity() > 1) parts.push(`(Qty: ${this.quantity()})`);
    return parts.join(' ') || 'No items selected';
  }

  goBack(): void {
    this.router.navigate(['/requests']);
  }

  submitRequest(): void {
    // Validate form
    if (!this.requestType() || !this.category() || !this.justification() || !this.location()) {
      alert('Please fill in all required fields');
      return;
    }
    // Submit request
    console.log('Submitting request:', {
      requestType: this.requestType(),
      category: this.category(),
      specificAsset: this.specificAsset(),
      quantity: this.quantity(),
      priority: this.priority(),
      justification: this.justification(),
      replacementReason: this.replacementReason(),
      currentAsset: this.currentAsset(),
      specifications: this.specifications(),
      budget: this.budget(),
      neededByDate: this.neededByDate(),
      location: this.location(),
      additionalNotes: this.additionalNotes(),
      attachments: this.attachments()
    });
    this.router.navigate(['/requests']);
  }
}