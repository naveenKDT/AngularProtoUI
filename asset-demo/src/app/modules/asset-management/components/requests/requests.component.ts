import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent, BadgeComponent, AvatarComponent, ProgressComponent,
  TabsComponent, ButtonComponent, InputComponent, SelectComponent,
  TextareaComponent, SearchComponent
} from '../../../../shared/components/ui-components';

export interface Request {
  id: string;
  type: string;
  category: string;
  subcategory: string;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'fulfilled' | 'rejected' | 'cancelled';
  requestedAt: string;
  updatedAt: string;
  requestedBy: string;
  requestedByDept: string;
  assignedTo: string;
  slaDue: string;
  assetTag?: string;
  assetName?: string;
  description: string;
  escalation: string;
}

interface Conversation {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  message: string;
  isInternal: boolean;
}

@Component({
  selector: 'knodtec-requests',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe, TitleCasePipe,
    CardComponent, BadgeComponent, AvatarComponent, ProgressComponent,
    TabsComponent, ButtonComponent, InputComponent, SelectComponent,
    TextareaComponent, SearchComponent
  ],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {
  private router: Router;
  readonly searchQuery = signal('');
  readonly priorityFilter = signal('');
  readonly categoryFilter = signal('');
  readonly statusFilter = signal('');
  readonly activeDetailTab = signal('overview');
  readonly showInternal = signal(false);
  readonly newMessage = '';
  readonly detailTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'conversation', label: 'Conversation' },
    { key: 'activity', label: 'Activity' }
  ];
  readonly requests = signal<Request[]>([
    { id: 'REQ-4521', type: 'New Laptop Request', category: 'Asset Request', subcategory: 'New Asset', priority: 'high', status: 'pending_approval', requestedAt: '2026-06-04', updatedAt: '2026-06-05T09:30:00', requestedBy: 'Vikram Singh', requestedByDept: 'Engineering', assignedTo: 'IT Asset Team', slaDue: '2026-06-06', escalation: 'team_lead', description: 'Requesting a new laptop for the new team member joining next week.', assetTag: undefined, assetName: undefined },
    { id: 'REQ-4520', type: 'Monitor Replacement', category: 'Asset Issue', subcategory: 'Hardware', priority: 'medium', status: 'processing', requestedAt: '2026-06-03', updatedAt: '2026-06-04T16:00:00', requestedBy: 'Sneha Gupta', requestedByDept: 'Design', assignedTo: 'IT Support', slaDue: '2026-06-05', escalation: 'none', description: 'My external monitor has stopped working.', assetTag: 'AST-1056', assetName: 'Dell UltraSharp U2723QE' },
    { id: 'REQ-4519', type: 'Software Installation', category: 'Software', subcategory: 'Installation', priority: 'low', status: 'pending_approval', requestedAt: '2026-06-02', updatedAt: '2026-06-03T10:00:00', requestedBy: 'Arun Kumar', requestedByDept: 'Finance', assignedTo: 'IT Support', slaDue: '2026-06-07', escalation: 'none', description: 'Need Adobe Creative Cloud installed.', assetTag: 'AST-1045', assetName: 'MacBook Pro 14" M3' },
    { id: 'REQ-4518', type: 'Keyboard Repair', category: 'Asset Issue', subcategory: 'Repair', priority: 'medium', status: 'processing', requestedAt: '2026-06-01', updatedAt: '2026-06-02T14:00:00', requestedBy: 'Meera Joshi', requestedByDept: 'Marketing', assignedTo: 'IT Support', slaDue: '2026-06-04', escalation: 'manager', description: 'Some keys on my keyboard are not responding properly.', assetTag: 'AST-1078', assetName: 'Magic Keyboard' },
    { id: 'REQ-4517', type: 'Access Request', category: 'Access', subcategory: 'System Access', priority: 'high', status: 'approved', requestedAt: '2026-05-30', updatedAt: '2026-06-01T11:00:00', requestedBy: 'Rahul Verma', requestedByDept: 'Operations', assignedTo: 'IT Asset Team', slaDue: '2026-06-01', escalation: 'critical', description: 'Need access to the production database.', assetTag: undefined, assetName: undefined },
    { id: 'REQ-4516', type: 'New Chair Request', category: 'Asset Request', subcategory: 'New Asset', priority: 'low', status: 'fulfilled', requestedAt: '2026-05-25', updatedAt: '2026-05-28T14:00:00', requestedBy: 'Priya Patel', requestedByDept: 'HR', assignedTo: 'IT Asset Team', slaDue: '2026-05-30', escalation: 'none', description: 'Need an ergonomic chair for the new workstation.', assetTag: 'AST-1090', assetName: 'Herman Miller Aeron' }
  ]);
  readonly selectedRequest = signal<Request | null>(null);
  readonly conversations = signal<Conversation[]>([
    { id: '1', author: 'Sneha Gupta', authorRole: 'Requester', timestamp: '2026-06-03T10:30:00', message: 'The monitor issue started yesterday. I tried using different cables but the problem persists.', isInternal: false },
    { id: '2', author: 'Rahul Jain', authorRole: 'IT Support', timestamp: '2026-06-03T11:45:00', message: 'Hi Sneha, I have reviewed your ticket. Let me check the inventory for a replacement monitor.', isInternal: false },
    { id: '3', author: 'Rahul Jain', authorRole: 'IT Support', timestamp: '2026-06-03T11:50:00', message: 'We have a spare Dell UltraSharp available. Will arrange for replacement tomorrow.', isInternal: true },
    { id: '4', author: 'IT Manager', authorRole: 'Manager', timestamp: '2026-06-04T09:00:00', message: 'Approved for replacement. Please update the requester.', isInternal: true }
  ]);
  readonly filteredRequests = computed(() => {
    let result = this.requests();
    const query = this.searchQuery().toLowerCase();
    if (query) result = result.filter(r => r.id.toLowerCase().includes(query) || r.type.toLowerCase().includes(query) || r.description.toLowerCase().includes(query));
    if (this.priorityFilter()) result = result.filter(r => r.priority === this.priorityFilter());
    if (this.categoryFilter()) result = result.filter(r => r.category === this.categoryFilter());
    if (this.statusFilter()) result = result.filter(r => r.status === this.statusFilter());
    return result;
  });

  constructor(router: Router) {
    this.router = router;
    this.selectedRequest.set(this.requests()[0]);
  }

  filterByStatus(status: string): void { this.statusFilter.set(status); }
  navigateToNewRequest(): void { this.router.navigate(['/requests/new']); }
  selectRequest(request: Request): void { this.selectedRequest.set(request); }
  getCountByStatus(status: string): number { return this.requests().filter(r => r.status === status).length; }

  getPriorityColor(priority: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = { 'high': 'red', 'medium': 'amber', 'low': 'blue' };
    return colors[priority] || 'slate';
  }
  getCategoryColor(category: string): 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber' {
    const colors: Record<string, any> = { 'Asset Request': 'blue', 'Asset Issue': 'amber', 'Software': 'indigo', 'Hardware': 'indigo', 'Access': 'cyan' };
    return colors[category] || 'slate';
  }
  getCategoryClass(category: string): string {
    const classes: Record<string, string> = { 'Asset Request': 'blue', 'Asset Issue': 'amber', 'Software': 'purple', 'Hardware': 'purple', 'Access': 'cyan' };
    return classes[category] || 'blue';
  }
  getStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'cyan' {
    const colors: Record<string, any> = { 'draft': 'slate', 'pending_approval': 'amber', 'approved': 'cyan', 'processing': 'blue', 'fulfilled': 'green', 'rejected': 'red', 'cancelled': 'slate' };
    return colors[status] || 'slate';
  }
  formatStatus(status: string): string {
    const labels: Record<string, string> = { 'draft': 'Draft', 'pending_approval': 'Pending Approval', 'approved': 'Approved', 'processing': 'Processing', 'fulfilled': 'Fulfilled', 'rejected': 'Rejected', 'cancelled': 'Cancelled' };
    return labels[status] || status;
  }
  isStepActive(currentStatus: string | undefined, stepStatus: string): boolean {
    if (!currentStatus) return false;
    const order = ['draft', 'pending_approval', 'approved', 'processing', 'fulfilled'];
    return order.indexOf(currentStatus) === order.indexOf(stepStatus);
  }
  isStepCompleted(currentStatus: string | undefined, stepStatus: string): boolean {
    if (!currentStatus) return false;
    const order = ['draft', 'pending_approval', 'approved', 'processing', 'fulfilled'];
    return order.indexOf(currentStatus) > order.indexOf(stepStatus);
  }
  getStatusDate(status: string): string {
    if (status === 'fulfilled') return 'Completed';
    if (status === 'processing') return 'In progress';
    if (status === 'approved') return 'Approved';
    if (status === 'pending_approval') return 'Awaiting';
    return 'Pending';
  }
  getTimeAgo(dateStr: string): string {
    const hours = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 3600000);
    return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
  }
  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(); }
  isOverdue(slaDate: string): boolean { return new Date(slaDate) < new Date(); }

  readonly selectedAssignee = signal('');

  updateRequestStatus(requestId: string, newStatus: string): void {
    const list = this.requests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      const updated = { ...list[idx], status: newStatus as Request['status'], updatedAt: new Date().toISOString() };
      const newList = [...list]; newList[idx] = updated; this.requests.set(newList);
      if (this.selectedRequest()?.id === requestId) this.selectedRequest.set(updated);
    }
  }
  assignRequest(requestId: string): void {
    const assignee = this.selectedAssignee();
    if (!assignee) { alert('Please select a team member to assign'); return; }
    const list = this.requests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      const updated = { ...list[idx], assignedTo: assignee, updatedAt: new Date().toISOString() };
      const newList = [...list]; newList[idx] = updated; this.requests.set(newList);
      if (this.selectedRequest()?.id === requestId) this.selectedRequest.set(updated);
      this.selectedAssignee.set('');
    }
  }
}
