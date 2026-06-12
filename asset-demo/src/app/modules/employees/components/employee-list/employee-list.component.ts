import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  SearchComponent
} from '../../../../shared/components/ui-components';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  mobileNumber: string;
  department: string;
  designation: string;
  reportingManager: string;
  employmentType: string;
  workLocation: string;
  dateOfJoining: string;
  status: 'active' | 'inactive' | 'onboarding' | 'offboarding';
  profilePhoto?: string;
}

@Component({
  selector: 'knodtec-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    SearchComponent
  ],
  template: `
    <div class="employee-list-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Employees</h1>
          <p class="page-subtitle">Manage your organization's workforce</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="importIcon">Import</knod-button>
          <knod-button variant="outline" [icon]="exportIcon">Export</knod-button>
          <knod-button variant="primary" [icon]="plusIcon" (click)="navigateToAddEmployee()">Add Employee</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('all')">
          <div class="stat-value">{{ employees().length }}</div>
          <div class="stat-label">Total Employees</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('active')">
          <div class="stat-value">{{ activeCount() }}</div>
          <div class="stat-label">Active</div>
          <div class="stat-indicator green"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('onboarding')">
          <div class="stat-value">{{ onboardingCount() }}</div>
          <div class="stat-label">Onboarding</div>
          <div class="stat-indicator violet"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('inactive')">
          <div class="stat-value">{{ inactiveCount() }}</div>
          <div class="stat-label">Inactive</div>
          <div class="stat-indicator slate"></div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <knod-search
            placeholder="Search by name, email, or employee ID..."
            [value]="searchQuery()"
            (valueChange)="searchQuery.set($event)">
          </knod-search>
        </div>
        <div class="filter-group">
          <select class="filter-select" [ngModel]="departmentFilter()" (ngModelChange)="departmentFilter.set($event)">
            <option value="">All Departments</option>
            @for (dept of departments; track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
          <select class="filter-select" [ngModel]="designationFilter()" (ngModelChange)="designationFilter.set($event)">
            <option value="">All Designations</option>
            @for (des of designations; track des) {
              <option [value]="des">{{ des }}</option>
            }
          </select>
          <select class="filter-select" [ngModel]="employmentTypeFilter()" (ngModelChange)="employmentTypeFilter.set($event)">
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
          <select class="filter-select" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="onboarding">Onboarding</option>
            <option value="offboarding">Offboarding</option>
          </select>
          <input type="date" class="filter-date" [ngModel]="dojFilter()" (ngModelChange)="dojFilter.set($event)" />
        </div>
        <button class="clear-filters" (click)="clearFilters()">Clear Filters</button>
      </div>

      <!-- Employee Table -->
      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Reporting Manager</th>
              <th>Employment Type</th>
              <th>Work Location</th>
              <th>Date of Joining</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (employee of filteredEmployees(); track employee.id) {
              <tr>
                <td class="emp-id">{{ employee.employeeId }}</td>
                <td>
                  <div class="emp-name-cell">
                    <div class="emp-avatar">{{ getInitials(employee) }}</div>
                    <span>{{ employee.firstName }} {{ employee.lastName }}</span>
                  </div>
                </td>
                <td>{{ employee.department }}</td>
                <td>{{ employee.designation }}</td>
                <td>{{ employee.reportingManager }}</td>
                <td>{{ employee.employmentType }}</td>
                <td>{{ employee.workLocation }}</td>
                <td>{{ employee.dateOfJoining | date:'mediumDate' }}</td>
                <td>{{ employee.mobileNumber }}</td>
                <td>{{ employee.email }}</td>
                <td>
                  <knod-badge [color]="getStatusColor(employee.status)">{{ employee.status | titlecase }}</knod-badge>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" (click)="viewEmployee(employee)" title="View">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-btn edit" (click)="editEmployee(employee)" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @if (filteredEmployees().length === 0) {
              <tr>
                <td colspan="12" class="empty-state">
                  <div class="empty-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    <h3>No employees found</h3>
                    <p>No employees match your search criteria.</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (filteredEmployees().length > 0) {
        <div class="pagination">
          <span class="pagination-info">Showing {{ filteredEmployees().length }} of {{ employees().length }} employees</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .employee-list-page {
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
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .page-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
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

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-5);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-card);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-card-hover);
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-1);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .stat-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-indicator.blue { background: var(--primary-blue); }
    .stat-indicator.green { background: var(--success); }
    .stat-indicator.violet { background: var(--purple); }
    .stat-indicator.slate { background: var(--text-secondary); }

    .filters-bar {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-6);
      box-shadow: var(--shadow-card);
    }

    .search-wrapper {
      flex: 1;
      min-width: 280px;
    }

    .filter-group {
      display: flex;
      gap: var(--spacing-3);
      flex-wrap: wrap;
    }

    .filter-select, .filter-date {
      padding: 10px 14px;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      background: white;
      cursor: pointer;
      transition: all var(--transition-fast);
      min-width: 140px;
    }

    .filter-select:focus, .filter-date:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .clear-filters {
      padding: 10px 16px;
      background: transparent;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .clear-filters:hover {
      background: var(--bg-main);
      color: var(--text-primary);
    }

    .table-container {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
    }

    .employee-table thead {
      background: linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%);
    }

    .employee-table th {
      padding: var(--spacing-4) var(--spacing-3);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--bg-border);
    }

    .employee-table td {
      padding: var(--spacing-4) var(--spacing-3);
      border-bottom: 1px solid var(--bg-border);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .employee-table tbody tr {
      transition: all var(--transition-fast);
    }

    .employee-table tbody tr:hover {
      background: var(--bg-main);
    }

    .emp-id {
      font-family: monospace;
      color: var(--text-secondary);
    }

    .emp-name-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .emp-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-2);
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-btn.view {
      background: var(--info-light);
      color: var(--info);
    }

    .action-btn.view:hover {
      background: var(--info);
      color: white;
    }

    .action-btn.edit {
      background: var(--purple-light);
      color: var(--purple);
    }

    .action-btn.edit:hover {
      background: var(--purple);
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-10) !important;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      color: var(--text-secondary);
    }

    .empty-content svg {
      opacity: 0.4;
    }

    .empty-content h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      color: var(--text-primary);
    }

    .empty-content p {
      margin: 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4);
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    @media (max-width: 1200px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        justify-content: flex-start;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .employee-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class EmployeeListComponent {
  searchQuery = signal('');
  departmentFilter = signal('');
  designationFilter = signal('');
  employmentTypeFilter = signal('');
  statusFilter = signal('');
  dojFilter = signal('');

  departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  designations = ['Software Engineer', 'Senior Engineer', 'Team Lead', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Executive'];

  employees = signal<Employee[]>([
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
      employmentType: 'Full-time',
      workLocation: 'Mumbai',
      dateOfJoining: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      firstName: 'Priya',
      middleName: '',
      lastName: 'Sharma',
      email: 'priya.sharma@company.com',
      personalEmail: 'priya.s@email.com',
      mobileNumber: '+91 98765 43211',
      department: 'Design',
      designation: 'Product Designer',
      reportingManager: 'Alex Chen',
      employmentType: 'Full-time',
      workLocation: 'Bangalore',
      dateOfJoining: '2024-03-01',
      status: 'active'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      firstName: 'Rahul',
      middleName: 'Kumar',
      lastName: 'Verma',
      email: 'rahul.verma@company.com',
      personalEmail: 'rahul.v@email.com',
      mobileNumber: '+91 98765 43212',
      department: 'Engineering',
      designation: 'Software Engineer',
      reportingManager: 'John Doe',
      employmentType: 'Full-time',
      workLocation: 'Pune',
      dateOfJoining: '2024-06-01',
      status: 'onboarding'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      firstName: 'Sneha',
      middleName: '',
      lastName: 'Patel',
      email: 'sneha.patel@company.com',
      personalEmail: 'sneha.p@email.com',
      mobileNumber: '+91 98765 43213',
      department: 'Marketing',
      designation: 'Marketing Manager',
      reportingManager: 'Emily Davis',
      employmentType: 'Full-time',
      workLocation: 'Mumbai',
      dateOfJoining: '2023-09-15',
      status: 'active'
    },
    {
      id: '5',
      employeeId: 'EMP005',
      firstName: 'Amit',
      middleName: 'Singh',
      lastName: 'Gupta',
      email: 'amit.gupta@company.com',
      personalEmail: 'amit.g@email.com',
      mobileNumber: '+91 98765 43214',
      department: 'Sales',
      designation: 'Sales Executive',
      reportingManager: 'Robert Wilson',
      employmentType: 'Contract',
      workLocation: 'Delhi',
      dateOfJoining: '2024-02-01',
      status: 'active'
    },
    {
      id: '6',
      employeeId: 'EMP006',
      firstName: 'Kavita',
      middleName: '',
      lastName: 'Reddy',
      email: 'kavita.reddy@company.com',
      personalEmail: 'kavita.r@email.com',
      mobileNumber: '+91 98765 43215',
      department: 'HR',
      designation: 'HR Manager',
      reportingManager: 'Michael Brown',
      employmentType: 'Full-time',
      workLocation: 'Hyderabad',
      dateOfJoining: '2022-06-15',
      status: 'active'
    },
    {
      id: '7',
      employeeId: 'EMP007',
      firstName: 'Vikram',
      middleName: '',
      lastName: 'Singh',
      email: 'vikram.singh@company.com',
      personalEmail: 'vikram.s@email.com',
      mobileNumber: '+91 98765 43216',
      department: 'Finance',
      designation: 'Finance Analyst',
      reportingManager: 'Lisa Anderson',
      employmentType: 'Part-time',
      workLocation: 'Chennai',
      dateOfJoining: '2024-04-01',
      status: 'inactive'
    }
  ]);

  filteredEmployees = computed(() => {
    let result = this.employees();
    const query = this.searchQuery().toLowerCase();
    const dept = this.departmentFilter();
    const des = this.designationFilter();
    const type = this.employmentTypeFilter();
    const status = this.statusFilter();
    const doj = this.dojFilter();

    if (query) {
      result = result.filter(e =>
        e.firstName.toLowerCase().includes(query) ||
        e.lastName.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.employeeId.toLowerCase().includes(query)
      );
    }

    if (dept) {
      result = result.filter(e => e.department === dept);
    }

    if (des) {
      result = result.filter(e => e.designation === des);
    }

    if (type) {
      result = result.filter(e => e.employmentType === type);
    }

    if (status) {
      result = result.filter(e => e.status === status);
    }

    if (doj) {
      result = result.filter(e => e.dateOfJoining === doj);
    }

    return result;
  });

  activeCount = computed(() => this.employees().filter(e => e.status === 'active').length);
  onboardingCount = computed(() => this.employees().filter(e => e.status === 'onboarding').length);
  inactiveCount = computed(() => this.employees().filter(e => e.status === 'inactive').length);

  constructor(private router: Router) {}

  getInitials(employee: Employee): string {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'slate' {
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'slate'> = {
      'active': 'green',
      'onboarding': 'blue',
      'offboarding': 'amber',
      'inactive': 'slate'
    };
    return colors[status] || 'slate';
  }

  filterByStatus(status: string): void {
    if (this.statusFilter() === status || status === 'all') {
      this.statusFilter.set('');
    } else {
      this.statusFilter.set(status);
    }
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.departmentFilter.set('');
    this.designationFilter.set('');
    this.employmentTypeFilter.set('');
    this.statusFilter.set('');
    this.dojFilter.set('');
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/workforce/employees/add']);
  }

  viewEmployee(employee: Employee): void {
    this.router.navigate(['/workforce/employees', employee.id]);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/workforce/employees', employee.id, 'edit']);
  }

  // Icons
  plusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  importIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  exportIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
}