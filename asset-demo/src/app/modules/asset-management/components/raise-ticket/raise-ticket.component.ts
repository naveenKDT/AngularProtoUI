import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent
} from '../../../shared/components/ui-components';

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
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent
  ],
  template: `
    <div class="raise-ticket-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-title">
            <h1>Raise Support Ticket</h1>
            <p>Report an issue with your assigned asset</p>
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
          <strong>What is a Support Ticket?</strong>
          <span>Use this form to report issues with an <em>already assigned asset</em> — like hardware problems, malfunctions, or damage. For requesting new assets, use the <a href="/raise-request">Raise Request</a> form instead.</span>
        </div>
      </div>

      <!-- Form -->
      <div class="form-container">
        <!-- Ticket Workflow Info -->
        <div class="workflow-banner">
          <div class="workflow-item">
            <span class="workflow-label">Ticket Type</span>
            <knod-badge color="blue">Support Ticket</knod-badge>
          </div>
          <div class="workflow-item">
            <span class="workflow-label">Initial Status</span>
            <knod-badge color="amber">Open</knod-badge>
          </div>
          <div class="workflow-item">
            <span class="workflow-label">SLA Response</span>
            <span class="sla-value">{{ getSlaTime() }}</span>
          </div>
          <div class="workflow-item">
            <span class="workflow-label">Assigned To</span>
            <span class="assigned-value">IT Support Team</span>
          </div>
        </div>

        <knod-card title="Ticket Information">
          <div class="form-grid">
            <!-- Asset Selection -->
            <div class="form-group full-width">
              <label class="form-label">
                Affected Asset <span class="required">*</span>
              </label>
              @if (selectedAsset()) {
                <div class="selected-asset">
                  <div class="asset-card">
                    <div class="asset-icon" [ngClass]="'cat-' + selectedAsset()!.category.toLowerCase()">
                      <span [innerHTML]="getCategoryIcon(selectedAsset()!.category)"></span>
                    </div>
                    <div class="asset-info">
                      <span class="asset-name">{{ selectedAsset()!.name }}</span>
                      <span class="asset-tag">{{ selectedAsset()!.tag }}</span>
                      <span class="asset-serial">S/N: {{ selectedAsset()!.serialNumber }}</span>
                    </div>
                    <button class="change-btn" (click)="clearAsset()">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Change
                    </button>
                  </div>
                </div>
              } @else {
                <div class="asset-selector">
                  <div class="search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search by asset tag or name..."
                      [ngModel]="assetSearchQuery()"
                      (ngModelChange)="assetSearchQuery.set($event)">
                  </div>
                  <div class="asset-dropdown">
                    @for (asset of filteredAssets(); track asset.id) {
                      <div class="asset-option" (click)="selectAsset(asset)">
                        <div class="option-icon" [ngClass]="'cat-' + asset.category.toLowerCase()">
                          <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                        </div>
                        <div class="option-info">
                          <span class="option-name">{{ asset.name }}</span>
                          <span class="option-tag">{{ asset.tag }}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">
                Issue Category <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="category()" (ngModelChange)="category.set($event)">
                <option value="">Select category</option>
                <option value="Hardware">Hardware Issue</option>
                <option value="Software">Software Issue</option>
                <option value="Performance">Performance Issue</option>
                <option value="Accessories">Accessories Issue</option>
                <option value="Network">Network/Connectivity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Subcategory -->
            <div class="form-group">
              <label class="form-label">
                Issue Type <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="subcategory()" (ngModelChange)="subcategory.set($event)">
                <option value="">Select type</option>
                @switch (category()) {
                  @case ('Hardware') {
                    <option value="Display">Display/Screen Issue</option>
                    <option value="Keyboard">Keyboard Issue</option>
                    <option value="Mouse">Mouse/Touchpad Issue</option>
                    <option value="Battery">Battery/Power Issue</option>
                    <option value="Port">Port/Connectivity Issue</option>
                    <option value="Speaker">Speaker/Microphone Issue</option>
                    <option value="Camera">Camera Issue</option>
                    <option value="Physical Damage">Physical Damage</option>
                    <option value="Other">Other Hardware Issue</option>
                  }
                  @case ('Software') {
                    <option value="Installation">Installation Request</option>
                    <option value="Crashing">Application Crashing</option>
                    <option value="Update">Update/Upgrade Request</option>
                    <option value="License">License Issue</option>
                    <option value="Other">Other Software Issue</option>
                  }
                  @case ('Performance') {
                    <option value="Slow">Device Running Slow</option>
                    <option value="Freezing">Device Freezing</option>
                    <option value="Overheating">Overheating Issue</option>
                    <option value="Storage">Storage Issue</option>
                    <option value="Memory">Memory Issue</option>
                  }
                  @case ('Accessories') {
                    <option value="Replacement">Accessory Replacement</option>
                    <option value="Not Working">Accessory Not Working</option>
                    <option value="Missing">Accessory Missing</option>
                    <option value="Other">Other</option>
                  }
                  @case ('Network') {
                    <option value="WiFi">WiFi Connection</option>
                    <option value="Bluetooth">Bluetooth Issue</option>
                    <option value="VPN">VPN/Remote Access</option>
                    <option value="Other">Other</option>
                  }
                }
              </select>
            </div>

            <!-- Priority -->
            <div class="form-group">
              <label class="form-label">Priority</label>
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

            <!-- Title -->
            <div class="form-group full-width">
              <label class="form-label">
                Issue Title <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Brief summary of the issue"
                [ngModel]="title()"
                (ngModelChange)="title.set($event)">
            </div>

            <!-- Description -->
            <div class="form-group full-width">
              <label class="form-label">
                Description <span class="required">*</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="5"
                placeholder="Describe the issue in detail. Include when it started, what happens, and any error messages..."
                [ngModel]="description()"
                (ngModelChange)="description.set($event)">
              </textarea>
            </div>

            <!-- Additional Info -->
            <div class="form-group">
              <label class="form-label">When did the issue start?</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="issueDate()"
                (ngModelChange)="issueDate.set($event)">
            </div>

            <div class="form-group">
              <label class="form-label">Expected Resolution</label>
              <select class="form-select" [ngModel]="urgency()" (ngModelChange)="urgency.set($event)">
                <option value="">Select urgency</option>
                <option value="asap">As Soon As Possible</option>
                <option value="flexible">Flexible, no urgent deadline</option>
                <option value="scheduled">Schedule for specific date</option>
              </select>
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
                  <span class="upload-hint">Screenshots, error logs, or other relevant files</span>
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

            <!-- Contact Preference -->
            <div class="form-group full-width">
              <label class="form-label">Preferred Contact Method</label>
              <div class="contact-options">
                <label class="contact-option" [class.selected]="contactMethod() === 'email'">
                  <input type="radio" name="contact" value="email" [ngModel]="contactMethod()" (ngModelChange)="contactMethod.set($event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </label>
                <label class="contact-option" [class.selected]="contactMethod() === 'phone'">
                  <input type="radio" name="contact" value="phone" [ngModel]="contactMethod()" (ngModelChange)="contactMethod.set($event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Phone
                </label>
                <label class="contact-option" [class.selected]="contactMethod() === 'teams'">
                  <input type="radio" name="contact" value="teams" [ngModel]="contactMethod()" (ngModelChange)="contactMethod.set($event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Teams Chat
                </label>
              </div>
            </div>

            <!-- Contact Details -->
            @if (contactMethod() !== 'email') {
              <div class="form-group">
                <label class="form-label">
                  {{ contactMethod() === 'phone' ? 'Phone Number' : 'Teams ID' }}
                </label>
                <input 
                  type="text" 
                  class="form-input"
                  [placeholder]="contactMethod() === 'phone' ? '+91 98765 43210' : 'your.name@company.com'"
                  [ngModel]="contactDetail()"
                  (ngModelChange)="contactDetail.set($event)">
              </div>
            }
          </div>

          <div class="form-footer">
            <div class="sla-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Based on priority, SLA response time: <strong>{{ getSlaTime() }}</strong></span>
            </div>
            <div class="form-actions">
              <knod-button variant="outline" (click)="goBack()">Cancel</knod-button>
              <knod-button variant="primary" (click)="submitTicket()">Submit Ticket</knod-button>
            </div>
          </div>
        </knod-card>
      </div>
    </div>
  `,
  styles: [`
    .raise-ticket-page {
      max-width: 900px;
      margin: 0 auto;
    }

    /* Workflow Banner */
    .workflow-banner {
      display: flex;
      gap: 24px;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;
    }

    .workflow-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .workflow-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sla-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-700);
    }

    .assigned-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-600);
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

    /* Asset Selection */
    .selected-asset {
      margin-bottom: 8px;
    }

    .asset-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--color-slate-50);
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
    }

    .asset-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .asset-icon.cat-laptop { background: var(--color-primary-50); color: var(--color-primary-600); }
    .asset-icon.cat-monitor { background: var(--color-indigo-50); color: var(--color-indigo-600); }
    .asset-icon.cat-phone { background: var(--color-violet-50); color: var(--color-violet-600); }
    .asset-icon.cat-accessory { background: var(--color-cyan-50); color: var(--color-cyan-600); }
    .asset-icon.cat-printer { background: var(--color-success-50); color: var(--color-success-600); }
    .asset-icon.cat-desktop { background: var(--color-amber-50); color: var(--color-amber-600); }

    .asset-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .asset-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .asset-tag {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .asset-serial {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .change-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      background: none;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
    }

    .change-btn:hover {
      background: var(--color-slate-100);
    }

    .asset-selector {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      background: white;
    }

    .search-box svg {
      color: var(--color-slate-400);
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 13px;
    }

    .asset-dropdown {
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      background: white;
      max-height: 200px;
      overflow-y: auto;
    }

    .asset-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .asset-option:hover {
      background: var(--color-slate-50);
    }

    .option-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .option-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .option-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .option-tag {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Priority Options */
    .priority-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .priority-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
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
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .priority-desc {
      font-size: 11px;
      color: var(--color-slate-500);
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

    /* Contact Options */
    .contact-options {
      display: flex;
      gap: 12px;
    }

    .contact-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .contact-option:hover {
      border-color: var(--color-slate-300);
    }

    .contact-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }

    .contact-option input {
      display: none;
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

    .sla-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .sla-info strong {
      color: var(--color-slate-700);
    }

    .form-actions {
      display: flex;
      gap: 12px;
    }
  `]
})
export class RaiseTicketComponent {
  private router: Router;
  private route: ActivatedRoute;

  readonly assetSearchQuery = signal('');
  readonly selectedAsset = signal<Asset | null>(null);
  readonly category = signal('');
  readonly subcategory = signal('');
  readonly priority = signal('medium');
  readonly title = signal('');
  readonly description = signal('');
  readonly issueDate = signal('');
  readonly urgency = signal('');
  readonly attachments = signal<Array<{ name: string; size: string }>>([]);
  readonly contactMethod = signal('email');
  readonly contactDetail = signal('');

  readonly priorityOptions = [
    { value: 'critical', label: 'Critical', description: 'System down, work blocked' },
    { value: 'high', label: 'High', description: 'Major issue, limited functionality' },
    { value: 'medium', label: 'Medium', description: 'Moderate issue, workaround available' },
    { value: 'low', label: 'Low', description: 'Minor issue, no significant impact' }
  ];

  readonly assets = signal<Asset[]>([
    { id: 'AST-1045', tag: 'AST-1045', name: 'MacBook Pro 14" M3', category: 'Laptop', serialNumber: 'C02X1234ABCD' },
    { id: 'AST-1056', tag: 'AST-1056', name: 'Dell UltraSharp U2723QE', category: 'Monitor', serialNumber: 'DELL-U27-1234' },
    { id: 'AST-1067', tag: 'AST-1067', name: 'iPhone 15 Pro', category: 'Phone', serialNumber: 'IP15P-123456' },
    { id: 'AST-1078', tag: 'AST-1078', name: 'Magic Keyboard', category: 'Accessory', serialNumber: 'MK-1234' },
    { id: 'AST-1089', tag: 'AST-1089', name: 'AirPods Pro', category: 'Accessory', serialNumber: 'APP-1234' }
  ]);

  readonly filteredAssets = computed(() => {
    const query = this.assetSearchQuery().toLowerCase();
    if (!query) return this.assets();
    return this.assets().filter(a => 
      a.tag.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    );
  });

  constructor(router: Router, route: ActivatedRoute) {
    this.router = router;
    this.route = route;
    
    // Pre-fill asset from query params
    const assetId = this.route.snapshot.queryParams['assetId'];
    if (assetId) {
      const asset = this.assets().find(a => a.id === assetId);
      if (asset) {
        this.selectedAsset.set(asset);
      }
    }
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      'Accessory': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Printer': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      'Desktop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };
    return icons[category] || icons['Laptop'];
  }

  selectAsset(asset: Asset): void {
    this.selectedAsset.set(asset);
    this.assetSearchQuery.set('');
  }

  clearAsset(): void {
    this.selectedAsset.set(null);
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

  getSlaTime(): string {
    const priorities: Record<string, string> = {
      'critical': '2 hours',
      'high': '4 hours',
      'medium': '1 business day',
      'low': '2 business days'
    };
    return priorities[this.priority()] || '1 business day';
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  submitTicket(): void {
    // Validate form
    if (!this.selectedAsset() || !this.category() || !this.title() || !this.description()) {
      alert('Please fill in all required fields');
      return;
    }
    // Submit ticket
    console.log('Submitting ticket:', {
      asset: this.selectedAsset(),
      category: this.category(),
      subcategory: this.subcategory(),
      priority: this.priority(),
      title: this.title(),
      description: this.description(),
      issueDate: this.issueDate(),
      urgency: this.urgency(),
      attachments: this.attachments(),
      contactMethod: this.contactMethod(),
      contactDetail: this.contactDetail()
    });
    this.router.navigate(['/tickets']);
  }
}