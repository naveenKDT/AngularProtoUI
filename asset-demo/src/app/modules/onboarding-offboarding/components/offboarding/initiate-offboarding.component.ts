import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  manager: string;
  joiningDate: string;
  avatar?: string;
  status?: string;
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
    DatePipe
  ],
  template: `
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
    </div>

    <div class="initiate-offboarding-page">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-nav">
          <button class="back-btn" (click)="goBack()">
            <div class="back-btn-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
          </button>
          <div class="header-content">
            <div class="header-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Offboarding Process
            </div>
            <h1 class="page-title">Initiate Offboarding</h1>
            <p class="page-subtitle">Start the employee offboarding journey with a seamless digital experience</p>
          </div>
        </div>
      </header>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
        </div>
        <div class="progress-steps">
          @for (step of steps; track step.number; let i = $index) {
            <div class="progress-step" 
                 [class.active]="currentStep() >= step.number"
                 [class.completed]="currentStep() > step.number"
                 [class.current]="currentStep() === step.number">
              <div class="step-indicator">
                @if (currentStep() > step.number) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                } @else {
                  {{ step.number }}
                }
              </div>
              <span class="step-label">{{ step.label }}</span>
            </div>
            @if (i < steps.length - 1) {
              <div class="step-connector" [class.active]="currentStep() > step.number"></div>
            }
          }
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="form-container">
        <div class="form-card" [class.step-1]="currentStep() === 1" [class.step-2]="currentStep() === 2" [class.step-3]="currentStep() === 3">
          
          <!-- Step 1: Employee Selection -->
          @if (currentStep() === 1) {
            <div class="step-content animate-in">
              <div class="step-header">
                <div class="step-icon-wrapper">
                  <div class="step-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                </div>
                <div class="step-title-group">
                  <h2 class="step-title">Select Employee</h2>
                  <p class="step-description">Choose an employee from the dropdown to begin the offboarding process</p>
                </div>
              </div>

              <!-- Searchable Employee Dropdown -->
              <div class="employee-search-container">
                <div class="search-input-wrapper">
                  <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Search employee by name, ID, or department..."
                    [ngModel]="searchQuery()"
                    (ngModelChange)="searchQuery.set($event); showDropdown = true"
                    (focus)="showDropdown = true"
                  />
                  @if (searchQuery()) {
                    <button class="search-clear" (click)="clearSearch()">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  }
                </div>
                
                <div class="dropdown-list" [class.show]="showDropdown">
                  @for (emp of filteredEmployees(); track emp.id) {
                    <div class="dropdown-item" 
                         [class.selected]="selectedEmployeeId() === emp.id"
                         (click)="selectEmployee(emp)">
                      <div class="emp-avatar" [style.background]="getAvatarColor(emp.name)">
                        {{ getInitials(emp.name) }}
                      </div>
                      <div class="emp-details">
                        <span class="emp-name">{{ emp.name }}</span>
                        <span class="emp-meta">{{ emp.id }} • {{ emp.department }} • {{ emp.position }}</span>
                      </div>
                      <div class="emp-status">
                        <span class="status-badge" [class]="'status-' + (emp.status || 'active')">
                          {{ emp.status || 'Active' }}
                        </span>
                      </div>
                      @if (selectedEmployeeId() === emp.id) {
                        <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      }
                    </div>
                  } @empty {
                    <div class="dropdown-empty">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                      <span>No employees found</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Employee Details Preview (Auto-filled) -->
              @if (selectedEmployeeId()) {
                <div class="employee-preview-card">
                  <div class="preview-header">
                    <div class="preview-avatar" [style.background]="getAvatarColor(getSelectedEmployee()?.name || '')">
                      {{ getInitials(getSelectedEmployee()?.name || '') }}
                    </div>
                    <div class="preview-info">
                      <h3 class="preview-name">{{ formData.employeeName }}</h3>
                      <p class="preview-id">{{ formData.employeeId }}</p>
                    </div>
                    <div class="preview-status">
                      <span class="status-indicator"></span>
                      <span>Active Employee</span>
                    </div>
                  </div>
                  
                  <div class="preview-grid">
                    <div class="preview-item">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Email</span>
                        <span class="preview-value">{{ formData.employeeEmail }}</span>
                      </div>
                    </div>
                    <div class="preview-item">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Position</span>
                        <span class="preview-value">{{ formData.position }}</span>
                      </div>
                    </div>
                    <div class="preview-item">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Department</span>
                        <span class="preview-value">{{ formData.department }}</span>
                      </div>
                    </div>
                    <div class="preview-item">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Manager</span>
                        <span class="preview-value">{{ formData.manager }}</span>
                      </div>
                    </div>
                    <div class="preview-item">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Joining Date</span>
                        <span class="preview-value">{{ formData.joiningDate | date:'mediumDate' }}</span>
                      </div>
                    </div>
                    <div class="preview-item highlight">
                      <div class="preview-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div class="preview-item-content">
                        <span class="preview-label">Tenure</span>
                        <span class="preview-value">{{ calculateTenure(formData.joiningDate) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Step 2: Separation Details -->
          @if (currentStep() === 2) {
            <div class="step-content animate-in">
              <div class="step-header">
                <div class="step-icon-wrapper">
                  <div class="step-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                  </div>
                </div>
                <div class="step-title-group">
                  <h2 class="step-title">Separation Details</h2>
                  <p class="step-description">Provide the offboarding details and reason for separation</p>
                </div>
              </div>

              <!-- Employee Mini Card -->
              <div class="mini-employee-card">
                <div class="mini-avatar" [style.background]="getAvatarColor(getSelectedEmployee()?.name || '')">
                  {{ getInitials(getSelectedEmployee()?.name || '') }}
                </div>
                <div class="mini-info">
                  <span class="mini-name">{{ formData.employeeName }}</span>
                  <span class="mini-meta">{{ formData.position }} • {{ formData.department }}</span>
                </div>
                <button class="edit-btn" (click)="prevStep()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Last Working Day <span class="required">*</span>
                  </label>
                  <input 
                    type="date" 
                    class="form-input" 
                    [(ngModel)]="formData.lastWorkingDay"
                    [min]="minDate"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="17" y1="11" x2="23" y2="11"/>
                    </svg>
                    Separation Type <span class="required">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select class="form-select" [(ngModel)]="formData.separationType">
                      <option value="">Select type</option>
                      @for (type of separationTypeOptions; track type.value) {
                        <option [value]="type.value">{{ type.label }}</option>
                      }
                    </select>
                    <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Reason for Separation <span class="required">*</span>
                  </label>
                  <textarea 
                    class="form-textarea" 
                    rows="3"
                    placeholder="Please provide detailed reason for the offboarding..."
                    [(ngModel)]="formData.reason"
                  ></textarea>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Additional Remarks
                  </label>
                  <textarea 
                    class="form-textarea" 
                    rows="2"
                    placeholder="Any additional information or special instructions..."
                    [(ngModel)]="formData.remarks"
                  ></textarea>
                </div>
              </div>
            </div>
          }

          <!-- Step 3: Review & Submit -->
          @if (currentStep() === 3) {
            <div class="step-content animate-in">
              <div class="step-header">
                <div class="step-icon-wrapper success">
                  <div class="step-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                </div>
                <div class="step-title-group">
                  <h2 class="step-title">Review & Submit</h2>
                  <p class="step-description">Please review all details before submitting the offboarding request</p>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="summary-card">
                <div class="summary-header">
                  <div class="summary-avatar" [style.background]="getAvatarColor(getSelectedEmployee()?.name || '')">
                    {{ getInitials(getSelectedEmployee()?.name || '') }}
                  </div>
                  <div class="summary-info">
                    <h3 class="summary-name">{{ formData.employeeName }}</h3>
                    <span class="summary-id">{{ formData.employeeId }}</span>
                    <span class="summary-position">{{ formData.position }} • {{ formData.department }}</span>
                  </div>
                  <div class="summary-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Offboarding Request
                  </div>
                </div>

                <div class="summary-grid">
                  <div class="summary-item">
                    <div class="summary-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Last Working Day</span>
                      <span class="summary-value">{{ formData.lastWorkingDay | date:'fullDate' }}</span>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="17" y1="11" x2="23" y2="11"/>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Separation Type</span>
                      <span class="summary-value">{{ getSeparationTypeLabel(formData.separationType) }}</span>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Email</span>
                      <span class="summary-value">{{ formData.employeeEmail }}</span>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Manager</span>
                      <span class="summary-value">{{ formData.manager }}</span>
                    </div>
                  </div>
                </div>

                @if (formData.reason) {
                  <div class="summary-reason">
                    <div class="reason-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <span>Reason for Separation</span>
                    </div>
                    <p class="reason-text">{{ formData.reason }}</p>
                  </div>
                }

                @if (formData.remarks) {
                  <div class="summary-remarks">
                    <div class="remarks-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span>Additional Remarks</span>
                    </div>
                    <p class="remarks-text">{{ formData.remarks }}</p>
                  </div>
                }

                <!-- Comments Input -->
                <div class="summary-comments">
                  <label class="form-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Additional Comments for HR
                  </label>
                  <textarea 
                    class="form-textarea" 
                    rows="2"
                    placeholder="Any final notes or instructions for the HR team..."
                    [(ngModel)]="formData.comments"
                  ></textarea>
                </div>
              </div>

              <!-- Agreement Checkbox -->
              <label class="agreement-checkbox">
                <input type="checkbox" [(ngModel)]="agreedToTerms" />
                <span class="checkmark"></span>
                <span class="agreement-text">
                  I confirm that all the information provided above is accurate and I authorize the offboarding process to begin.
                </span>
              </label>
            </div>
          }

          <!-- Form Actions -->
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="prevStep()" [disabled]="currentStep() === 1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            
            @if (currentStep() < 3) {
              <button class="btn btn-primary" (click)="nextStep()">
                Continue
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            } @else {
              <button class="btn btn-success" (click)="submitForm()" [disabled]="!agreedToTerms() || isSubmitting()">
                @if (isSubmitting()) {
                  <span class="btn-spinner"></span>
                  Processing...
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  Submit Offboarding
                }
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <div class="help-text">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Need help? Contact HR at <a href="mailto:hr@company.com">hr&#64;company.com</a>
      </div>
    </div>
  `,
  styles: [`
    /* CSS Variables */
    :host {
      --primary-50: #EEF2FF;
      --primary-100: #E0E7FF;
      --primary-200: #C7D2FE;
      --primary-300: #A5B4FC;
      --primary-400: #818CF8;
      --primary-500: #6366F1;
      --primary-600: #4F46E5;
      --primary-700: #4338CA;
      
      --success-50: #ECFDF5;
      --success-100: #D1FAE5;
      --success-500: #10B981;
      --success-600: #059669;
      
      --slate-50: #F8FAFC;
      --slate-100: #F1F5F9;
      --slate-200: #E2E8F0;
      --slate-300: #CBD5E1;
      --slate-400: #94A3B8;
      --slate-500: #64748B;
      --slate-600: #475569;
      --slate-700: #334155;
      --slate-800: #1E293B;
      --slate-900: #0F172A;
      
      --red-50: #FEF2F2;
      --red-500: #EF4444;
      --red-600: #DC2626;
      
      --warning-50: #FFFBEB;
      --warning-500: #F59E0B;
      
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Host Styles */
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--slate-50) 0%, #EEF2FF 50%, var(--slate-100) 100%);
      font-family: var(--font-family);
      position: relative;
      overflow-x: hidden;
    }

    /* Background Decoration */
    .bg-decoration {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 20s ease-in-out infinite;
    }

    .bg-orb-1 {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, var(--primary-200), var(--primary-100));
      top: -200px;
      right: -200px;
    }

    .bg-orb-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, var(--success-100), var(--primary-100));
      bottom: -100px;
      left: -100px;
      animation-delay: -7s;
    }

    .bg-orb-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, var(--warning-50), var(--primary-50));
      top: 50%;
      left: 50%;
      animation-delay: -14s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(20px, 30px) scale(1.02); }
    }

    /* Main Container */
    .initiate-offboarding-page {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }

    /* Header */
    .page-header {
      margin-bottom: 32px;
    }

    .header-nav {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .back-btn {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border: none;
      background: white;
      border-radius: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
      transition: all var(--transition-normal);
    }

    .back-btn:hover {
      transform: translateX(-4px);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    }

    .back-btn-inner {
      color: var(--slate-600);
      display: flex;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--primary-100);
      color: var(--primary-600);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--slate-900);
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--slate-900) 0%, var(--slate-700) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 15px;
      color: var(--slate-500);
      margin: 0;
      line-height: 1.6;
    }

    /* Progress Container */
    .progress-container {
      background: white;
      border-radius: 20px;
      padding: 24px 32px;
      margin-bottom: 24px;
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    .progress-track {
      height: 6px;
      background: var(--slate-100);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
      border-radius: 10px;
      transition: width var(--transition-slow);
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .step-indicator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--slate-100);
      color: var(--slate-400);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      transition: all var(--transition-normal);
      border: 3px solid transparent;
    }

    .progress-step.active .step-indicator {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    }

    .progress-step.completed .step-indicator {
      background: linear-gradient(135deg, var(--success-500), var(--success-600));
      color: white;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
    }

    .progress-step.current .step-indicator {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); }
      50% { box-shadow: 0 4px 24px rgba(99, 102, 241, 0.6); }
    }

    .step-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-400);
      transition: all var(--transition-fast);
    }

    .progress-step.active .step-label,
    .progress-step.completed .step-label {
      color: var(--slate-700);
    }

    .step-connector {
      flex: 1;
      height: 3px;
      background: var(--slate-200);
      margin: 0 12px;
      margin-bottom: 28px;
      border-radius: 10px;
      transition: all var(--transition-normal);
    }

    .step-connector.active {
      background: linear-gradient(90deg, var(--success-500), var(--success-600));
    }

    /* Form Card */
    .form-container {
      margin-bottom: 24px;
    }

    .form-card {
      background: white;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.8);
      overflow: hidden;
      position: relative;
    }

    .form-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-400), var(--primary-500));
      background-size: 200% 100%;
      animation: gradient-shift 3s ease infinite;
    }

    .form-card.step-2::before {
      background: linear-gradient(90deg, var(--primary-600), var(--primary-500), var(--primary-600));
    }

    .form-card.step-3::before {
      background: linear-gradient(90deg, var(--success-500), var(--success-400), var(--success-500));
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Step Content */
    .step-content {
      padding: 32px;
    }

    .animate-in {
      animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Step Header */
    .step-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
    }

    .step-icon-wrapper {
      flex-shrink: 0;
    }

    .step-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
    }

    .step-icon-wrapper.success .step-icon {
      background: linear-gradient(135deg, var(--success-100), var(--success-50));
      color: var(--success-600);
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
    }

    .step-title-group {
      padding-top: 4px;
    }

    .step-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--slate-900);
      margin: 0 0 6px 0;
      letter-spacing: -0.01em;
    }

    .step-description {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0;
      line-height: 1.5;
    }

    /* Employee Search */
    .employee-search-container {
      position: relative;
      margin-bottom: 24px;
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400);
    }

    .search-input {
      width: 100%;
      padding: 16px 48px 16px 48px;
      border: 2px solid var(--slate-200);
      border-radius: 14px;
      font-size: 15px;
      font-family: inherit;
      transition: all var(--transition-fast);
      background: var(--slate-50);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-400);
      background: white;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .search-input::placeholder {
      color: var(--slate-400);
    }

    .search-clear {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--slate-200);
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--slate-500);
      transition: all var(--transition-fast);
    }

    .search-clear:hover {
      background: var(--slate-300);
      color: var(--slate-700);
    }

    .dropdown-list {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border: 2px solid var(--slate-200);
      border-radius: 16px;
      max-height: 320px;
      overflow-y: auto;
      box-shadow: 0 16px 48px rgba(15, 23, 42, 0.15);
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--transition-fast);
    }

    .dropdown-list.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      cursor: pointer;
      transition: all var(--transition-fast);
      border-bottom: 1px solid var(--slate-100);
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background: var(--primary-50);
    }

    .dropdown-item.selected {
      background: var(--primary-50);
      border-left: 3px solid var(--primary-500);
    }

    .emp-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .emp-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .emp-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-800);
    }

    .emp-meta {
      font-size: 12px;
      color: var(--slate-500);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .emp-status {
      flex-shrink: 0;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .status-active {
      background: var(--success-100);
      color: var(--success-600);
    }

    .status-inactive {
      background: var(--slate-100);
      color: var(--slate-500);
    }

    .check-icon {
      color: var(--primary-500);
      flex-shrink: 0;
    }

    .dropdown-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: var(--slate-400);
      gap: 12px;
    }

    /* Employee Preview Card */
    .employee-preview-card {
      background: linear-gradient(135deg, var(--slate-50), var(--primary-50));
      border: 2px solid var(--primary-200);
      border-radius: 20px;
      padding: 24px;
      animation: slideIn 0.4s ease-out;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--primary-200);
    }

    .preview-avatar {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .preview-info {
      flex: 1;
    }

    .preview-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--slate-900);
      margin: 0 0 4px 0;
    }

    .preview-id {
      font-size: 13px;
      color: var(--slate-500);
      margin: 0;
    }

    .preview-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--success-100);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: var(--success-600);
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      background: var(--success-500);
      border-radius: 50%;
      animation: blink 2s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .preview-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--slate-200);
      transition: all var(--transition-fast);
    }

    .preview-item:hover {
      border-color: var(--primary-300);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }

    .preview-item.highlight {
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border-color: var(--primary-200);
    }

    .preview-item-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--primary-100);
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .preview-item-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preview-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .preview-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-800);
    }

    /* Mini Employee Card */
    .mini-employee-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--slate-50);
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid var(--slate-200);
    }

    .mini-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
    }

    .mini-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .mini-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-800);
    }

    .mini-meta {
      font-size: 12px;
      color: var(--slate-500);
    }

    .edit-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-600);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .edit-btn:hover {
      background: var(--primary-50);
      border-color: var(--primary-300);
      color: var(--primary-600);
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
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--slate-700);
    }

    .form-label svg {
      color: var(--slate-400);
    }

    .required {
      color: var(--red-500);
    }

    .form-input,
    .form-textarea {
      padding: 14px 16px;
      border: 2px solid var(--slate-200);
      border-radius: 12px;
      font-size: 14px;
      font-family: inherit;
      transition: all var(--transition-fast);
      background: white;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--slate-400);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .select-wrapper {
      position: relative;
    }

    .form-select {
      width: 100%;
      padding: 14px 40px 14px 16px;
      border: 2px solid var(--slate-200);
      border-radius: 12px;
      font-size: 14px;
      font-family: inherit;
      appearance: none;
      background: white;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .form-select:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .select-arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400);
      pointer-events: none;
    }

    /* Summary Card */
    .summary-card {
      background: linear-gradient(135deg, var(--slate-50), white);
      border: 2px solid var(--slate-200);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--slate-200);
    }

    .summary-avatar {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .summary-info {
      flex: 1;
    }

    .summary-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--slate-900);
      margin: 0 0 4px 0;
    }

    .summary-id {
      font-size: 13px;
      color: var(--slate-500);
      margin-right: 12px;
    }

    .summary-position {
      font-size: 13px;
      color: var(--slate-500);
    }

    .summary-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-600);
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .summary-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--slate-200);
      transition: all var(--transition-fast);
    }

    .summary-item:hover {
      border-color: var(--primary-200);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
    }

    .summary-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary-100), var(--primary-50));
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-800);
    }

    .summary-reason,
    .summary-remarks {
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--slate-200);
      margin-bottom: 16px;
    }

    .reason-header,
    .remarks-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-600);
      margin-bottom: 10px;
    }

    .reason-text,
    .remarks-text {
      font-size: 14px;
      color: var(--slate-700);
      margin: 0;
      line-height: 1.6;
    }

    .summary-comments {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Agreement Checkbox */
    .agreement-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px;
      background: var(--warning-50);
      border: 2px solid #FCD34D;
      border-radius: 14px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .agreement-checkbox:hover {
      background: #FEF3C7;
    }

    .agreement-checkbox input {
      width: 22px;
      height: 22px;
      margin-top: 2px;
      cursor: pointer;
      accent-color: var(--primary-500);
    }

    .agreement-text {
      font-size: 14px;
      color: var(--slate-700);
      line-height: 1.6;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 32px;
      border-top: 2px solid var(--slate-100);
      background: var(--slate-50);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all var(--transition-normal);
      text-transform: none;
      letter-spacing: 0;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: var(--slate-700);
      border: 2px solid var(--slate-200);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--slate-50);
      border-color: var(--slate-300);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
    }

    .btn-success {
      background: linear-gradient(135deg, var(--success-500), var(--success-600));
      color: white;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
    }

    .btn-success:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--success-600), #047857);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
    }

    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Help Text */
    .help-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      color: var(--slate-500);
    }

    .help-text a {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
    }

    .help-text a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .initiate-offboarding-page {
        padding: 20px 16px 40px;
      }

      .page-title {
        font-size: 26px;
      }

      .progress-container {
        padding: 20px;
      }

      .progress-steps {
        flex-wrap: wrap;
        gap: 16px;
        justify-content: center;
      }

      .step-connector {
        display: none;
      }

      .step-content {
        padding: 24px;
      }

      .step-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .preview-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-group.full-width {
        grid-column: span 1;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }

      .summary-header {
        flex-direction: column;
        text-align: center;
      }

      .preview-header {
        flex-direction: column;
        text-align: center;
      }

      .preview-status {
        justify-content: center;
      }

      .form-actions {
        flex-direction: column;
        gap: 12px;
        padding: 20px;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class InitiateOffboardingComponent {
  private router: Router;

  readonly currentStep = signal(1);
  readonly isSubmitting = signal(false);
  readonly selectedEmployeeId = signal('');
  readonly agreedToTerms = signal(false);
  readonly searchQuery = signal('');
  showDropdown = false;

  readonly steps = [
    { number: 1, label: 'Employee Selection' },
    { number: 2, label: 'Separation Details' },
    { number: 3, label: 'Review & Submit' }
  ];

  readonly progressPercentage = computed(() => {
    return ((this.currentStep() - 1) / (this.steps.length - 1)) * 100;
  });

  readonly minDate = new Date().toISOString().split('T')[0];

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

  readonly filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.employeeOptions;
    return this.employeeOptions.filter(emp => 
      emp.name.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query)
    );
  });

  employeeOptions: Employee[] = [
    { id: 'EMP001', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', position: 'Senior Software Engineer', department: 'Engineering', manager: 'Michael Chen', joiningDate: '2021-03-15', status: 'Active' },
    { id: 'EMP002', name: 'David Williams', email: 'david.williams@company.com', position: 'Product Manager', department: 'Product', manager: 'Lisa Anderson', joiningDate: '2020-08-22', status: 'Active' },
    { id: 'EMP003', name: 'Emily Davis', email: 'emily.davis@company.com', position: 'UX Designer', department: 'Design', manager: 'James Wilson', joiningDate: '2022-01-10', status: 'Active' },
    { id: 'EMP004', name: 'Robert Brown', email: 'robert.brown@company.com', position: 'Marketing Lead', department: 'Marketing', manager: 'Jennifer Taylor', joiningDate: '2019-11-05', status: 'Active' },
    { id: 'EMP005', name: 'Amanda Martinez', email: 'amanda.martinez@company.com', position: 'HR Specialist', department: 'Human Resources', manager: 'Tom Harris', joiningDate: '2021-06-18', status: 'Active' },
    { id: 'EMP006', name: 'Christopher Lee', email: 'christopher.lee@company.com', position: 'Financial Analyst', department: 'Finance', manager: 'Patricia Moore', joiningDate: '2020-04-12', status: 'Active' },
    { id: 'EMP007', name: 'Jessica Thompson', email: 'jessica.thompson@company.com', position: 'Sales Executive', department: 'Sales', manager: 'Daniel Garcia', joiningDate: '2022-07-01', status: 'Active' },
    { id: 'EMP008', name: 'Matthew Anderson', email: 'matthew.anderson@company.com', position: 'DevOps Engineer', department: 'Engineering', manager: 'Michael Chen', joiningDate: '2021-09-28', status: 'Active' },
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

  private avatarColors = [
    'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    'linear-gradient(135deg, #D299C2 0%, #FEF9D7 100%)',
    'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)'
  ];

  constructor(router: Router) {
    this.router = router;
    
    // Close dropdown when clicking outside
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.employee-search-container')) {
          this.showDropdown = false;
        }
      });
    }
  }

  selectEmployee(emp: Employee): void {
    this.selectedEmployeeId.set(emp.id);
    this.showDropdown = false;
    this.searchQuery.set('');

    // Auto-fill all employee details
    this.formData.employeeId = emp.id;
    this.formData.employeeName = emp.name;
    this.formData.employeeEmail = emp.email;
    this.formData.position = emp.position;
    this.formData.department = emp.department;
    this.formData.manager = emp.manager;
    this.formData.joiningDate = emp.joiningDate;
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.showDropdown = true;
  }

  getSelectedEmployee(): Employee | undefined {
    return this.employeeOptions.find(e => e.id === this.selectedEmployeeId());
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getAvatarColor(name: string): string {
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.avatarColors.length;
    return this.avatarColors[index];
  }

  calculateTenure(joiningDate: string): string {
    if (!joiningDate) return 'N/A';
    const join = new Date(joiningDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    const totalMonths = years * 12 + months;
    
    if (totalMonths < 1) return 'Less than a month';
    if (totalMonths === 1) return '1 month';
    if (totalMonths < 12) return `${totalMonths} months`;
    
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    if (m === 0) return `${y} year${y > 1 ? 's' : ''}`;
    return `${y} year${y > 1 ? 's' : ''} ${m} month${m > 1 ? 's' : ''}`;
  }

  getSeparationTypeLabel(value: string): string {
    const type = this.separationTypeOptions.find(t => t.value === value);
    return type ? type.label : value;
  }

  nextStep(): void {
    if (this.currentStep() === 1 && !this.selectedEmployeeId()) {
      window.alert('Please select an employee first.');
      return;
    }
    if (this.currentStep() === 2 && (!this.formData.lastWorkingDay || !this.formData.separationType || !this.formData.reason)) {
      window.alert('Please fill in all required fields.');
      return;
    }
    if (this.currentStep() < 3) {
      this.currentStep.update(v => v + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/offboarding']);
  }

  submitForm(): void {
    if (!this.agreedToTerms()) {
      window.alert('Please agree to the terms before submitting.');
      return;
    }
    
    this.isSubmitting.set(true);
    
    setTimeout(() => {
      this.isSubmitting.set(false);
      console.log('Offboarding submitted:', this.formData);
      this.router.navigate(['/offboarding']);
    }, 2000);
  }
}