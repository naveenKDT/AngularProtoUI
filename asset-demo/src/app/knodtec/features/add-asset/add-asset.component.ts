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

interface AssetCategory {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'knodtec-add-asset',
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
    <div class="add-asset-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-title">
            <h1>Add New Asset</h1>
            <p>Register a new asset in the inventory system</p>
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
          <strong>Adding a New Asset</strong>
          <span>Complete all required fields to add an asset to the inventory. Assets can be assigned to employees once registered.</span>
        </div>
      </div>

      <!-- Form -->
      <div class="form-container">
        <knod-card title="Basic Information">
          <div class="form-grid">
            <!-- Asset Tag -->
            <div class="form-group">
              <label class="form-label">
                Asset Tag <span class="required">*</span>
              </label>
              <div class="input-with-prefix">
                <span class="input-prefix">AST-</span>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="0001"
                  [ngModel]="assetTag()"
                  (ngModelChange)="assetTag.set($event)">
              </div>
              <span class="form-hint">Auto-generated if left empty</span>
            </div>

            <!-- Asset Category -->
            <div class="form-group">
              <label class="form-label">
                Category <span class="required">*</span>
              </label>
              <div class="category-options">
                @for (cat of categories; track cat.value) {
                  <label class="category-option" [class.selected]="category() === cat.value">
                    <input 
                      type="radio" 
                      name="category" 
                      [value]="cat.value"
                      [ngModel]="category()"
                      (ngModelChange)="category.set($event)">
                    <div class="category-icon" [innerHTML]="cat.icon"></div>
                    <span class="category-label">{{ cat.label }}</span>
                  </label>
                }
              </div>
            </div>

            <!-- Asset Name -->
            <div class="form-group full-width">
              <label class="form-label">
                Asset Name <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., MacBook Pro 14-inch M3"
                [ngModel]="name()"
                (ngModelChange)="name.set($event)">
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label">
                Brand <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="brand()" (ngModelChange)="brand.set($event)">
                <option value="">Select brand</option>
                <option value="Apple">Apple</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Samsung">Samsung</option>
                <option value="Sony">Sony</option>
                <option value="Logitech">Logitech</option>
                <option value="Cisco">Cisco</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Model -->
            <div class="form-group">
              <label class="form-label">
                Model <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., MacBook Pro 14-inch"
                [ngModel]="model()"
                (ngModelChange)="model.set($event)">
            </div>

            <!-- Serial Number -->
            <div class="form-group">
              <label class="form-label">
                Serial Number <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Enter serial number"
                [ngModel]="serialNumber()"
                (ngModelChange)="serialNumber.set($event)">
            </div>

            <!-- Model Number -->
            <div class="form-group">
              <label class="form-label">
                Model Number <span class="optional">(optional)</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Enter model number"
                [ngModel]="modelNumber()"
                (ngModelChange)="modelNumber.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Purchase Information -->
        <knod-card title="Purchase Information">
          <div class="form-grid">
            <!-- Purchase Date -->
            <div class="form-group">
              <label class="form-label">
                Purchase Date <span class="required">*</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="purchaseDate()"
                (ngModelChange)="purchaseDate.set($event)">
            </div>

            <!-- Purchase Cost -->
            <div class="form-group">
              <label class="form-label">
                Purchase Cost <span class="required">*</span>
              </label>
              <div class="budget-input">
                <span class="currency">₹</span>
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="0"
                  min="0"
                  [ngModel]="purchaseCost()"
                  (ngModelChange)="purchaseCost.set($event)">
              </div>
            </div>

            <!-- Vendor -->
            <div class="form-group">
              <label class="form-label">
                Vendor/Supplier <span class="optional">(optional)</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., Amazon, Ingram Micro"
                [ngModel]="vendor()"
                (ngModelChange)="vendor.set($event)">
            </div>

            <!-- Invoice Number -->
            <div class="form-group">
              <label class="form-label">
                Invoice Number <span class="optional">(optional)</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., INV-2025-001"
                [ngModel]="invoiceNumber()"
                (ngModelChange)="invoiceNumber.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Warranty & Maintenance -->
        <knod-card title="Warranty & Maintenance">
          <div class="form-grid">
            <!-- Warranty Period -->
            <div class="form-group">
              <label class="form-label">
                Warranty Period <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="warrantyPeriod()" (ngModelChange)="warrantyPeriod.set($event)">
                <option value="">Select warranty</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="none">No Warranty</option>
              </select>
            </div>

            <!-- Warranty End Date -->
            <div class="form-group">
              <label class="form-label">
                Warranty End Date <span class="optional">(auto-calculated)</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="warrantyEnd()"
                (ngModelChange)="warrantyEnd.set($event)">
              <span class="form-hint">Auto-calculated from purchase date and warranty period</span>
            </div>

            <!-- Maintenance Contract -->
            <div class="form-group">
              <label class="form-label">
                Maintenance Contract
              </label>
              <select class="form-select" [ngModel]="maintenanceContract()" (ngModelChange)="maintenanceContract.set($event)">
                <option value="none">None</option>
                <option value="standard">Standard AMC</option>
                <option value="extended">Extended AMC</option>
                <option value="on-site">On-Site Support</option>
              </select>
            </div>

            <!-- Next Maintenance Date -->
            <div class="form-group">
              <label class="form-label">
                Next Maintenance Date <span class="optional">(if applicable)</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="nextMaintenance()"
                (ngModelChange)="nextMaintenance.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Location & Assignment -->
        <knod-card title="Location & Assignment">
          <div class="form-grid">
            <!-- Location -->
            <div class="form-group">
              <label class="form-label">
                Location <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="location()" (ngModelChange)="location.set($event)">
                <option value="">Select location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="IT Support Bay">IT Support Bay</option>
                <option value="Storage">Storage</option>
              </select>
            </div>

            <!-- Floor/Desk -->
            <div class="form-group">
              <label class="form-label">
                Floor/Building <span class="optional">(optional)</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., 3rd Floor, Building A"
                [ngModel]="floor()"
                (ngModelChange)="floor.set($event)">
            </div>

            <!-- Initial Status -->
            <div class="form-group">
              <label class="form-label">
                Initial Status <span class="required">*</span>
              </label>
              <div class="status-options">
                <label class="status-option" [class.selected]="status() === 'available'">
                  <input 
                    type="radio" 
                    name="status" 
                    value="available"
                    [ngModel]="status()"
                    (ngModelChange)="status.set($event)">
                  <span class="status-dot green"></span>
                  <span class="status-label">Available</span>
                  <span class="status-desc">Ready to assign</span>
                </label>
                <label class="status-option" [class.selected]="status() === 'storage'">
                  <input 
                    type="radio" 
                    name="status" 
                    value="storage"
                    [ngModel]="status()"
                    (ngModelChange)="status.set($event)">
                  <span class="status-dot blue"></span>
                  <span class="status-label">In Storage</span>
                  <span class="status-desc">Awaiting deployment</span>
                </label>
                <label class="status-option" [class.selected]="status() === 'maintenance'">
                  <input 
                    type="radio" 
                    name="status" 
                    value="maintenance"
                    [ngModel]="status()"
                    (ngModelChange)="status.set($event)">
                  <span class="status-dot amber"></span>
                  <span class="status-label">Maintenance</span>
                  <span class="status-desc">Under repair</span>
                </label>
              </div>
            </div>

            <!-- Department -->
            <div class="form-group">
              <label class="form-label">
                Department <span class="optional">(optional)</span>
              </label>
              <select class="form-select" [ngModel]="department()" (ngModelChange)="department.set($event)">
                <option value="">General Pool</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>
          </div>
        </knod-card>

        <!-- Specifications -->
        <knod-card title="Technical Specifications">
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">
                Specifications <span class="optional">(optional)</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="4"
                placeholder="Enter technical specifications like processor, RAM, storage, etc.
E.g.:
- Processor: Apple M3 Pro
- RAM: 18GB
- Storage: 512GB SSD
- Display: 14.2-inch Liquid Retina XDR"
                [ngModel]="specifications()"
                (ngModelChange)="specifications.set($event)">
              </textarea>
            </div>
          </div>
        </knod-card>

        <!-- Notes & Attachments -->
        <knod-card title="Additional Information">
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">
                Notes <span class="optional">(optional)</span>
              </label>
              <textarea 
                class="form-textarea"
                rows="3"
                placeholder="Any additional notes or comments about this asset"
                [ngModel]="notes()"
                (ngModelChange)="notes.set($event)">
              </textarea>
            </div>

            <!-- Attachments -->
            <div class="form-group full-width">
              <label class="form-label">
                Attachments <span class="optional">(optional)</span>
              </label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="asset-attachments"
                  multiple 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  (change)="handleFileUpload($event)">
                <label for="asset-attachments" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span class="upload-hint">PDF, JPG, PNG, DOC up to 10MB</span>
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
          </div>
        </knod-card>

        <!-- Form Footer -->
        <div class="form-footer">
          <div class="summary-info">
            <span>{{ getAssetSummary() }}</span>
            <span>Ready to add to inventory</span>
          </div>
          <div class="form-actions">
            <knod-button variant="secondary" (click)="goBack()">Cancel</knod-button>
            <knod-button variant="primary" [icon]="saveIcon" (click)="saveAsset()">Add Asset</knod-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-asset-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
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
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .header-title p {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 4px 0 0 0;
    }

    /* Info Banner */
    .info-banner {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-100);
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .banner-content strong {
      font-size: 14px;
      color: var(--color-slate-900);
    }

    .banner-content span {
      font-size: 13px;
      color: var(--color-slate-600);
    }

    /* Form Container */
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Form Grid */
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
      font-weight: 400;
      color: var(--color-slate-400);
    }

    .form-hint {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
      transition: all var(--transition-fast);
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Input with Prefix */
    .input-with-prefix {
      display: flex;
      align-items: center;
    }

    .input-prefix {
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-right: none;
      border-radius: 8px 0 0 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .input-with-prefix .form-input {
      border-radius: 0 8px 8px 0;
    }

    /* Category Options */
    .category-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .category-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .category-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .category-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .category-option input {
      display: none;
    }

    .category-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-slate-500);
    }

    .category-option.selected .category-icon {
      color: var(--color-primary-600);
    }

    .category-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Budget Input */
    .budget-input {
      display: flex;
      align-items: center;
      gap: 0;
    }

    .currency {
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-right: none;
      border-radius: 8px 0 0 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .budget-input .form-input {
      border-radius: 0 8px 8px 0;
    }

    /* Status Options */
    .status-options {
      display: flex;
      gap: 12px;
    }

    .status-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
      flex: 1;
      text-align: center;
    }

    .status-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .status-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .status-option input {
      display: none;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .status-dot.green { background: var(--color-success-500); }
    .status-dot.blue { background: var(--color-primary-500); }
    .status-dot.amber { background: var(--color-warning-500); }

    .status-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .status-option.selected .status-label {
      color: var(--color-primary-700);
    }

    .status-desc {
      font-size: 10px;
      color: var(--color-slate-400);
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

    /* Form Footer */
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

    /* Save Icon */
    .saveIcon {
      display: flex;
    }
  `]
})
export class AddAssetComponent {
  private router: Router;

  readonly assetTag = signal('');
  readonly category = signal('');
  readonly name = signal('');
  readonly brand = signal('');
  readonly model = signal('');
  readonly serialNumber = signal('');
  readonly modelNumber = signal('');
  readonly purchaseDate = signal('');
  readonly purchaseCost = signal<number | null>(null);
  readonly vendor = signal('');
  readonly invoiceNumber = signal('');
  readonly warrantyPeriod = signal('');
  readonly warrantyEnd = signal('');
  readonly maintenanceContract = signal('none');
  readonly nextMaintenance = signal('');
  readonly location = signal('');
  readonly floor = signal('');
  readonly status = signal('available');
  readonly department = signal('');
  readonly specifications = signal('');
  readonly notes = signal('');
  readonly attachments = signal<Array<{ name: string; size: string }>>([]);

  readonly saveIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

  readonly categories: AssetCategory[] = [
    { value: 'Laptop', label: 'Laptop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Desktop', label: 'Desktop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Monitor', label: 'Monitor', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Phone', label: 'Phone', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { value: 'Accessory', label: 'Accessory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { value: 'Printer', label: 'Printer', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' }
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

  getAssetSummary(): string {
    const parts = [];
    if (this.category()) parts.push(this.category());
    if (this.brand()) parts.push(this.brand());
    if (this.name()) parts.push(`- ${this.name()}`);
    return parts.join(' ') || 'No details entered';
  }

  goBack(): void {
    this.router.navigate(['/assets']);
  }

  saveAsset(): void {
    // Validate required fields
    if (!this.category() || !this.name() || !this.brand() || !this.model() || 
        !this.serialNumber() || !this.purchaseDate() || !this.purchaseCost() || 
        !this.warrantyPeriod() || !this.location()) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate asset tag if empty
    const assetTag = this.assetTag() || `AST-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

    // Calculate warranty end date
    let warrantyEndDate = this.warrantyEnd();
    if (this.warrantyPeriod() && this.warrantyPeriod() !== 'none' && this.purchaseDate()) {
      const purchaseDate = new Date(this.purchaseDate());
      const years = parseInt(this.warrantyPeriod());
      purchaseDate.setFullYear(purchaseDate.getFullYear() + years);
      warrantyEndDate = purchaseDate.toISOString().split('T')[0];
    }

    // Submit asset
    const newAsset = {
      tag: assetTag,
      category: this.category(),
      name: this.name(),
      brand: this.brand(),
      model: this.model(),
      serialNumber: this.serialNumber(),
      modelNumber: this.modelNumber(),
      purchaseDate: this.purchaseDate(),
      purchaseCost: this.purchaseCost(),
      vendor: this.vendor(),
      invoiceNumber: this.invoiceNumber(),
      warrantyPeriod: this.warrantyPeriod(),
      warrantyEnd: warrantyEndDate,
      maintenanceContract: this.maintenanceContract(),
      nextMaintenance: this.nextMaintenance(),
      location: this.location(),
      floor: this.floor(),
      status: this.status(),
      department: this.department(),
      specifications: this.specifications(),
      notes: this.notes(),
      attachments: this.attachments()
    };

    console.log('Creating asset:', newAsset);
    
    // Navigate back to assets
    this.router.navigate(['/assets']);
  }
}