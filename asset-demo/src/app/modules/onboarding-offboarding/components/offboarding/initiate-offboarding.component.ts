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
  TextareaComponent
} from '../../../shared/components/ui-components';

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
    TextareaComponent
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
          <!-- Progress Steps -->
          <div class="form-progress">
            <div class="progress-step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
              <div class="step-number">1</div>
              <div class="step-info">
                <span class="step-label">Employee Details</span>
                <span class="step-desc">Basic information</span>
              </div>
            </div>
            <div class="progress-line" [class.active]="currentStep() > 1"></div>
            <div class="progress-step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
              <div class="step-number">2</div>
              <div class="step-info">
                <span class="step-label">Separation Details</span>
                <span class="step-desc">Reason & dates</span>
              </div>
            </div>
            <div class="progress-line" [class.active]="currentStep() > 2"></div>
            <div class="progress-step" [class.active]="currentStep() >= 3">
              <div class="step-number">3</div>
              <div class="step-info">
                <span class="step-label">Review & Submit</span>
                <span class="step-desc">Confirm details</span>
              </div>
            </div>
          </div>

          <!-- Step 1: Employee Details -->
          @if (currentStep() === 1) {
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">Employee Information</h2>
                <p class="section-desc">Enter the employee's basic information</p>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <knod-input 
                    label="Employee ID" 
                    placeholder="Enter employee ID"
                    [(ngModel)]="formData.employeeId"
                    [required]="true">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Employee Name" 
                    placeholder="Enter full name"
                    [(ngModel)]="formData.employeeName"
                    [required]="true">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Email Address" 
                    type="email"
                    placeholder="employee@company.com"
                    [(ngModel)]="formData.employeeEmail"
                    [required]="true">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Position / Title" 
                    placeholder="Enter position"
                    [(ngModel)]="formData.position">
                  </knod-input>
                </div>
              </div>
            </div>
          }

          <!-- Step 2: Separation Details -->
          @if (currentStep() === 2) {
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">Separation Information</h2>
                <p class="section-desc">Enter the offboarding details</p>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <knod-select 
                    label="Department" 
                    placeholder="Select department"
                    [options]="departmentOptions"
                    [(ngModel)]="formData.department">
                  </knod-select>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Reporting Manager" 
                    placeholder="Enter manager name"
                    [(ngModel)]="formData.manager">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Joining Date" 
                    type="date"
                    [(ngModel)]="formData.joiningDate">
                  </knod-input>
                </div>
                <div class="form-group">
                  <knod-input 
                    label="Last Working Day" 
                    type="date"
                    [(ngModel)]="formData.lastWorkingDay"
                    [required]="true">
                  </knod-input>
                </div>
                <div class="form-group full-width">
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
            </div>
          }

          <!-- Step 3: Additional Information -->
          @if (currentStep() === 3) {
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">Additional Information</h2>
                <p class="section-desc">Add any remarks or comments</p>
              </div>

              <div class="form-grid">
                <div class="form-group full-width">
                  <knod-textarea 
                    label="Remarks" 
                    placeholder="Any special instructions or remarks for the offboarding process..."
                    [(ngModel)]="formData.remarks"
                    [rows]="4">
                  </knod-textarea>
                </div>
                <div class="form-group full-width">
                  <knod-textarea 
                    label="Comments" 
                    placeholder="Additional comments or notes..."
                    [(ngModel)]="formData.comments"
                    [rows]="4">
                  </knod-textarea>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="summary-card">
                <h3 class="summary-title">Offboarding Summary</h3>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Employee</span>
                    <span class="summary-value">{{ formData.employeeName || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Employee ID</span>
                    <span class="summary-value">{{ formData.employeeId || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Email</span>
                    <span class="summary-value">{{ formData.employeeEmail || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Position</span>
                    <span class="summary-value">{{ formData.position || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Department</span>
                    <span class="summary-value">{{ formData.department || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Manager</span>
                    <span class="summary-value">{{ formData.manager || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Last Working Day</span>
                    <span class="summary-value">{{ formData.lastWorkingDay || 'Not provided' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Separation Type</span>
                    <span class="summary-value">{{ formData.separationType || 'Not provided' }}</span>
                  </div>
                </div>
              </div>
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
      max-width: 900px;
      margin: 0 auto;
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
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid var(--color-slate-200);
      background: white;
      color: var(--color-slate-600);
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      background: var(--color-slate-50);
      border-color: var(--color-slate-300);
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .form-container {
      max-width: 100%;
    }

    .form-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--color-slate-100);
    }

    /* Progress Steps */
    .form-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      padding: 0 24px;
    }

    .progress-step {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-slate-100);
      color: var(--color-slate-500);
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-normal);
    }

    .progress-step.active .step-number {
      background: var(--color-primary-600);
      color: white;
    }

    .progress-step.completed .step-number {
      background: var(--color-success-500);
      color: white;
    }

    .step-info {
      display: flex;
      flex-direction: column;
    }

    .step-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-400);
      transition: all var(--transition-normal);
    }

    .progress-step.active .step-label {
      color: var(--color-slate-900);
    }

    .step-desc {
      font-size: 12px;
      color: var(--color-slate-400);
    }

    .progress-line {
      flex: 1;
      height: 2px;
      background: var(--color-slate-200);
      margin: 0 16px;
      max-width: 120px;
      transition: all var(--transition-normal);
    }

    .progress-line.active {
      background: var(--color-primary-600);
    }

    /* Form Sections */
    .form-section {
      margin-bottom: 32px;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .section-desc {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    /* Summary Card */
    .summary-card {
      background: var(--color-slate-50);
      border-radius: 12px;
      padding: 24px;
      margin-top: 24px;
    }

    .summary-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 16px 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-500);
    }

    .summary-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid var(--color-slate-100);
    }

    .actions-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-card {
        padding: 24px 16px;
      }

      .form-progress {
        padding: 0;
      }

      .progress-step {
        flex-direction: column;
        text-align: center;
      }

      .step-info {
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
    }
  `]
})
export class InitiateOffboardingComponent {
  private router: Router;

  readonly currentStep = signal(1);
  readonly isSubmitting = signal(false);

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

  departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'support', label: 'Customer Support' },
    { value: 'legal', label: 'Legal' }
  ];

  separationTypeOptions = [
    { value: 'resignation', label: 'Resignation' },
    { value: 'termination', label: 'Termination' },
    { value: 'contract_end', label: 'Contract End' },
    { value: 'retirement', label: 'Retirement' },
    { value: ' layoff', label: 'Layoff' },
    { value: 'death', label: 'Death' },
    { value: 'other', label: 'Other' }
  ];

  constructor(router: Router) {
    this.router = router;
  }

  nextStep(): void {
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
    
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting.set(false);
      // Navigate back to offboarding page
      this.router.navigate(['/offboarding']);
    }, 1500);
  }
}