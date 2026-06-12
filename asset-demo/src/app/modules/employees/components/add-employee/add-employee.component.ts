import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent, BadgeComponent } from '../../../../shared/components/ui-components';

@Component({
  selector: 'knodtec-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    ButtonComponent,
    BadgeComponent
  ],
  template: `
    <div class="add-employee-page">
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
            <h1 class="page-title">{{ isEditMode() ? 'Edit Employee' : 'Add New Employee' }}</h1>
            <p class="page-subtitle">{{ isEditMode() ? 'Update employee information' : 'Fill in the details to add a new employee' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" (click)="goBack()">Cancel</knod-button>
          <knod-button variant="primary" (click)="saveEmployee()">{{ isEditMode() ? 'Update Employee' : 'Save Employee' }}</knod-button>
        </div>
      </div>

      <!-- Form Sections -->
      <div class="form-sections">
        <!-- Section Navigation -->
        <div class="section-nav">
          @for (section of sections; track section.id) {
            <button 
              class="section-nav-item" 
              [class.active]="activeSection() === section.id"
              (click)="activeSection.set(section.id)">
              <span class="section-number">{{ section.number }}</span>
              <span class="section-label">{{ section.label }}</span>
            </button>
          }
        </div>

        <!-- Section Content -->
        <div class="section-content">
          
          <!-- Section 1: Personal Information -->
          @if (activeSection() === 'personal') {
            <div class="section-panel">
              <h2 class="section-title">Personal Information</h2>
              
              <!-- Basic Details -->
              <div class="subsection">
                <h3 class="subsection-title">Basic Details</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">First Name <span class="required">*</span></label>
                    <input type="text" class="form-input" [(ngModel)]="employee.firstName" placeholder="Enter first name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Middle Name</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.middleName" placeholder="Enter middle name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Last Name <span class="required">*</span></label>
                    <input type="text" class="form-input" [(ngModel)]="employee.lastName" placeholder="Enter last name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Personal Email</label>
                    <input type="email" class="form-input" [(ngModel)]="employee.personalEmail" placeholder="personal@email.com" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Mobile Number <span class="required">*</span></label>
                    <input type="tel" class="form-input" [(ngModel)]="employee.mobileNumber" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date of Birth <span class="required">*</span></label>
                    <input type="date" class="form-input" [(ngModel)]="employee.dateOfBirth" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Place of Birth</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.placeOfBirth" placeholder="City, State" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Gender <span class="required">*</span></label>
                    <select class="form-input" [(ngModel)]="employee.gender">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Marital Status</label>
                    <select class="form-input" [(ngModel)]="employee.maritalStatus">
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Nationality</label>
                    <select class="form-input" [(ngModel)]="employee.nationality">
                      <option value="">Select Nationality</option>
                      <option value="Indian">Indian</option>
                      <option value="American">American</option>
                      <option value="British">British</option>
                      <option value="Canadian">Canadian</option>
                      <option value="Australian">Australian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Blood Group</label>
                    <select class="form-input" [(ngModel)]="employee.bloodGroup">
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Languages Known</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.languagesKnown" placeholder="English, Hindi, Tamil" />
                  </div>
                  <div class="form-group full-width">
                    <label class="form-label">LinkedIn Profile</label>
                    <input type="url" class="form-input" [(ngModel)]="employee.linkedInProfile" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Profile Photo</label>
                    <div class="file-upload">
                      <input type="file" id="profilePhoto" accept="image/*" (change)="onFileSelect($event, 'profilePhoto')" />
                      <label for="profilePhoto" class="file-upload-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Upload Photo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Government Identity Details -->
              <div class="subsection">
                <h3 class="subsection-title">Government Identity Details</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Aadhaar Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.aadhaarNumber" placeholder="XXXX XXXX XXXX" maxlength="14" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">PAN Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.panNumber" placeholder="ABCDE1234F" maxlength="10" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Passport Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.passportNumber" placeholder="A1234567" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Driving License Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.drivingLicenseNumber" placeholder="DL-12345678901234" />
                  </div>
                </div>
              </div>

              <!-- Employment/Government Account Details -->
              <div class="subsection">
                <h3 class="subsection-title">Employment / Government Account Details</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">PF Account Number (UAN)</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.pfAccountNumber" placeholder="100123456789" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">ESI Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.esiNumber" placeholder="31-1234567-12345678" />
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 2: Address Information -->
          @if (activeSection() === 'address') {
            <div class="section-panel">
              <h2 class="section-title">Address Information</h2>
              
              <!-- Current Address -->
              <div class="subsection">
                <h3 class="subsection-title">Current Address</h3>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label class="form-label">Address Line 1</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentAddressLine1" placeholder="House/Flat No, Street" />
                  </div>
                  <div class="form-group full-width">
                    <label class="form-label">Address Line 2</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentAddressLine2" placeholder="Area, Landmark" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentCity" placeholder="City" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">State</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentState" placeholder="State" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentCountry" placeholder="Country" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Postal Code</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.currentPostalCode" placeholder="123456" />
                  </div>
                </div>
              </div>

              <!-- Permanent Address -->
              <div class="subsection">
                <h3 class="subsection-title">Permanent Address</h3>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="sameAsCurrentAddress" (change)="onSameAsCurrentChange()" />
                    <span>Same as Current Address</span>
                  </label>
                </div>
                @if (!sameAsCurrentAddress) {
                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label class="form-label">Address Line 1</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentAddressLine1" placeholder="House/Flat No, Street" />
                    </div>
                    <div class="form-group full-width">
                      <label class="form-label">Address Line 2</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentAddressLine2" placeholder="Area, Landmark" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">City</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentCity" placeholder="City" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">State</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentState" placeholder="State" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Country</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentCountry" placeholder="Country" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Postal Code</label>
                      <input type="text" class="form-input" [(ngModel)]="employee.permanentPostalCode" placeholder="123456" />
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Section 3: Education Details -->
          @if (activeSection() === 'education') {
            <div class="section-panel">
              <h2 class="section-title">Education Details</h2>
              <div class="subsection">
                @for (edu of employee.education; track $index; let i = $index) {
                  <div class="education-entry">
                    <div class="entry-header">
                      <h4>Education {{ i + 1 }}</h4>
                      @if (employee.education.length > 1) {
                        <button class="remove-btn" (click)="removeEducation(i)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      }
                    </div>
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Qualification Level</label>
                        <select class="form-input" [(ngModel)]="edu.qualificationLevel">
                          <option value="">Select Level</option>
                          <option value="10th">10th</option>
                          <option value="12th">12th</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's">Bachelor's</option>
                          <option value="Master's">Master's</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Degree Name</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.degreeName" placeholder="e.g., B.Tech" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Institution Name</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.institutionName" placeholder="Institution name" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">University/Board</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.university" placeholder="University/Board name" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Specialization</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.specialization" placeholder="e.g., Computer Science" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Percentage / CGPA</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.percentage" placeholder="e.g., 85% or 8.5" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Start Year</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.startYear" placeholder="YYYY" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">End Year</label>
                        <input type="text" class="form-input" [(ngModel)]="edu.endYear" placeholder="YYYY" />
                      </div>
                      <div class="form-group full-width">
                        <label class="form-label">Supporting Document</label>
                        <div class="file-upload">
                          <input type="file" [id]="'eduDoc' + i" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'eduDoc' + i)" />
                          <label [for]="'eduDoc' + i" class="file-upload-label">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <span>Upload Document</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <button class="add-entry-btn" (click)="addEducation()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Another Education
                </button>
              </div>
            </div>
          }

          <!-- Section 4: Experience Details -->
          @if (activeSection() === 'experience') {
            <div class="section-panel">
              <h2 class="section-title">Experience Details</h2>
              <div class="subsection">
                @for (exp of employee.experience; track $index; let i = $index) {
                  <div class="experience-entry">
                    <div class="entry-header">
                      <h4>Experience {{ i + 1 }}</h4>
                      @if (employee.experience.length > 1) {
                        <button class="remove-btn" (click)="removeExperience(i)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      }
                    </div>
                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Company Name</label>
                        <input type="text" class="form-input" [(ngModel)]="exp.companyName" placeholder="Company name" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Designation</label>
                        <input type="text" class="form-input" [(ngModel)]="exp.designation" placeholder="Job title" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Employment Type</label>
                        <select class="form-input" [(ngModel)]="exp.employmentType">
                          <option value="">Select Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Intern">Intern</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-input" [(ngModel)]="exp.startDate" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-input" [(ngModel)]="exp.endDate" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Technologies/Skills Used</label>
                        <input type="text" class="form-input" [(ngModel)]="exp.technologies" placeholder="Java, Python, AWS" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Current CTC</label>
                        <input type="text" class="form-input" [(ngModel)]="exp.currentCtc" placeholder="12 LPA" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Last Drawn Salary</label>
                        <input type="text" class="form-input" [(ngModel)]="exp.lastDrawnSalary" placeholder="10 LPA" />
                      </div>
                    </div>
                  </div>
                }
                <button class="add-entry-btn" (click)="addExperience()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Another Experience
                </button>

                <!-- Supporting Documents -->
                <div class="subsection" style="margin-top: 24px;">
                  <h3 class="subsection-title">Supporting Documents</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Experience Letter</label>
                      <div class="file-upload">
                        <input type="file" id="expLetter" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'expLetter')" />
                        <label for="expLetter" class="file-upload-label">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Relieving Letter</label>
                      <div class="file-upload">
                        <input type="file" id="relievingLetter" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'relievingLetter')" />
                        <label for="relievingLetter" class="file-upload-label">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Salary Slips</label>
                      <div class="file-upload">
                        <input type="file" id="salarySlips" accept=".pdf,.jpg,.png" multiple (change)="onFileSelect($event, 'salarySlips')" />
                        <label for="salarySlips" class="file-upload-label">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 5: Skills & Certifications -->
          @if (activeSection() === 'skills') {
            <div class="section-panel">
              <h2 class="section-title">Skills & Certifications</h2>
              <div class="subsection">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Primary Skills</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.primarySkills" placeholder="Angular, TypeScript, Node.js" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Secondary Skills</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.secondarySkills" placeholder="Python, Docker, Kubernetes" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certifications</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.certifications" placeholder="AWS Solutions Architect, PMP" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certification Expiry Date</label>
                    <input type="date" class="form-input" [(ngModel)]="employee.certificationExpiry" />
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 6: Visa & Immigration -->
          @if (activeSection() === 'visa') {
            <div class="section-panel">
              <h2 class="section-title">Visa & Immigration Information</h2>
              <div class="subsection">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Visa Type</label>
                    <select class="form-input" [(ngModel)]="employee.visaType">
                      <option value="">Select Visa Type</option>
                      <option value="Tourist">Tourist</option>
                      <option value="Business">Business</option>
                      <option value="Work">Work</option>
                      <option value="Student">Student</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Visa Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.visaNumber" placeholder="Visa number" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.visaCountry" placeholder="Issuing country" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Issue Date</label>
                    <input type="date" class="form-input" [(ngModel)]="employee.visaIssueDate" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Expiry Date</label>
                    <input type="date" class="form-input" [(ngModel)]="employee.visaExpiryDate" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Work Authorization Status</label>
                    <select class="form-input" [(ngModel)]="employee.workAuthorizationStatus">
                      <option value="">Select Status</option>
                      <option value="Authorized">Authorized</option>
                      <option value="Pending">Pending</option>
                      <option value="Not Authorized">Not Authorized</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Sponsorship Required</label>
                    <select class="form-input" [(ngModel)]="employee.sponsorshipRequired">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Passport Expiry Date</label>
                    <input type="date" class="form-input" [(ngModel)]="employee.passportExpiryDate" />
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 7: Bank Details -->
          @if (activeSection() === 'bank') {
            <div class="section-panel">
              <h2 class="section-title">Bank Details</h2>
              <div class="subsection">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Account Holder Name</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.bankAccountHolderName" placeholder="As per bank records" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.bankName" placeholder="Bank name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Branch Name</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.bankBranchName" placeholder="Branch name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Account Number</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.bankAccountNumber" placeholder="Account number" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">IFSC Code</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.ifscCode" placeholder="SBIN0001234" maxlength="11" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Account Type</label>
                    <select class="form-input" [(ngModel)]="employee.bankAccountType">
                      <option value="">Select Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">UPI ID</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.upiId" placeholder="name@upi" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Cancelled Cheque Upload</label>
                    <div class="file-upload">
                      <input type="file" id="cancelledCheque" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'cancelledCheque')" />
                      <label for="cancelledCheque" class="file-upload-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Upload</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 8: Emergency Contact -->
          @if (activeSection() === 'emergency') {
            <div class="section-panel">
              <h2 class="section-title">Emergency Contact</h2>
              <div class="subsection">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Contact Name</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.emergencyContactName" placeholder="Full name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Relationship</label>
                    <select class="form-input" [(ngModel)]="employee.emergencyContactRelationship">
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" [(ngModel)]="employee.emergencyContactPhone" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Alternate Number</label>
                    <input type="tel" class="form-input" [(ngModel)]="employee.emergencyContactAltPhone" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div class="form-group full-width">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.emergencyContactAddress" placeholder="Full address" />
                  </div>
                  <div class="form-group full-width">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" [(ngModel)]="employee.emergencyContactEmail" placeholder="email@example.com" />
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 9: Employment Information -->
          @if (activeSection() === 'employment') {
            <div class="section-panel">
              <h2 class="section-title">Employment Information</h2>
              <div class="subsection">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Employee ID</label>
                    <input type="text" class="form-input" [(ngModel)]="employee.employeeId" placeholder="Auto-generated or custom ID" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <select class="form-input" [(ngModel)]="employee.department">
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Designation</label>
                    <select class="form-input" [(ngModel)]="employee.designation">
                      <option value="">Select Designation</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Senior Engineer">Senior Engineer</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Designer">Designer</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Reporting Manager</label>
                    <select class="form-input" [(ngModel)]="employee.reportingManager">
                      <option value="">Select Manager</option>
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="Alex Chen">Alex Chen</option>
                      <option value="Emily Davis">Emily Davis</option>
                      <option value="Robert Wilson">Robert Wilson</option>
                      <option value="Michael Brown">Michael Brown</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date of Joining</label>
                    <input type="date" class="form-input" [(ngModel)]="employee.dateOfJoining" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Employment Type</label>
                    <select class="form-input" [(ngModel)]="employee.employmentType">
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Work Location</label>
                    <select class="form-input" [(ngModel)]="employee.workLocation">
                      <option value="">Select Location</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Shift</label>
                    <select class="form-input" [(ngModel)]="employee.shift">
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning (9 AM - 6 PM)</option>
                      <option value="Evening">Evening (2 PM - 11 PM)</option>
                      <option value="Night">Night (10 PM - 7 AM)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Section 10: General Documents -->
          @if (activeSection() === 'documents') {
            <div class="section-panel">
              <h2 class="section-title">General Documents Upload</h2>
              <p class="section-hint">Supported formats: PDF, JPG, PNG</p>
              <div class="subsection">
                <div class="documents-grid">
                  <div class="document-upload">
                    <label class="document-label">Resume/CV</label>
                    <div class="file-upload large">
                      <input type="file" id="resume" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'resume')" />
                      <label for="resume" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Upload Resume/CV</span>
                        <small>PDF, JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                  <div class="document-upload">
                    <label class="document-label">Aadhaar Card</label>
                    <div class="file-upload large">
                      <input type="file" id="aadhaarCard" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'aadhaarCard')" />
                      <label for="aadhaarCard" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Upload Aadhaar Card</span>
                        <small>PDF, JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                  <div class="document-upload">
                    <label class="document-label">PAN Card</label>
                    <div class="file-upload large">
                      <input type="file" id="panCard" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'panCard')" />
                      <label for="panCard" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Upload PAN Card</span>
                        <small>PDF, JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                  <div class="document-upload">
                    <label class="document-label">Passport</label>
                    <div class="file-upload large">
                      <input type="file" id="passport" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'passport')" />
                      <label for="passport" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Upload Passport</span>
                        <small>PDF, JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                  <div class="document-upload">
                    <label class="document-label">Bank Passbook / Cancelled Cheque</label>
                    <div class="file-upload large">
                      <input type="file" id="bankPassbook" accept=".pdf,.jpg,.png" (change)="onFileSelect($event, 'bankPassbook')" />
                      <label for="bankPassbook" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Upload Bank Passbook</span>
                        <small>PDF, JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                  <div class="document-upload">
                    <label class="document-label">Profile Photo</label>
                    <div class="file-upload large">
                      <input type="file" id="profilePhotoDoc" accept="image/*" (change)="onFileSelect($event, 'profilePhotoDoc')" />
                      <label for="profilePhotoDoc" class="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Upload Profile Photo</span>
                        <small>JPG, PNG</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Navigation Buttons -->
          <div class="section-actions">
            @if (activeSection() !== 'personal') {
              <knod-button variant="outline" (click)="previousSection()">Previous</knod-button>
            }
            @if (activeSection() !== 'documents') {
              <knod-button variant="primary" (click)="nextSection()">Next</knod-button>
            }
            @if (activeSection() === 'documents') {
              <knod-button variant="primary" (click)="saveEmployee()">{{ isEditMode() ? 'Update Employee' : 'Save Employee' }}</knod-button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-employee-page {
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

    .form-sections {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--spacing-6);
    }

    .section-nav {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-4);
      box-shadow: var(--shadow-card);
      position: sticky;
      top: 96px;
      align-self: start;
    }

    .section-nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }

    .section-nav-item:hover {
      background: var(--bg-main);
    }

    .section-nav-item.active {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
      color: var(--primary-blue);
    }

    .section-number {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: var(--bg-main);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .section-nav-item.active .section-number {
      background: var(--primary-blue);
      color: white;
    }

    .section-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .section-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .section-panel {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-card);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-5) 0;
      padding-bottom: var(--spacing-4);
      border-bottom: 1px solid var(--bg-border);
    }

    .section-hint {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: -20px 0 var(--spacing-5) 0;
    }

    .subsection {
      margin-bottom: var(--spacing-6);
    }

    .subsection:last-child {
      margin-bottom: 0;
    }

    .subsection-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-4) 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .form-group.full-width {
      grid-column: span 1;
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .required {
      color: var(--danger);
    }

    .form-input {
      padding: 12px 14px;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
      cursor: pointer;
    }

    .checkbox-label input {
      width: 18px;
      height: 18px;
    }

    .education-entry, .experience-entry {
      background: var(--bg-main);
      border-radius: var(--radius-lg);
      padding: var(--spacing-5);
      margin-bottom: var(--spacing-4);
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }

    .entry-header h4 {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .remove-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      border: none;
      background: var(--danger-light);
      color: var(--danger);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .remove-btn:hover {
      background: var(--danger);
      color: white;
    }

    .add-entry-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      border: 2px dashed var(--bg-border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .add-entry-btn:hover {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
      background: rgba(59, 130, 246, 0.05);
    }

    .file-upload {
      position: relative;
    }

    .file-upload input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .file-upload-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: 12px;
      border: 2px dashed var(--bg-border);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .file-upload-label:hover {
      border-color: var(--primary-blue);
      color: var(--primary-blue);
      background: rgba(59, 130, 246, 0.05);
    }

    .file-upload.large .file-upload-label {
      flex-direction: column;
      padding: var(--spacing-6);
      gap: var(--spacing-2);
    }

    .file-upload.large .file-upload-label span {
      font-weight: var(--font-weight-medium);
    }

    .file-upload.large .file-upload-label small {
      font-size: var(--font-size-xs);
      opacity: 0.7;
    }

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-5);
    }

    .document-upload {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .document-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .section-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
      padding-top: var(--spacing-4);
    }

    @media (max-width: 1024px) {
      .form-sections {
        grid-template-columns: 1fr;
      }

      .section-nav {
        position: relative;
        top: 0;
        display: flex;
        overflow-x: auto;
        gap: var(--spacing-2);
        padding: var(--spacing-3);
      }

      .section-nav-item {
        white-space: nowrap;
      }

      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .documents-grid {
        grid-template-columns: 1fr;
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

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AddEmployeeComponent implements OnInit {
  activeSection = signal('personal');
  isEditMode = signal(false);
  employeeId = signal<string | null>(null);
  sameAsCurrentAddress = false;

  sections = [
    { id: 'personal', label: 'Personal Information', number: 1 },
    { id: 'address', label: 'Address Information', number: 2 },
    { id: 'education', label: 'Education Details', number: 3 },
    { id: 'experience', label: 'Experience Details', number: 4 },
    { id: 'skills', label: 'Skills & Certifications', number: 5 },
    { id: 'visa', label: 'Visa & Immigration', number: 6 },
    { id: 'bank', label: 'Bank Details', number: 7 },
    { id: 'emergency', label: 'Emergency Contact', number: 8 },
    { id: 'employment', label: 'Employment Information', number: 9 },
    { id: 'documents', label: 'General Documents', number: 10 }
  ];

  employee: any = this.getEmptyEmployee();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId.set(id);
      this.isEditMode.set(true);
      // Load employee data based on ID
      this.loadEmployee(id);
    }
  }

  getEmptyEmployee() {
    return {
      // Personal Information
      firstName: '',
      middleName: '',
      lastName: '',
      personalEmail: '',
      mobileNumber: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      bloodGroup: '',
      languagesKnown: '',
      linkedInProfile: '',
      profilePhoto: null,
      aadhaarNumber: '',
      panNumber: '',
      passportNumber: '',
      drivingLicenseNumber: '',
      pfAccountNumber: '',
      esiNumber: '',

      // Address Information
      currentAddressLine1: '',
      currentAddressLine2: '',
      currentCity: '',
      currentState: '',
      currentCountry: 'India',
      currentPostalCode: '',
      permanentAddressLine1: '',
      permanentAddressLine2: '',
      permanentCity: '',
      permanentState: '',
      permanentCountry: 'India',
      permanentPostalCode: '',

      // Education
      education: [{
        qualificationLevel: '',
        degreeName: '',
        institutionName: '',
        university: '',
        specialization: '',
        percentage: '',
        startYear: '',
        endYear: '',
        document: null
      }],

      // Experience
      experience: [{
        companyName: '',
        designation: '',
        employmentType: '',
        startDate: '',
        endDate: '',
        technologies: '',
        currentCtc: '',
        lastDrawnSalary: ''
      }],

      // Skills & Certifications
      primarySkills: '',
      secondarySkills: '',
      certifications: '',
      certificationExpiry: '',

      // Visa & Immigration
      visaType: '',
      visaNumber: '',
      visaCountry: '',
      visaIssueDate: '',
      visaExpiryDate: '',
      workAuthorizationStatus: '',
      sponsorshipRequired: 'No',
      passportExpiryDate: '',

      // Bank Details
      bankAccountHolderName: '',
      bankName: '',
      bankBranchName: '',
      bankAccountNumber: '',
      ifscCode: '',
      bankAccountType: '',
      upiId: '',
      cancelledCheque: null,

      // Emergency Contact
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      emergencyContactAltPhone: '',
      emergencyContactAddress: '',
      emergencyContactEmail: '',

      // Employment Information
      employeeId: '',
      department: '',
      designation: '',
      reportingManager: '',
      dateOfJoining: '',
      employmentType: '',
      workLocation: '',
      shift: ''
    };
  }

  loadEmployee(id: string) {
    // Simulate loading employee data
    // In production, this would fetch from an API
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
        dateOfBirth: '1992-05-15',
        gender: 'Male',
        maritalStatus: 'Married',
        nationality: 'Indian',
        bloodGroup: 'O+',
        languagesKnown: 'English, Hindi',
        currentCity: 'Mumbai',
        currentState: 'Maharashtra',
        currentCountry: 'India',
        currentPostalCode: '400001',
        dateOfJoining: '2024-01-15',
        employmentType: 'Full-time',
        workLocation: 'Mumbai',
        reportingManager: 'Sarah Johnson'
      }
    ];

    const emp = mockEmployees.find(e => e.id === id);
    if (emp) {
      this.employee = { ...this.getEmptyEmployee(), ...emp };
    }
  }

  nextSection(): void {
    const currentIndex = this.sections.findIndex(s => s.id === this.activeSection());
    if (currentIndex < this.sections.length - 1) {
      this.activeSection.set(this.sections[currentIndex + 1].id);
    }
  }

  previousSection(): void {
    const currentIndex = this.sections.findIndex(s => s.id === this.activeSection());
    if (currentIndex > 0) {
      this.activeSection.set(this.sections[currentIndex - 1].id);
    }
  }

  onSameAsCurrentChange(): void {
    if (this.sameAsCurrentAddress) {
      this.employee.permanentAddressLine1 = this.employee.currentAddressLine1;
      this.employee.permanentAddressLine2 = this.employee.currentAddressLine2;
      this.employee.permanentCity = this.employee.currentCity;
      this.employee.permanentState = this.employee.currentState;
      this.employee.permanentCountry = this.employee.currentCountry;
      this.employee.permanentPostalCode = this.employee.currentPostalCode;
    }
  }

  addEducation(): void {
    this.employee.education.push({
      qualificationLevel: '',
      degreeName: '',
      institutionName: '',
      university: '',
      specialization: '',
      percentage: '',
      startYear: '',
      endYear: '',
      document: null
    });
  }

  removeEducation(index: number): void {
    if (this.employee.education.length > 1) {
      this.employee.education.splice(index, 1);
    }
  }

  addExperience(): void {
    this.employee.experience.push({
      companyName: '',
      designation: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      technologies: '',
      currentCtc: '',
      lastDrawnSalary: ''
    });
  }

  removeExperience(index: number): void {
    if (this.employee.experience.length > 1) {
      this.employee.experience.splice(index, 1);
    }
  }

  onFileSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Handle file upload
      console.log(`File selected for ${field}:`, input.files[0].name);
      this.employee[field] = input.files[0];
    }
  }

  saveEmployee(): void {
    console.log('Saving employee:', this.employee);
    // In production, this would save to an API
    alert(this.isEditMode() ? 'Employee updated successfully!' : 'Employee saved successfully!');
    this.router.navigate(['/workforce/employees']);
  }

  goBack(): void {
    this.router.navigate(['/workforce/employees']);
  }
}