import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent, BadgeComponent, CardComponent } from '../../../../shared/components/ui-components';

@Component({
  selector: 'knodtec-employee-view',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TitleCasePipe,
    ButtonComponent,
    BadgeComponent,
    CardComponent
  ],
  template: `
    <div class="employee-view-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div>
            <h1 class="page-title">Employee Profile</h1>
            <p class="page-subtitle">View and manage employee information</p>
          </div>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="downloadIcon">Download Profile</knod-button>
          <knod-button variant="primary" [icon]="editIcon" (click)="editEmployee()">Edit Employee</knod-button>
        </div>
      </div>

      @if (employee()) {
        <!-- Employee Overview Card -->
        <div class="overview-card">
          <div class="profile-section">
            <div class="profile-photo">
              @if (employee()?.profilePhoto) {
                <img [src]="employee()?.profilePhoto" alt="Profile Photo" />
              } @else {
                <div class="profile-initials">{{ getInitials() }}</div>
              }
            </div>
            <div class="profile-info">
              <h2 class="emp-name">{{ employee()?.firstName }} {{ employee()?.middleName }} {{ employee()?.lastName }}</h2>
              <p class="emp-designation">{{ employee()?.designation }}</p>
              <div class="emp-meta">
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {{ employee()?.department }}
                </span>
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ employee()?.workLocation }}
                </span>
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Joined {{ employee()?.dateOfJoining | date:'mediumDate' }}
                </span>
              </div>
            </div>
          </div>
          <div class="status-section">
            <knod-badge [color]="getStatusColor()" size="lg">{{ employee()?.status | titlecase }}</knod-badge>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-nav">
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'personal'"
            (click)="activeTab.set('personal')">
            Personal
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'address'"
            (click)="activeTab.set('address')">
            Address
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'education'"
            (click)="activeTab.set('education')">
            Education
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'experience'"
            (click)="activeTab.set('experience')">
            Experience
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'skills'"
            (click)="activeTab.set('skills')">
            Skills
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'visa'"
            (click)="activeTab.set('visa')">
            Visa
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'bank'"
            (click)="activeTab.set('bank')">
            Bank
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'emergency'"
            (click)="activeTab.set('emergency')">
            Emergency
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'employment'"
            (click)="activeTab.set('employment')">
            Employment
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'documents'"
            (click)="activeTab.set('documents')">
            Documents
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          
          <!-- Personal Information Tab -->
          @if (activeTab() === 'personal') {
            <div class="content-card">
              <h3 class="card-title">Personal Information</h3>
              
              <div class="info-section">
                <h4 class="section-label">Basic Details</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">First Name</span>
                    <span class="info-value">{{ employee()?.firstName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Middle Name</span>
                    <span class="info-value">{{ employee()?.middleName || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Last Name</span>
                    <span class="info-value">{{ employee()?.lastName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Personal Email</span>
                    <span class="info-value">{{ employee()?.personalEmail || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Mobile Number</span>
                    <span class="info-value">{{ employee()?.mobileNumber }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Date of Birth</span>
                    <span class="info-value">{{ employee()?.dateOfBirth | date:'mediumDate' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Place of Birth</span>
                    <span class="info-value">{{ employee()?.placeOfBirth || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Gender</span>
                    <span class="info-value">{{ employee()?.gender || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Marital Status</span>
                    <span class="info-value">{{ employee()?.maritalStatus || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Nationality</span>
                    <span class="info-value">{{ employee()?.nationality || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Blood Group</span>
                    <span class="info-value">{{ employee()?.bloodGroup || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Languages Known</span>
                    <span class="info-value">{{ employee()?.languagesKnown || '-' }}</span>
                  </div>
                  <div class="info-item full-width">
                    <span class="info-label">LinkedIn Profile</span>
                    <span class="info-value">
                      @if (employee()?.linkedInProfile) {
                        <a [href]="employee()?.linkedInProfile" target="_blank">{{ employee()?.linkedInProfile }}</a>
                      } @else {
                        -
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h4 class="section-label">Government Identity Details</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Aadhaar Number</span>
                    <span class="info-value">{{ employee()?.aadhaarNumber || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">PAN Number</span>
                    <span class="info-value">{{ employee()?.panNumber || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Passport Number</span>
                    <span class="info-value">{{ employee()?.passportNumber || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Driving License Number</span>
                    <span class="info-value">{{ employee()?.drivingLicenseNumber || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h4 class="section-label">Employment / Government Account Details</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">PF Account Number (UAN)</span>
                    <span class="info-value">{{ employee()?.pfAccountNumber || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">ESI Number</span>
                    <span class="info-value">{{ employee()?.esiNumber || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Address Information Tab -->
          @if (activeTab() === 'address') {
            <div class="content-card">
              <h3 class="card-title">Address Information</h3>
              
              <div class="info-section">
                <h4 class="section-label">Current Address</h4>
                <div class="info-grid">
                  <div class="info-item full-width">
                    <span class="info-label">Address</span>
                    <span class="info-value">
                      {{ employee()?.currentAddressLine1 || '-' }}
                      @if (employee()?.currentAddressLine2) { , {{ employee()?.currentAddressLine2 }} }
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">City</span>
                    <span class="info-value">{{ employee()?.currentCity || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">State</span>
                    <span class="info-value">{{ employee()?.currentState || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Country</span>
                    <span class="info-value">{{ employee()?.currentCountry || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Postal Code</span>
                    <span class="info-value">{{ employee()?.currentPostalCode || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h4 class="section-label">Permanent Address</h4>
                <div class="info-grid">
                  <div class="info-item full-width">
                    <span class="info-label">Address</span>
                    <span class="info-value">
                      {{ employee()?.permanentAddressLine1 || '-' }}
                      @if (employee()?.permanentAddressLine2) { , {{ employee()?.permanentAddressLine2 }} }
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">City</span>
                    <span class="info-value">{{ employee()?.permanentCity || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">State</span>
                    <span class="info-value">{{ employee()?.permanentState || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Country</span>
                    <span class="info-value">{{ employee()?.permanentCountry || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Postal Code</span>
                    <span class="info-value">{{ employee()?.permanentPostalCode || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Education Tab -->
          @if (activeTab() === 'education') {
            <div class="content-card">
              <h3 class="card-title">Education Details</h3>
              
              @if (employee()?.education && employee()!.education.length > 0) {
                @for (edu of employee()?.education; track $index; let i = $index) {
                  <div class="entry-card">
                    <h4 class="entry-title">Education {{ i + 1 }}</h4>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Qualification Level</span>
                        <span class="info-value">{{ edu.qualificationLevel || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Degree Name</span>
                        <span class="info-value">{{ edu.degreeName || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Institution Name</span>
                        <span class="info-value">{{ edu.institutionName || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">University/Board</span>
                        <span class="info-value">{{ edu.university || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Specialization</span>
                        <span class="info-value">{{ edu.specialization || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Percentage / CGPA</span>
                        <span class="info-value">{{ edu.percentage || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Start Year</span>
                        <span class="info-value">{{ edu.startYear || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">End Year</span>
                        <span class="info-value">{{ edu.endYear || '-' }}</span>
                      </div>
                    </div>
                    @if (edu.document) {
                      <div class="document-preview">
                        <span class="doc-icon">📄</span>
                        <span class="doc-name">Supporting Document</span>
                        <button class="doc-action">Preview</button>
                      </div>
                    }
                  </div>
                }
              } @else {
                <div class="empty-state">
                  <p>No education records found.</p>
                </div>
              }
            </div>
          }

          <!-- Experience Tab -->
          @if (activeTab() === 'experience') {
            <div class="content-card">
              <h3 class="card-title">Experience Details</h3>
              
              @if (employee()?.experience && employee()!.experience.length > 0) {
                @for (exp of employee()?.experience; track $index; let i = $index) {
                  <div class="entry-card">
                    <h4 class="entry-title">Experience {{ i + 1 }}</h4>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">Company Name</span>
                        <span class="info-value">{{ exp.companyName || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Designation</span>
                        <span class="info-value">{{ exp.designation || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Employment Type</span>
                        <span class="info-value">{{ exp.employmentType || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Start Date</span>
                        <span class="info-value">{{ exp.startDate ? (exp.startDate | date:'mediumDate') : '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">End Date</span>
                        <span class="info-value">{{ exp.endDate ? (exp.endDate | date:'mediumDate') : '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Technologies/Skills</span>
                        <span class="info-value">{{ exp.technologies || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Current CTC</span>
                        <span class="info-value">{{ exp.currentCtc || '-' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Last Drawn Salary</span>
                        <span class="info-value">{{ exp.lastDrawnSalary || '-' }}</span>
                      </div>
                    </div>
                  </div>
                }
              } @else {
                <div class="empty-state">
                  <p>No experience records found.</p>
                </div>
              }
            </div>
          }

          <!-- Skills Tab -->
          @if (activeTab() === 'skills') {
            <div class="content-card">
              <h3 class="card-title">Skills & Certifications</h3>
              
              <div class="info-section">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Primary Skills</span>
                    <div class="skills-list">
                      @if (employee()?.primarySkills) {
                        @for (skill of employee()?.primarySkills.split(', '); track skill) {
                          <span class="skill-tag">{{ skill }}</span>
                        }
                      } @else {
                        <span class="info-value">-</span>
                      }
                    </div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Secondary Skills</span>
                    <div class="skills-list">
                      @if (employee()?.secondarySkills) {
                        @for (skill of employee()?.secondarySkills.split(', '); track skill) {
                          <span class="skill-tag secondary">{{ skill }}</span>
                        }
                      } @else {
                        <span class="info-value">-</span>
                      }
                    </div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Certifications</span>
                    <div class="skills-list">
                      @if (employee()?.certifications) {
                        @for (cert of employee()?.certifications.split(', '); track cert) {
                          <span class="cert-tag">{{ cert }}</span>
                        }
                      } @else {
                        <span class="info-value">-</span>
                      }
                    </div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Certification Expiry</span>
                    <span class="info-value">{{ employee()?.certificationExpiry ? (employee()!.certificationExpiry | date:'mediumDate') : '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Visa Tab -->
          @if (activeTab() === 'visa') {
            <div class="content-card">
              <h3 class="card-title">Visa & Immigration Information</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Visa Type</span>
                  <span class="info-value">{{ employee()?.visaType || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Visa Number</span>
                  <span class="info-value">{{ employee()?.visaNumber || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Country</span>
                  <span class="info-value">{{ employee()?.visaCountry || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Issue Date</span>
                  <span class="info-value">{{ employee()?.visaIssueDate ? (employee()!.visaIssueDate | date:'mediumDate') : '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Expiry Date</span>
                  <span class="info-value">{{ employee()?.visaExpiryDate ? (employee()!.visaExpiryDate | date:'mediumDate') : '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Work Authorization Status</span>
                  <span class="info-value">{{ employee()?.workAuthorizationStatus || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Sponsorship Required</span>
                  <span class="info-value">{{ employee()?.sponsorshipRequired || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Passport Expiry Date</span>
                  <span class="info-value">{{ employee()?.passportExpiryDate ? (employee()!.passportExpiryDate | date:'mediumDate') : '-' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Bank Tab -->
          @if (activeTab() === 'bank') {
            <div class="content-card">
              <h3 class="card-title">Bank Details</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Account Holder Name</span>
                  <span class="info-value">{{ employee()?.bankAccountHolderName || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Bank Name</span>
                  <span class="info-value">{{ employee()?.bankName || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Branch Name</span>
                  <span class="info-value">{{ employee()?.bankBranchName || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Account Number</span>
                  <span class="info-value">{{ employee()?.bankAccountNumber || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">IFSC Code</span>
                  <span class="info-value">{{ employee()?.ifscCode || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Account Type</span>
                  <span class="info-value">{{ employee()?.bankAccountType || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">UPI ID</span>
                  <span class="info-value">{{ employee()?.upiId || '-' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Emergency Contact Tab -->
          @if (activeTab() === 'emergency') {
            <div class="content-card">
              <h3 class="card-title">Emergency Contact</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Contact Name</span>
                  <span class="info-value">{{ employee()?.emergencyContactName || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Relationship</span>
                  <span class="info-value">{{ employee()?.emergencyContactRelationship || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone Number</span>
                  <span class="info-value">{{ employee()?.emergencyContactPhone || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Alternate Number</span>
                  <span class="info-value">{{ employee()?.emergencyContactAltPhone || '-' }}</span>
                </div>
                <div class="info-item full-width">
                  <span class="info-label">Address</span>
                  <span class="info-value">{{ employee()?.emergencyContactAddress || '-' }}</span>
                </div>
                <div class="info-item full-width">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ employee()?.emergencyContactEmail || '-' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Employment Tab -->
          @if (activeTab() === 'employment') {
            <div class="content-card">
              <h3 class="card-title">Employment Information</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Employee ID</span>
                  <span class="info-value">{{ employee()?.employeeId || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Department</span>
                  <span class="info-value">{{ employee()?.department || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Designation</span>
                  <span class="info-value">{{ employee()?.designation || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Reporting Manager</span>
                  <span class="info-value">{{ employee()?.reportingManager || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date of Joining</span>
                  <span class="info-value">{{ employee()?.dateOfJoining ? (employee()!.dateOfJoining | date:'mediumDate') : '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Employment Type</span>
                  <span class="info-value">{{ employee()?.employmentType || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Work Location</span>
                  <span class="info-value">{{ employee()?.workLocation || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Shift</span>
                  <span class="info-value">{{ employee()?.shift || '-' }}</span>
                </div>
              </div>
            </div>
          }

          <!-- Documents Tab -->
          @if (activeTab() === 'documents') {
            <div class="content-card">
              <h3 class="card-title">Documents</h3>
              
              <div class="documents-list">
                <div class="document-item">
                  <div class="doc-icon-large">📄</div>
                  <div class="doc-info">
                    <span class="doc-label">Resume/CV</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
                <div class="document-item">
                  <div class="doc-icon-large">🪪</div>
                  <div class="doc-info">
                    <span class="doc-label">Aadhaar Card</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
                <div class="document-item">
                  <div class="doc-icon-large">🪪</div>
                  <div class="doc-info">
                    <span class="doc-label">PAN Card</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
                <div class="document-item">
                  <div class="doc-icon-large">📘</div>
                  <div class="doc-info">
                    <span class="doc-label">Passport</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
                <div class="document-item">
                  <div class="doc-icon-large">🏦</div>
                  <div class="doc-info">
                    <span class="doc-label">Bank Passbook / Cancelled Cheque</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
                <div class="document-item">
                  <div class="doc-icon-large">📷</div>
                  <div class="doc-info">
                    <span class="doc-label">Profile Photo</span>
                    <span class="doc-status">Not uploaded</span>
                  </div>
                  <button class="doc-btn">Upload</button>
                </div>
              </div>
            </div>
          }

        </div>
      } @else {
        <div class="loading-state">
          <p>Loading employee data...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .employee-view-page {
      animation: fadeIn 300ms ease;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-6);
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
    }

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--bg-border);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      background: var(--bg-main);
      border-color: var(--primary-blue);
      color: var(--primary-blue);
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-1) 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    .overview-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-card);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-6);
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
    }

    .profile-photo {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-initials {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .emp-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .emp-designation {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .emp-meta {
      display: flex;
      gap: var(--spacing-4);
      margin-top: var(--spacing-2);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .status-section {
      display: flex;
      align-items: center;
    }

    .tab-nav {
      display: flex;
      gap: var(--spacing-2);
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2);
      box-shadow: var(--shadow-card);
      margin-bottom: var(--spacing-6);
      overflow-x: auto;
    }

    .tab-btn {
      padding: var(--spacing-3) var(--spacing-4);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .tab-btn:hover {
      background: var(--bg-main);
      color: var(--text-primary);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      color: white;
    }

    .content-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-card);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-5) 0;
      padding-bottom: var(--spacing-4);
      border-bottom: 1px solid var(--bg-border);
    }

    .info-section {
      margin-bottom: var(--spacing-6);
    }

    .info-section:last-child {
      margin-bottom: 0;
    }

    .section-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--spacing-3) 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-4);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .info-item.full-width {
      grid-column: span 1;
    }

    .info-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .info-value {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .info-value a {
      color: var(--primary-blue);
      text-decoration: none;
    }

    .info-value a:hover {
      text-decoration: underline;
    }

    .entry-card {
      background: var(--bg-main);
      border-radius: var(--radius-lg);
      padding: var(--spacing-5);
      margin-bottom: var(--spacing-4);
    }

    .entry-card:last-child {
      margin-bottom: 0;
    }

    .entry-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-4) 0;
    }

    .document-preview {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-top: var(--spacing-4);
      padding: var(--spacing-3);
      background: white;
      border-radius: var(--radius-md);
    }

    .doc-icon {
      font-size: var(--font-size-lg);
    }

    .doc-name {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .doc-action {
      padding: var(--spacing-2) var(--spacing-3);
      background: var(--primary-blue);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      cursor: pointer;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
    }

    .skill-tag {
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--primary-blue);
      color: white;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .skill-tag.secondary {
      background: var(--purple);
    }

    .cert-tag {
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--success-light);
      color: var(--success);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .documents-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background: var(--bg-main);
      border-radius: var(--radius-lg);
    }

    .doc-icon-large {
      font-size: var(--font-size-2xl);
    }

    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .doc-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .doc-status {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .doc-btn {
      padding: var(--spacing-2) var(--spacing-3);
      background: white;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .doc-btn:hover {
      background: var(--primary-blue);
      color: white;
      border-color: var(--primary-blue);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-6);
      color: var(--text-secondary);
    }

    .loading-state {
      text-align: center;
      padding: var(--spacing-10);
      color: var(--text-secondary);
    }

    @media (max-width: 1024px) {
      .info-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .documents-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .header-actions {
        width: 100%;
      }

      .overview-card {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
      }

      .profile-section {
        flex-direction: column;
        align-items: flex-start;
      }

      .emp-meta {
        flex-wrap: wrap;
      }

      .tab-nav {
        padding: var(--spacing-3);
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .documents-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeViewComponent implements OnInit {
  activeTab = signal('personal');
  employeeId = signal<string | null>(null);
  
  employee = signal<any>(null);

  downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  editIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId.set(id);
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string) {
    // Simulate loading employee data
    const mockEmployees: any[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        personalEmail: 'john.doe.personal@email.com',
        mobileNumber: '+91 98765 43210',
        department: 'Engineering',
        designation: 'Senior Engineer',
        reportingManager: 'Sarah Johnson',
        dateOfBirth: '1992-05-15',
        placeOfBirth: 'Mumbai',
        gender: 'Male',
        maritalStatus: 'Married',
        nationality: 'Indian',
        bloodGroup: 'O+',
        languagesKnown: 'English, Hindi, Marathi',
        linkedInProfile: 'https://linkedin.com/in/johndoe',
        profilePhoto: null,
        aadhaarNumber: 'XXXX XXXX XXXX',
        panNumber: 'ABCDE1234F',
        passportNumber: 'A1234567',
        drivingLicenseNumber: 'MH12 12345678901234',
        pfAccountNumber: '100123456789',
        esiNumber: '31-1234567-12345678',
        currentAddressLine1: '123, ABC Building',
        currentAddressLine2: 'Near XYZ Mall',
        currentCity: 'Mumbai',
        currentState: 'Maharashtra',
        currentCountry: 'India',
        currentPostalCode: '400001',
        permanentAddressLine1: '123, ABC Building',
        permanentAddressLine2: 'Near XYZ Mall',
        permanentCity: 'Mumbai',
        permanentState: 'Maharashtra',
        permanentCountry: 'India',
        permanentPostalCode: '400001',
        education: [{
          qualificationLevel: "Bachelor's",
          degreeName: 'B.Tech',
          institutionName: 'IIT Mumbai',
          university: 'Mumbai University',
          specialization: 'Computer Science',
          percentage: '85%',
          startYear: '2010',
          endYear: '2014',
          document: null
        }],
        experience: [{
          companyName: 'Tech Corp',
          designation: 'Software Engineer',
          employmentType: 'Full-time',
          startDate: '2014-06-01',
          endDate: '2020-12-31',
          technologies: 'Angular, Node.js, AWS',
          currentCtc: '20 LPA',
          lastDrawnSalary: '18 LPA'
        }],
        primarySkills: 'Angular, TypeScript, Node.js, AWS',
        secondarySkills: 'Python, Docker, Kubernetes',
        certifications: 'AWS Solutions Architect, PMP',
        certificationExpiry: '2027-06-15',
        visaType: 'Not Applicable',
        visaNumber: '',
        visaCountry: '',
        visaIssueDate: '',
        visaExpiryDate: '',
        workAuthorizationStatus: 'Authorized',
        sponsorshipRequired: 'No',
        passportExpiryDate: '2030-05-15',
        bankAccountHolderName: 'John Michael Doe',
        bankName: 'HDFC Bank',
        bankBranchName: 'Mumbai Main Branch',
        bankAccountNumber: 'XXXXXXXXXXXX1234',
        ifscCode: 'HDFC0001234',
        bankAccountType: 'Savings',
        upiId: 'johndoe@upi',
        emergencyContactName: 'Jane Doe',
        emergencyContactRelationship: 'Spouse',
        emergencyContactPhone: '+91 98765 43211',
        emergencyContactAltPhone: '+91 98765 43212',
        emergencyContactAddress: '456, PQR Building, Mumbai',
        emergencyContactEmail: 'jane.doe@email.com',
        dateOfJoining: '2024-01-15',
        employmentType: 'Full-time',
        workLocation: 'Mumbai',
        shift: 'Morning',
        status: 'active'
      }
    ];

    const emp = mockEmployees.find(e => e.id === id);
    if (emp) {
      this.employee.set(emp);
    } else {
      this.employee.set({
        id: id,
        employeeId: 'EMP' + id,
        firstName: 'Sample',
        lastName: 'Employee',
        email: 'sample@company.com',
        mobileNumber: '+91 98765 43210',
        department: 'Engineering',
        designation: 'Software Engineer',
        reportingManager: 'Manager Name',
        dateOfJoining: '2024-01-15',
        employmentType: 'Full-time',
        workLocation: 'Mumbai',
        status: 'active'
      });
    }
  }

  getInitials(): string {
    const emp = this.employee();
    if (!emp) return '';
    return `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getStatusColor(): 'green' | 'blue' | 'amber' | 'slate' {
    const status = this.employee()?.status;
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'slate'> = {
      'active': 'green',
      'onboarding': 'blue',
      'offboarding': 'amber',
      'inactive': 'slate'
    };
    return colors[status] || 'slate';
  }

  goBack(): void {
    this.router.navigate(['/workforce/employees']);
  }

  editEmployee(): void {
    const id = this.employeeId();
    if (id) {
      this.router.navigate(['/workforce/employees', id, 'edit']);
    }
  }
}