import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
  AvatarComponent
} from '../../../../shared/components/ui-components';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  manager: string;
  joiningDate: string;
}

interface OffboardingFormData {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  position: string;
  department: string;
  manager: string;
  joiningDate: string;
  lastWorkingDay: string;
  separationType: string;
  reason: string;
  remarks: string;
  comments: string;
}

@Component({
  selector: 'knodtec-initiate-offboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    AvatarComponent
  ],
  template: `
    <div class="initiate-offboarding-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-nav">
          <button class="back-btn" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-content">
            <h1 class="page-title">Initiate Offboarding</h1>
            <p class="page-subtitle">Start the employee offboarding process</p>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="form-container">
        <div class="form-card">
          
          <!-- Progress Steps with Icons -->
          <div class="form-progress">
            <div class="progress-step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
              <div class="step-icon">
                @if (currentStep() > 1) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              </div>
              <div class="step-number" [class.hide]="currentStep() > 1">1</div>
              <div class="step-info">
                <span class="step-label">Employee Selection</span>
                <span class="step-desc">Select employee</span>
              </div>
            </div>
            <div class="progress-line" [class.active]="currentStep() > 1">
              <div class="progress-line-fill"></div>
            </div>
            <div class="progress-step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
              <div class="step-icon">
                @if (currentStep() > 2) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                }
              </div>
              <div class="step-number" [class.hide]="currentStep() > 2">2</div>
              <div class="step-info">
                <span class="step-label">Separation Details</span>
                <span class="step-desc">Reason & dates</span>
              </div>
            </div>
            <div class="progress-line" [class.active]="currentStep() > 2">
              <div class="progress-line-fill"></div>
            </div>
            <div class="progress-step" [class.active]="currentStep() >= 3">
              <div class="step-icon">
                @if (currentStep() >= 3) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                }
              </div>
              <div class="step-number">3</div>
              <div class="step-info">
                <span class="step-label">Review & Submit</span>
                <span class="step-desc">Confirm details</span>
              </div>
            </div>
          </div>

          <!-- Step 1: Employee Selection -->
          @if (currentStep() === 1) {
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h2 class="section-title">Select Employee</h2>
                  <p class="section-desc">Choose an employee from the dropdown to auto-fill their details</p>
                </div>
              </div>

              <!-- Employee Selection Dropdown -->
              <div class="employee-selector-wrapper">
                <div class="employee-selector">
                  <label class="selector-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    Search Employee
                  </label>
                  <select class="employee-select" [(ngModel)]="selectedEmployeeId" (change)="onEmployeeSelect($event)">
                    <option value="">-- Select an employee --</option>
                    @for (emp of employeeOptions; track emp.id) {
                      <option [value]="emp.id">{{ emp.name }} ({{ emp.id }}) - {{ emp.department }}</option>
                    }
                  </select>
                  <div class="select-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Auto-filled Employee Info Card -->
              @if (selectedEmployeeId) {
                <div class="employee-info-card">
                  <div class="employee-info-header">
                    <knod-avatar [name]="formData.employeeName" size="lg"></knod-avatar>
                    <div class="employee-info-main">
                      <h3 class="employee-name">{{ formData.employeeName }}</h3>
                      <p class="employee-position">{{ formData.position }}</p>
                      <div class="employee-badges">
                        <knod-badge color="blue" size="sm">{{ formData.department }}</knod-badge>
                        <knod-badge color="violet" size="sm">{{ formData.employeeId }}</knod-badge>
                      </div>
                    </div>
                  </div>
                  <div class="employee-info-grid">
                    <div class="info-item">
                      <div class="info-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div class="info-content">
                        <span class="info-label">Email</span>
                        <span class="info-value">{{ formData.employeeEmail }}</span>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div class="info-content">
                        <span class="info-label">Reporting Manager</span>
                        <span class="info-value">{{ formData.manager }}</span>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div class="info-content">
                        <span class="info-label">Joining Date</span>
                        <span class="info-value">{{ formData.joiningDate | date:'mediumDate' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="auto-fill-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Auto-filled from employee record
                  </div>
                </div>
              }

              <!-- Info Box -->
              <div class="info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p>Employee details will be automatically populated based on your selection. You can still edit any field if needed.</p>
              </div>
            </div>
          }

          <!-- Step 2: Separation Details -->
          @if (currentStep() === 2) {
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <div>
                  <h2 class="section-title">Separation Information</h2>
                  <p class="section-desc">Enter the offboarding details for {{ formData.employeeName }}</p>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <knod-input 
                    label="Last Working Day" 
                    type="date"
                    [(ngModel)]="formData.lastWorkingDay"
                    [required]="true">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-select 
                    label="Separation Type" 
                    placeholder="Select separation type"
                    [options]="separationTypeOptions"
                    [(ngModel)]="formData.separationType"
                    [required]="true">
                  </knod-select>
                </div>
                <div class="form-group full-width">
                  <knod-textarea 
                    label="Reason for Offboarding" 
                    placeholder="Briefly describe the reason for offboarding..."
                    [(ngModel)]="formData.reason"
                    [rows]="3">
                  </knod-textarea>
                </div>
              </div>

              <!-- Employee Summary Mini Card -->
              <div class="mini-summary-card">
                <div class="mini-summary-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="mini-summary-content">
                  <span class="mini-summary-name">{{ formData.employeeName }}</span>
                  <span class="mini-summary-detail">{{ formData.position }} · {{ formData.department }}</span>
                </div>
                <knod-badge color="blue" size="sm">ID: {{ formData.employeeId }}</knod-badge>
              </div>
            </div>
          }

          <!-- Step 3: Additional Information & Review -->
          @if (currentStep() === 3) {
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <h2 class="section-title">Final Review</h2>
                  <p class="section-desc">Review all details before submitting the offboarding request</p>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group full-width">
                  <knod-textarea 
                    label="Remarks" 
                    placeholder="Any special instructions or remarks for the offboarding process..."
                    [(ngModel)]="formData.remarks"
                    [rows]="3">
                  </knod-textarea>
                </div>
                <div class="form-group full-width">
                  <knod-textarea 
                    label="Additional Comments" 
                    placeholder="Any additional comments or notes..."
                    [(ngModel)]="formData.comments"
                    [rows]="3">
                  </knod-textarea>
                </div>
              </div>
            </div>

            <!-- Summary Card -->
            <div class="summary-card">
              <div class="summary-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <h3 class="summary-title">Offboarding Summary</h3>
              </div>
              
              <div class="summary-employee-card">
                <knod-avatar [name]="formData.employeeName" size="md"></knod-avatar>
                <div class="summary-employee-info">
                  <span class="summary-employee-name">{{ formData.employeeName }}</span>
                  <span class="summary-employee-id">{{ formData.employeeId }}</span>
                </div>
                <knod-badge color="blue">{{ formData.department }}</knod-badge>
              </div>

              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-item-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div class="summary-item-content">
                    <span class="summary-label">Last Working Day</span>
                    <span class="summary-value">{{ formData.lastWorkingDay | date:'mediumDate' }}</span>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-item-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                  <div class="summary-item-content">
                    <span class="summary-label">Separation Type</span>
                    <span class="summary-value">{{ formData.separationType }}</span>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-item-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div class="summary-item-content">
                    <span class="summary-label">Joined On</span>
                    <span class="summary-value">{{ formData.joiningDate | date:'mediumDate' }}</span>
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-item-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="summary-item-content">
                    <span class="summary-label">Manager</span>
                    <span class="summary-value">{{ formData.manager }}</span>
                  </div>
                </div>
              </div>

              @if (formData.reason) {
                <div class="summary-reason">
                  <span class="summary-reason-label">Reason:</span>
                  <span class="summary-reason-text">{{ formData.reason }}</span>
                </div>
              }
            </div>
          }

          <!-- Form Actions -->
          <div class="form-actions">
            @if (currentStep() > 1) {
              <knod-button variant="outline" (click)="prevStep()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Previous
              </knod-button>
            }
            <div class="actions-right">
              <knod-button variant="ghost" (click)="goBack()">Cancel</knod-button>
              @if (currentStep() < 3) {
                <knod-button variant="primary" (click)="nextStep()">
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </knod-button>
              } @else {
                <knod-button variant="primary" (click)="submitForm()" [loading]="isSubmitting()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  Submit Offboarding
                </knod-button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .initiate-offboarding-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 2px solid var(--color-slate-200);
      background: white;
      color: var(--color-slate-600);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .back-btn:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-400);
      color: var(--color-primary-600);
      transform: translateX(-2px);
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 6px 0;
    }

    .page-subtitle {
      font-size: 15px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .form-container {
      max-width: 100%;
    }

    .form-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 2px solid var(--color-slate-100);
      transition: all 0.3s ease;
    }

    .form-card:hover {
      border-color: var(--color-slate-200);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    }

    /* Progress Steps */
    .form-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 48px;
      padding: 0 24px;
    }

    .progress-step {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 20px;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .progress-step:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-100);
    }

    .progress-step.active {
      background: linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100));
      border-color: var(--color-primary-300);
    }

    .progress-step.completed {
      background: linear-gradient(135deg, var(--color-success-50), var(--color-success-100));
      border-color: var(--color-success-200);
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-slate-100);
      color: var(--color-slate-500);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .progress-step.active .step-icon {
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .progress-step.completed .step-icon {
      background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
      color: white;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
    }

    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-slate-200);
      color: var(--color-slate-600);
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .step-number.hide {
      display: none;
    }

    .progress-step.active .step-number {
      background: var(--color-primary-600);
      color: white;
    }

    .step-info {
      display: flex;
      flex-direction: column;
    }

    .step-label {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-slate-400);
      transition: all 0.3s ease;
    }

    .progress-step.active .step-label {
      color: var(--color-primary-700);
    }

    .progress-step.completed .step-label {
      color: var(--color-success-700);
    }

    .step-desc {
      font-size: 12px;
      color: var(--color-slate-400);
    }

    .progress-line {
      flex: 1;
      height: 4px;
      background: var(--color-slate-200);
      margin: 0 16px;
      max-width: 140px;
      border-radius: 2px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .progress-line.active {
      background: var(--color-primary-100);
    }

    .progress-line-fill {
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .progress-line.active .progress-line-fill {
      width: 100%;
    }

    /* Form Sections */
    .form-section {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
      padding: 20px;
      background: linear-gradient(135deg, var(--color-slate-50), var(--color-slate-100));
      border-radius: 14px;
      border: 2px solid var(--color-slate-200);
    }

    .section-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .section-icon.secondary {
      background: linear-gradient(135deg, var(--color-violet-500), var(--color-violet-600));
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .section-icon.success {
      background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .section-desc {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Employee Selector */
    .employee-selector-wrapper {
      margin-bottom: 24px;
    }

    .employee-selector {
      position: relative;
    }

    .selector-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-600);
      margin-bottom: 8px;
    }

    .employee-select {
      width: 100%;
      padding: 14px 44px 14px 16px;
      font-size: 15px;
      border: 2px solid var(--color-slate-200);
      border-radius: 12px;
      background: white;
      color: var(--color-slate-800);
      cursor: pointer;
      appearance: none;
      transition: all 0.3s ease;
      outline: none;
    }

    .employee-select:hover {
      border-color: var(--color-primary-300);
    }

    .employee-select:focus {
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 4px var(--color-primary-100);
    }

    .select-arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(25%);
      color: var(--color-slate-400);
      pointer-events: none;
    }

    /* Employee Info Card */
    .employee-info-card {
      background: linear-gradient(135deg, var(--color-primary-50), var(--color-blue-50));
      border: 2px solid var(--color-primary-200);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      animation: slideIn 0.4s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .employee-info-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px dashed var(--color-primary-200);
    }

    .employee-info-main {
      flex: 1;
    }

    .employee-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .employee-position {
      font-size: 14px;
      color: var(--color-slate-600);
      margin: 0 0 10px 0;
    }

    .employee-badges {
      display: flex;
      gap: 8px;
    }

    .employee-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 10px;
      border: 1px solid var(--color-primary-100);
      transition: all 0.3s ease;
    }

    .info-item:hover {
      border-color: var(--color-primary-300);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .info-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-800);
    }

    .auto-fill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      padding: 8px 14px;
      background: var(--color-success-100);
      color: var(--color-success-700);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Info Box */
    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--color-blue-50);
      border: 2px solid var(--color-blue-200);
      border-radius: 12px;
      color: var(--color-blue-700);
    }

    .info-box svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-box p {
      font-size: 13px;
      margin: 0;
      line-height: 1.5;
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    /* Mini Summary Card */
    .mini-summary-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      background: linear-gradient(135deg, var(--color-slate-50), var(--color-slate-100));
      border: 2px solid var(--color-slate-200);
      border-radius: 12px;
      margin-top: 24px;
    }

    .mini-summary-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--color-slate-200);
      color: var(--color-slate-600);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mini-summary-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .mini-summary-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-800);
    }

    .mini-summary-detail {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    /* Summary Card */
    .summary-card {
      background: linear-gradient(135deg, var(--color-slate-50), var(--color-slate-100));
      border: 2px solid var(--color-slate-200);
      border-radius: 16px;
      padding: 28px;
      margin-top: 24px;
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--color-slate-200);
      color: var(--color-slate-600);
    }

    .summary-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-slate-800);
      margin: 0;
    }

    .summary-employee-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 2px solid var(--color-primary-200);
      margin-bottom: 20px;
    }

    .summary-employee-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .summary-employee-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-slate-800);
    }

    .summary-employee-id {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .summary-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      background: white;
      border-radius: 10px;
      border: 2px solid var(--color-slate-200);
      transition: all 0.3s ease;
    }

    .summary-item:hover {
      border-color: var(--color-primary-300);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .summary-item-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .summary-item-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-800);
    }

    .summary-reason {
      margin-top: 20px;
      padding: 16px;
      background: white;
      border-radius: 10px;
      border: 2px solid var(--color-slate-200);
    }

    .summary-reason-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-500);
      margin-right: 8px;
    }

    .summary-reason-text {
      font-size: 14px;
      color: var(--color-slate-700);
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 28px;
      border-top: 2px solid var(--color-slate-200);
    }

    .actions-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .initiate-offboarding-page {
        padding: 0 12px;
      }

      .form-card {
        padding: 24px 16px;
      }

      .form-progress {
        padding: 0;
        flex-wrap: wrap;
        gap: 12px;
      }

      .progress-step {
        flex: 1;
        min-width: 120px;
        justify-content: center;
      }

      .step-info {
        display: none;
      }

      .progress-line {
        display: none;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-group.full-width {
        grid-column: span 1;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .employee-info-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class InitiateOffboardingComponent {
  private router: Router;

  readonly currentStep = signal(1);
  readonly isSubmitting = signal(false);
  readonly selectedEmployeeId = signal('');

  formData: OffboardingFormData = {
    employeeId: '',
    employeeName: '',
    employeeEmail: '',
    position: '',
    department: '',
    manager: '',
    joiningDate: '',
    lastWorkingDay: '',
    separationType: '',
    reason: '',
    remarks: '',
    comments: ''
  };

  employeeOptions: Employee[] = [
    { id: 'EMP001', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', position: 'Senior Software Engineer', department: 'Engineering', manager: 'Michael Chen', joiningDate: '2021-03-15' },
    { id: 'EMP002', name: 'David Williams', email: 'david.williams@company.com', position: 'Product Manager', department: 'Product', manager: 'Lisa Anderson', joiningDate: '2020-08-22' },
    { id: 'EMP003', name: 'Emily Davis', email: 'emily.davis@company.com', position: 'UX Designer', department: 'Design', manager: 'James Wilson', joiningDate: '2022-01-10' },
    { id: 'EMP004', name: 'Robert Brown', email: 'robert.brown@company.com', position: 'Marketing Lead', department: 'Marketing', manager: 'Jennifer Taylor', joiningDate: '2019-11-05' },
    { id: 'EMP005', name: 'Amanda Martinez', email: 'amanda.martinez@company.com', position: 'HR Specialist', department: 'Human Resources', manager: 'Tom Harris', joiningDate: '2021-06-18' },
    { id: 'EMP006', name: 'Christopher Lee', email: 'christopher.lee@company.com', position: 'Financial Analyst', department: 'Finance', manager: 'Patricia Moore', joiningDate: '2020-04-12' },
    { id: 'EMP007', name: 'Jessica Thompson', email: 'jessica.thompson@company.com', position: 'Sales Executive', department: 'Sales', manager: 'Daniel Garcia', joiningDate: '2022-07-01' },
    { id: 'EMP008', name: 'Matthew Anderson', email: 'matthew.anderson@company.com', position: 'DevOps Engineer', department: 'Engineering', manager: 'Michael Chen', joiningDate: '2021-09-28' },
  ];

  separationTypeOptions = [
    { value: 'resignation', label: 'Resignation' },
    { value: 'termination', label: 'Termination' },
    { value: 'contract_end', label: 'Contract End' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'layoff', label: 'Layoff' },
    { value: 'death', label: 'Death' },
    { value: 'other', label: 'Other' }
  ];

  constructor(router: Router) {
    this.router = router;
  }

  onEmployeeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const employeeId = select.value;
    this.selectedEmployeeId.set(employeeId);

    if (employeeId) {
      const employee = this.employeeOptions.find(e => e.id === employeeId);
      if (employee) {
        this.formData = {
          ...this.formData,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeEmail: employee.email,
          position: employee.position,
          department: employee.department,
          manager: employee.manager,
          joiningDate: employee.joiningDate
        };
      }
    } else {
      this.formData = {
        ...this.formData,
        employeeId: '',
        employeeName: '',
        employeeEmail: '',
        position: '',
        department: '',
        manager: '',
        joiningDate: ''
      };
    }
  }

  nextStep(): void {
    if (this.currentStep() === 1 && !this.selectedEmployeeId()) {
      window.alert('Please select an employee first.');
      return;
    }
    if (this.currentStep() < 3) {
      this.currentStep.update(v => v + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
    }
  }

  goBack(): void {
    this.router.navigate(['/offboarding']);
  }

  submitForm(): void {
    this.isSubmitting.set(true);
    
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/offboarding']);
    }, 1500);
  }
}