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
        <div class="breadcrumb-row">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Tickets
          </button>
        </div>

        <div class="header-content">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
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

        <!-- Workflow Banner -->
        <div class="workflow-banner">
          <div class="workflow-item">
            <span class="workflow-label">Ticket Type</span>
            <knod-badge color="blue">Support Ticket</knod-badge>
          </div>
          <div class="workflow-divider"></div>
          <div class="workflow-item">
            <span class="workflow-label">Initial Status</span>
            <knod-badge color="amber">Open</knod-badge>
          </div>
          <div class="workflow-divider"></div>
          <div class="workflow-item">
            <span class="workflow-label">SLA Response</span>
            <span class="sla-value">{{ getSlaTime() }}</span>
          </div>
          <div class="workflow-divider"></div>
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                        <svg class="option-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
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
            <div class="form-group full-width">
              <label class="form-label">Priority</label>
              <div class="priority-options">
                @for (option of priorityOptions; track option.value) {
                  <label class="priority-option" [class.selected]="priority() === option.value"
                    [ngClass]="'pri-' + option.value">
                    <input
                      type="radio"
                      name="priority"
                      [value]="option.value"
                      [ngModel]="priority()"
                      (ngModelChange)="priority.set($event)">
                    <div class="priority-dot"></div>
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

            <!-- Issue Date + Urgency -->
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
                  <div class="upload-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <span class="upload-text">Drop files here or click to upload</span>
                  <span class="upload-hint">Screenshots, error logs, or other relevant files</span>
                </label>
              </div>
              @if (attachments().length > 0) {
                <div class="attachment-list">
                  @for (file of attachments(); track file.name) {
                    <div class="attachment-item">
                      <div class="attach-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
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

            <!-- Contact Method -->
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

            <!-- Contact Detail (conditional) -->
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

          <!-- Form Footer -->
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
    /* ─── Design Tokens ─────────────────────────────────────────── */
    :host {
      --bg-page:           #F3F6FB;
      --bg-card:           #FFFFFF;
      --border-color:      #E5EAF3;
      --text-primary:      #0F172A;
      --text-secondary:    #64748B;
      --primary:           #3B82F6;
      --primary-hover:     #2563EB;
      --primary-light:     #EFF6FF;
      --success:           #22C55E;
      --success-light:     #DCFCE7;
      --warning:           #F59E0B;
      --warning-light:     #FEF3C7;
      --danger:            #EF4444;
      --danger-light:      #FEE2E2;
      --purple:            #8B5CF6;
      --purple-light:      #F3E8FF;
      --info:              #06B6D4;
      --info-light:        #CFFAFE;
      --radius-sm:         14px;
      --radius-md:         16px;
      --radius-lg:         24px;
      --radius-xl:         28px;
      --shadow-card:       0 8px 30px rgba(15,23,42,0.06);
      --shadow-card-hover: 0 15px 40px rgba(15,23,42,0.12);
      --shadow-dropdown:   0 20px 50px rgba(15,23,42,0.15);
      --transition:        200ms ease;
    }

    /* ─── Page Shell ────────────────────────────────────────────── */
    .raise-ticket-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background: var(--bg-page);
      min-height: 100vh;
    }

    /* ─── Breadcrumb / Back Button ──────────────────────────────── */
    .breadcrumb-row { margin-bottom: 16px; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      cursor: pointer;
      transition: all var(--transition);
    }

    .back-btn:hover {
      background: var(--bg-page);
      border-color: var(--primary);
      color: var(--primary);
    }

    /* ─── Page Header ───────────────────────────────────────────── */
    .page-header { display: flex; flex-direction: column; }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    /* Icon Container: 72×72, radius 20px */
    .header-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Page Title: 36px / 700 */
    .header-title h1 {
      font-size: 36px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    /* Description: 16px */
    .header-title p {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 8px 0 0 0;
    }

    /* ─── Info Banner ───────────────────────────────────────────── */
    .info-banner {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 24px;
      background: var(--primary-light);
      border: 1px solid #BFDBFE;
      border-radius: var(--radius-lg);
    }

    .banner-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: #DBEAFE;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .banner-content strong {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .banner-content em {
      color: var(--primary);
      font-style: normal;
      font-weight: 500;
    }

    .banner-content a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    .banner-content a:hover { text-decoration: underline; }

    /* ─── Form Container ────────────────────────────────────────── */
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ─── Workflow Banner ───────────────────────────────────────── */
    .workflow-banner {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 20px 28px;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .workflow-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      padding: 0 20px;
    }

    .workflow-item:first-child { padding-left: 0; }
    .workflow-item:last-child  { padding-right: 0; }

    /* Caption: 12px / 500 uppercase */
    .workflow-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .workflow-divider {
      width: 1px;
      height: 40px;
      background: var(--border-color);
      flex-shrink: 0;
    }

    .sla-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .assigned-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* ─── Form Grid ─────────────────────────────────────────────── */
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

    .form-group.full-width { grid-column: span 2; }

    /* Label: 14px / 500 */
    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .required { color: var(--danger); }

    /* Input / Select: height 52px, radius-sm, border 2px */
    .form-input,
    .form-select {
      height: 52px;
      width: 100%;
      padding: 0 20px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 14px;
      color: var(--text-primary);
      background: var(--bg-card);
      transition: all var(--transition);
      appearance: none;
      -webkit-appearance: none;
      box-sizing: border-box;
    }

    .form-input::placeholder { color: var(--text-secondary); }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
    }

    /* Textarea: radius-sm, padding 16px 20px */
    .form-textarea {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 14px;
      color: var(--text-primary);
      background: var(--bg-card);
      resize: vertical;
      min-height: 120px;
      transition: all var(--transition);
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-textarea::placeholder { color: var(--text-secondary); }

    .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
    }

    /* ─── Asset Selection ───────────────────────────────────────── */
    .selected-asset { margin-bottom: 4px; }

    .asset-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--bg-page);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      transition: all var(--transition);
    }

    .asset-card:hover { border-color: #CBD5E1; }

    /* Icon: 48×48, radius-sm */
    .asset-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .asset-icon :deep(svg) { width: 22px; height: 22px; }

    .asset-icon.cat-laptop    { background: var(--primary-light); color: var(--primary); }
    .asset-icon.cat-monitor   { background: var(--purple-light);  color: var(--purple); }
    .asset-icon.cat-phone     { background: var(--success-light); color: var(--success); }
    .asset-icon.cat-accessory { background: var(--warning-light); color: var(--warning); }
    .asset-icon.cat-printer   { background: var(--info-light);    color: var(--info); }
    .asset-icon.cat-desktop   { background: var(--danger-light);  color: var(--danger); }

    .asset-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .asset-name   { font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .asset-tag    { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
    .asset-serial { font-size: 12px; color: var(--text-secondary); }

    .change-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition);
    }

    .change-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    /* Asset Search */
    .asset-selector { display: flex; flex-direction: column; gap: 8px; }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 52px;
      padding: 0 20px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      background: var(--bg-card);
      transition: all var(--transition);
    }

    .search-box:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
    }

    .search-box svg { color: var(--text-secondary); flex-shrink: 0; }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: var(--text-primary);
      background: transparent;
    }

    .search-box input::placeholder { color: var(--text-secondary); }

    /* Dropdown: shadow-dropdown, radius-lg */
    .asset-dropdown {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      box-shadow: var(--shadow-dropdown);
      max-height: 240px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .asset-option {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 20px;
      cursor: pointer;
      transition: all var(--transition);
    }

    .asset-option:hover { background: var(--bg-page); }

    .asset-option:not(:last-child) { border-bottom: 1px solid var(--border-color); }

    .option-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .option-icon :deep(svg) { width: 18px; height: 18px; }
    .option-icon.cat-laptop    { background: var(--primary-light); color: var(--primary); }
    .option-icon.cat-monitor   { background: var(--purple-light);  color: var(--purple); }
    .option-icon.cat-phone     { background: var(--success-light); color: var(--success); }
    .option-icon.cat-accessory { background: var(--warning-light); color: var(--warning); }
    .option-icon.cat-printer   { background: var(--info-light);    color: var(--info); }
    .option-icon.cat-desktop   { background: var(--danger-light);  color: var(--danger); }

    .option-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .option-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .option-tag  { font-size: 12px; color: var(--text-secondary); }
    .option-arrow { color: var(--border-color); flex-shrink: 0; }

    /* ─── Priority Options ──────────────────────────────────────── */
    .priority-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .priority-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition);
      position: relative;
    }

    .priority-option:hover { border-color: #CBD5E1; transform: translateY(-2px); }

    .priority-option input { display: none; }

    /* Priority dot indicator */
    .priority-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2px solid var(--border-color);
      transition: all var(--transition);
    }

    .priority-option.selected .priority-dot { border-width: 3px; }

    /* Color-coded dots */
    .priority-option.pri-critical .priority-dot { border-color: var(--danger); }
    .priority-option.pri-high     .priority-dot { border-color: var(--warning); }
    .priority-option.pri-medium   .priority-dot { border-color: var(--primary); }
    .priority-option.pri-low      .priority-dot { border-color: var(--success); }

    .priority-option.pri-critical.selected { border-color: var(--danger);  background: var(--danger-light); }
    .priority-option.pri-high.selected     { border-color: var(--warning); background: var(--warning-light); }
    .priority-option.pri-medium.selected   { border-color: var(--primary); background: var(--primary-light); }
    .priority-option.pri-low.selected      { border-color: var(--success); background: var(--success-light); }

    .priority-option.pri-critical.selected .priority-dot { background: var(--danger);  border-color: var(--danger); }
    .priority-option.pri-high.selected     .priority-dot { background: var(--warning); border-color: var(--warning); }
    .priority-option.pri-medium.selected   .priority-dot { background: var(--primary); border-color: var(--primary); }
    .priority-option.pri-low.selected      .priority-dot { background: var(--success); border-color: var(--success); }

    .priority-content { display: flex; flex-direction: column; gap: 3px; }

    /* Label: 14px / 500 */
    .priority-label { font-size: 14px; font-weight: 500; color: var(--text-primary); }

    /* Caption: 12px */
    .priority-desc { font-size: 12px; color: var(--text-secondary); }

    /* ─── File Upload ───────────────────────────────────────────── */
    .file-upload { position: relative; }

    .file-upload input[type="file"] {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 32px 24px;
      border: 2px dashed var(--border-color);
      border-radius: var(--radius-lg);
      text-align: center;
      cursor: pointer;
      transition: all var(--transition);
    }

    .upload-label:hover {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--bg-page);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
    }

    .upload-label:hover .upload-icon {
      background: #DBEAFE;
      color: var(--primary);
    }

    .upload-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .upload-hint {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Attachment list */
    .attachment-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg-page);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
    }

    .attach-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .file-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .file-size { font-size: 12px; color: var(--text-secondary); }

    .remove-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
    }

    .remove-btn:hover {
      background: var(--danger-light);
      color: var(--danger);
      transform: scale(1.05);
    }

    /* ─── Contact Options ───────────────────────────────────────── */
    .contact-options { display: flex; gap: 12px; }

    .contact-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
    }

    .contact-option:hover {
      border-color: #CBD5E1;
      color: var(--text-primary);
    }

    .contact-option.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      color: var(--primary);
    }

    .contact-option input { display: none; }

    /* ─── Form Footer ───────────────────────────────────────────── */
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
      margin-top: 24px;
    }

    .sla-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .sla-info strong { font-weight: 600; color: var(--text-primary); }

    .form-actions { display: flex; gap: 12px; }

    /* ─── Responsive ────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .raise-ticket-page { padding: 20px 16px; }
      .header-title h1 { font-size: 28px; }
      .form-grid { grid-template-columns: 1fr; }
      .form-group.full-width { grid-column: span 1; }
      .priority-options { grid-template-columns: repeat(2, 1fr); }
      .contact-options { flex-direction: column; }
      .workflow-banner { flex-direction: column; gap: 16px; }
      .workflow-divider { width: 100%; height: 1px; }
      .form-footer { flex-direction: column; gap: 16px; align-items: stretch; }
      .form-actions { justify-content: flex-end; }
    }

    @media (max-width: 480px) {
      .priority-options { grid-template-columns: 1fr; }
      .header-content { flex-direction: column; align-items: flex-start; }
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
    this.route  = route;

    const assetId = this.route.snapshot.queryParams['assetId'];
    if (assetId) {
      const asset = this.assets().find(a => a.id === assetId);
      if (asset) this.selectedAsset.set(asset);
    }
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
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

  goBack(): void { this.router.navigate(['/tickets']); }

  submitTicket(): void {
    if (!this.selectedAsset() || !this.category() || !this.title() || !this.description()) {
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