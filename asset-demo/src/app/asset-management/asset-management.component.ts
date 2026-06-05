import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Asset,
  AssetClearanceStatus,
  AssetHistoryEvent,
  AssetHistoryType,
  AssetRequest,
  AssignmentDraft,
  Employee,
  ExitClearanceAssetItem,
  ExitClearanceCase,
  OffboardingCase,
  OffboardingStageStatus,
  ReturnCondition,
  ReturnDraft,
} from './asset-management.models';
import {
  MOCK_ASSETS,
  MOCK_DOCUMENTS,
  MOCK_EMPLOYEES,
  MOCK_EXIT_CLEARANCES,
  MOCK_HISTORY,
  MOCK_MAINTENANCE,
  MOCK_OFFBOARDING_CASES,
  MOCK_REQUESTS,
} from './asset-management.mock-data';

type PageKey = 'dashboard' | 'assets' | 'details' | 'create' | 'requests' | 'reports' | 'employee' | 'offboarding' | 'exit';
type DetailTab = 'overview' | 'assignment' | 'history' | 'maintenance' | 'documents' | 'audit';
type ReportCard = {
  title: string;
  value: string | number;
  description: string;
  action: string;
};

type ExitClearanceView = {
  case: ExitClearanceCase;
  employee?: Employee;
  assets: Array<ExitClearanceAssetItem & { asset?: Asset; assignedDate: string }>;
  blockers: number;
  returned: number;
  hrBlockedStages: number;
};

type OffboardingView = {
  case: OffboardingCase;
  employee?: Employee;
  clearance?: ExitClearanceView;
  assetClearanceStatus: 'Pending' | 'In Progress' | 'Completed';
};

type ServiceWorkflowCard = {
  title: string;
  value: string | number;
  description: string;
  tone: string;
};

type ReportInsightRow = {
  report: string;
  focus: string;
  metric: string | number;
  owner: string;
  nextStep: string;
};

type ExitOutcomeDraft = {
  status: AssetClearanceStatus;
  returnedOn: string;
  verifiedBy: string;
  condition: ReturnCondition;
  actionRequired: string;
  remarks: string;
};

@Component({
  selector: 'app-asset-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './asset-management.component.html',
  styleUrl: './asset-management.component.scss',
})
export class AssetManagementComponent {
  readonly employees = signal<Employee[]>(MOCK_EMPLOYEES);
  readonly assets = signal<Asset[]>(MOCK_ASSETS);
  readonly history = signal<AssetHistoryEvent[]>(MOCK_HISTORY);
  readonly maintenance = signal(MOCK_MAINTENANCE);
  readonly documents = signal(MOCK_DOCUMENTS);
  readonly requests = signal(MOCK_REQUESTS);
  readonly exitClearances = signal<ExitClearanceCase[]>(MOCK_EXIT_CLEARANCES);
  readonly offboardingCases = signal<OffboardingCase[]>(MOCK_OFFBOARDING_CASES);

  readonly page = signal<PageKey>('dashboard');
  readonly detailTab = signal<DetailTab>('overview');
  readonly selectedAssetId = signal(MOCK_ASSETS[0].id);
  readonly showAssignDialog = signal(false);
  readonly showReturnDialog = signal(false);
  readonly showMaintenanceSheet = signal(false);
  readonly showExitOutcomeDialog = signal(false);
  readonly selectedExitCaseId = signal(MOCK_EXIT_CLEARANCES[0]?.id ?? '');
  readonly selectedExitAssetId = signal('');
  readonly search = signal('');
  readonly statusFilter = signal('all');
  readonly categoryFilter = signal('all');
  readonly locationFilter = signal('all');

  readonly assignmentDraft = signal<AssignmentDraft>({
    employeeId: MOCK_EMPLOYEES[0].id,
    assignedDate: '2026-06-04',
    expectedReturnDate: '2028-06-04',
    remarks: 'Assigned for hybrid work setup.',
  });

  readonly returnDraft = signal<ReturnDraft>({
    condition: 'good',
    returnDate: '2026-06-04',
    remarks: 'Returned with charger and asset sleeve.',
  });

  readonly exitOutcomeDraft = signal<ExitOutcomeDraft>({
    status: 'returned_verified',
    returnedOn: '2026-06-05',
    verifiedBy: 'Rahul Jain',
    condition: 'good',
    actionRequired: 'No further action. Asset return has been verified by IT.',
    remarks: 'Returned with required accessories and verified physically.',
  });

  readonly newAsset = signal({
    name: 'Dell Latitude 7440',
    tag: 'AST-1051',
    category: 'Laptop',
    type: 'Business Laptop',
    brand: 'Dell',
    model: 'Latitude 7440',
    serialNumber: 'DL-7440-55Z2',
    purchaseCost: 96500,
    purchaseDate: '2026-06-04',
    vendor: 'Softline Systems',
    warrantyStart: '2026-06-04',
    warrantyEnd: '2029-06-03',
  });

  readonly selectedAsset = computed(() => {
    return this.assets().find((asset) => asset.id === this.selectedAssetId()) ?? this.assets()[0];
  });

  readonly selectedEmployee = computed(() => {
    const employeeId = this.currentHolderId(this.selectedAsset().id) ?? this.selectedAsset().assignedToId;
    return this.employeeById(employeeId);
  });

  readonly selectedAssetHistory = computed(() => this.historyForAsset(this.selectedAsset().id));
  readonly selectedMaintenance = computed(() => this.maintenance().filter((item) => item.assetId === this.selectedAsset().id));
  readonly selectedDocuments = computed(() => this.documents().filter((item) => item.assetId === this.selectedAsset().id));
  readonly primaryEmployeeAssets = computed(() => this.assets().filter((asset) => asset.assignedToId === this.employees()[0]?.id));

  readonly filteredAssets = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.assets().filter((asset) => {
      const matchesQuery =
        !query ||
        [asset.tag, asset.name, asset.brand, asset.model, asset.serialNumber, this.employeeById(asset.assignedToId)?.name ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesStatus = this.statusFilter() === 'all' || asset.status === this.statusFilter();
      const matchesCategory = this.categoryFilter() === 'all' || asset.category === this.categoryFilter();
      const matchesLocation = this.locationFilter() === 'all' || asset.location === this.locationFilter();
      return matchesQuery && matchesStatus && matchesCategory && matchesLocation;
    });
  });

  readonly kpis = computed(() => {
    const assets = this.assets();
    return [
      { label: 'Total Assets', value: assets.length, tone: 'blue', note: '+8.2% this month' },
      { label: 'Assigned Assets', value: assets.filter((asset) => asset.status === 'assigned').length, tone: 'indigo', note: 'Currently issued' },
      { label: 'Available Assets', value: assets.filter((asset) => asset.status === 'available').length, tone: 'green', note: 'Ready to assign' },
      { label: 'Under Maintenance', value: assets.filter((asset) => asset.status === 'maintenance').length, tone: 'cyan', note: 'Vendor follow-up' },
      { label: 'Retired Assets', value: assets.filter((asset) => asset.status === 'retired').length, tone: 'slate', note: 'End of life' },
      { label: 'Expiring Warranty', value: assets.filter((asset) => asset.warrantyStatus === 'expiring').length, tone: 'amber', note: 'Next 30 days' },
    ];
  });

  readonly recentAssignments = computed(() => this.history().filter((event) => event.type === 'assigned' || event.type === 'transferred').slice(-5).reverse());
  readonly recentReturns = computed(() => this.history().filter((event) => event.type === 'returned').slice(-5).reverse());
  readonly warrantyExpiringAssets = computed(() => this.assets().filter((asset) => asset.warrantyStatus === 'expiring').slice(0, 6));
  readonly pendingRequests = computed(() => this.requests().filter((request) => ['submitted', 'manager_review', 'it_review'].includes(request.status)));
  readonly approvedRequests = computed(() => this.requests().filter((request) => request.status === 'approved'));
  readonly fulfilledRequests = computed(() => this.requests().filter((request) => ['assigned', 'replaced', 'closed'].includes(request.status)));
  readonly activeServiceRequests = computed(() => this.requests().filter((request) => !['closed', 'rejected'].includes(request.status)));
  readonly highPriorityRequests = computed(() => this.requests().filter((request) => request.priority === 'high' && !['closed', 'rejected'].includes(request.status)));
  readonly repairRequests = computed(() => this.requests().filter((request) => ['Repair', 'Damage Report', 'Replacement'].includes(request.requestType)));
  readonly exitClearanceAssets = computed(() => this.primaryEmployeeAssets().filter((asset) => asset.status === 'assigned' || asset.status === 'maintenance'));
  readonly exitClearanceComplete = computed(() => this.exitClearanceAssets().length === 0);
  readonly exitClearanceViews = computed<ExitClearanceView[]>(() => {
    return this.exitClearances().map((clearance) => {
      const assets = clearance.assetItems.map((item) => ({
        ...item,
        asset: this.assets().find((asset) => asset.id === item.assetId),
        assignedDate: this.assignmentDateFor(item.assetId),
      }));

      return {
        case: clearance,
        employee: this.employeeById(clearance.employeeId),
        assets,
        blockers: assets.filter((item) => this.isExitClearanceBlocker(item.status)).length,
        returned: assets.filter((item) => item.status === 'returned_verified' || item.status === 'collected_good').length,
        hrBlockedStages: [
          clearance.managerApproval,
          clearance.knowledgeTransfer,
          clearance.accessRevocation,
          clearance.payrollSettlement,
          clearance.documentsIssued,
        ].filter((status) => status === 'blocked' || status === 'waiting').length,
      };
    });
  });
  readonly selectedExitClearanceView = computed(() => this.exitClearanceViews().find((view) => view.case.id === this.selectedExitCaseId()) ?? this.exitClearanceViews()[0]);
  readonly selectedExitAsset = computed(() => {
    const view = this.selectedExitClearanceView();
    return view?.assets.find((item) => item.assetId === this.selectedExitAssetId()) ?? view?.assets[0];
  });
  readonly exitClearanceAssetCount = computed(() => this.exitClearanceViews().reduce((total, view) => total + view.assets.length, 0));
  readonly exitClearanceReturnedCount = computed(() => this.exitClearanceViews().reduce((total, view) => total + view.returned, 0));
  readonly exitClearanceBlockerCount = computed(() => this.exitClearanceViews().reduce((total, view) => total + view.blockers, 0));
  readonly offboardingViews = computed<OffboardingView[]>(() =>
    this.offboardingCases().map((offboarding) => {
      const clearance = this.exitClearanceViews().find((view) => view.case.id === offboarding.exitClearanceId);
      const returned = clearance?.returned ?? 0;
      const total = clearance?.assets.length ?? 0;
      return {
        case: offboarding,
        employee: this.employeeById(offboarding.employeeId),
        clearance,
        assetClearanceStatus: total === 0 || returned === 0 ? 'Pending' : clearance?.blockers ? 'In Progress' : 'Completed',
      };
    }),
  );
  readonly offboardingKpis = computed(() => [
    { label: 'HR Offboarding Cases', value: this.offboardingViews().length, tone: 'blue', note: 'Separate HR workflow' },
    { label: 'Notice Period', value: this.offboardingCases().filter((item) => item.status === 'notice_period').length, tone: 'cyan', note: 'Employee still active' },
    { label: 'Asset Clearance Pending', value: this.offboardingViews().filter((view) => view.assetClearanceStatus !== 'Completed').length, tone: 'amber', note: 'Dependency from Asset Management' },
    { label: 'Settlement Pending', value: this.offboardingCases().filter((item) => item.status === 'settlement_pending').length, tone: 'green', note: 'Final HR/Payroll stage' },
  ]);

  readonly categories = computed(() => Array.from(new Set(this.assets().map((asset) => asset.category))));
  readonly locations = computed(() => Array.from(new Set(this.assets().map((asset) => asset.location))));
  readonly departmentReportRows = computed(() => {
    return this.employees().map((employee) => ({
      department: employee.department,
      employee: employee.name,
      assigned: this.assets().filter((asset) => asset.assignedToId === employee.id).length,
      pendingRequests: this.requests().filter((request) => request.employeeId === employee.id && ['submitted', 'manager_review', 'it_review'].includes(request.status)).length,
    })).filter((row) => row.assigned || row.pendingRequests).slice(0, 8);
  });

  readonly serviceWorkflowCards = computed<ServiceWorkflowCard[]>(() => [
    {
      title: 'Open Service Tickets',
      value: this.activeServiceRequests().length,
      description: 'New asset, issue, damage, support, repair, and replacement requests awaiting workflow action.',
      tone: 'blue',
    },
    {
      title: 'Awaiting IT Action',
      value: this.requests().filter((request) => ['it_review', 'approved', 'repairing'].includes(request.status)).length,
      description: 'Tickets already approved or triaged and owned by IT Support or IT Asset Team.',
      tone: 'cyan',
    },
    {
      title: 'High Priority',
      value: this.highPriorityRequests().length,
      description: 'Urgent requests with SLA attention, including damaged or malfunctioning assigned assets.',
      tone: 'amber',
    },
    {
      title: 'Linked To Assets',
      value: this.requests().filter((request) => request.linkedAssetId).length,
      description: 'Tickets connected to employee-assigned assets for communication and lifecycle tracking.',
      tone: 'green',
    },
  ]);

  readonly reportInsightRows = computed<ReportInsightRow[]>(() => {
    const assets = this.assets();
    const assigned = assets.filter((asset) => asset.status === 'assigned').length;
    const maintenance = assets.filter((asset) => asset.status === 'maintenance').length;
    const lost = assets.filter((asset) => asset.status === 'lost').length;

    return [
      { report: 'Asset Inventory Summary', focus: 'Stock and ownership by status', metric: `${assets.length} total / ${assigned} assigned`, owner: 'IT Asset Team', nextStep: 'Reconcile storage stock weekly' },
      { report: 'Asset Allocation Status', focus: 'Available, assigned, maintenance, retired, lost', metric: `${assets.length - assigned} not assigned`, owner: 'IT Admin', nextStep: 'Review unassigned and retired assets' },
      { report: 'Employee-wise Assignments', focus: 'Employee liability and return expectations', metric: `${this.departmentReportRows().length} mapped holders`, owner: 'HR + IT', nextStep: 'Validate before transfer or exit' },
      { report: 'Lifecycle Tracking', focus: 'Purchase, warranty, repairs, transfers, retirement', metric: `${this.warrantyExpiringAssets().length} warranty risks`, owner: 'Procurement', nextStep: 'Plan renewal or replacement' },
      { report: 'Pending Requests and Tickets', focus: 'Open workflow, approvals, SLA and owners', metric: this.activeServiceRequests().length, owner: 'IT Support', nextStep: 'Clear high priority queue first' },
      { report: 'Repair and Maintenance History', focus: 'Vendor repairs, costs, and recurrence', metric: `${maintenance} in maintenance`, owner: 'IT Support', nextStep: 'Close stale vendor follow-ups' },
      { report: 'Lost/Damaged Assets', focus: 'Recovery, repair, replacement, finance impact', metric: `${lost} lost / ${this.repairRequests().length} repair tickets`, owner: 'Finance + IT', nextStep: 'Confirm recovery or write-off' },
      { report: 'Utilization and Aging', focus: 'Underused inventory and aging hardware', metric: `${assets.filter((asset) => asset.warrantyStatus === 'expired').length} expired warranties`, owner: 'Operations', nextStep: 'Retire or redeploy aging assets' },
      { report: 'Offboarding Recovery', focus: 'Exit clearance, returns, blockers, waivers', metric: `${this.exitClearanceBlockerCount()} blockers`, owner: 'IT Asset Team', nextStep: 'Resolve blockers before HR final settlement' },
    ];
  });

  readonly reportCards = computed<ReportCard[]>(() => {
    const assets = this.assets();
    const maintenanceCost = this.maintenance().reduce((total, item) => total + item.cost, 0);
    return [
      {
        title: 'Inventory Health',
        value: assets.length,
        description: `${assets.filter((asset) => asset.status === 'available').length} available, ${assets.filter((asset) => asset.status === 'assigned').length} assigned, ${assets.filter((asset) => asset.status === 'maintenance').length} in maintenance.`,
        action: 'Download inventory summary',
      },
      {
        title: 'Employee Asset Liability',
        value: assets.filter((asset) => asset.assignedToId).length,
        description: 'Shows who is holding company assets and what must be returned during transfer or exit.',
        action: 'Download employee mapping',
      },
      {
        title: 'Service Ticket Pipeline',
        value: this.pendingRequests().length,
        description: `${this.activeServiceRequests().length} active tickets include new assets, repairs, replacements, and IT support issues.`,
        action: 'Download service ticket report',
      },
      {
        title: 'Maintenance Cost',
        value: `Rs. ${Math.round(maintenanceCost / 1000)}K`,
        description: `${this.maintenance().filter((item) => item.status !== 'closed').length} open vendor follow-ups need attention.`,
        action: 'Download cost report',
      },
      {
        title: 'Warranty Risk',
        value: assets.filter((asset) => asset.warrantyStatus === 'expiring').length,
        description: 'Assets whose warranty is expiring soon should be renewed or planned for replacement.',
        action: 'Download warranty report',
      },
      {
        title: 'Exit Clearance Blockers',
        value: this.exitClearanceBlockerCount(),
        description: `${this.exitClearances().length} offboarding cases are waiting for IT asset clearance before HR can close exit.`,
        action: 'Download clearance list',
      },
    ];
  });

  openPage(page: PageKey): void {
    this.page.set(page);
  }

  requestStatusLabel(status: AssetRequest['status']): string {
    return {
      submitted: 'Submitted',
      manager_review: 'Manager Review',
      it_review: 'IT Review',
      approved: 'Approved',
      assigned: 'Assigned',
      repairing: 'Repairing',
      replaced: 'Replaced',
      rejected: 'Rejected',
      closed: 'Closed',
    }[status];
  }

  stageLabel(status: OffboardingStageStatus): string {
    return {
      completed: 'Completed',
      active: 'Active',
      waiting: 'Waiting',
      blocked: 'Blocked',
    }[status];
  }

  stageBadge(status: OffboardingStageStatus): string {
    return {
      completed: 'badge-green',
      active: 'badge-blue',
      waiting: 'badge-amber',
      blocked: 'badge-red',
    }[status];
  }

  linkedAssetForRequest(request: AssetRequest): Asset | undefined {
    return this.assets().find((asset) => asset.id === request.linkedAssetId);
  }

  openAsset(asset: Asset, tab: DetailTab = 'overview'): void {
    this.selectedAssetId.set(asset.id);
    this.detailTab.set(tab);
    this.page.set('details');
  }

  setTab(tab: DetailTab): void {
    this.detailTab.set(tab);
  }

  updateAssignmentDraft<K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]): void {
    this.assignmentDraft.update((draft) => ({ ...draft, [key]: value }));
  }

  updateReturnDraft<K extends keyof ReturnDraft>(key: K, value: ReturnDraft[K]): void {
    this.returnDraft.update((draft) => ({ ...draft, [key]: value }));
  }

  updateExitOutcomeDraft<K extends keyof ExitOutcomeDraft>(key: K, value: ExitOutcomeDraft[K]): void {
    this.exitOutcomeDraft.update((draft) => ({ ...draft, [key]: value }));
  }

  updateNewAsset(key: string, value: string | number): void {
    this.newAsset.update((asset) => ({ ...asset, [key]: value }));
  }

  employeeById(id?: string): Employee | undefined {
    return this.employees().find((employee) => employee.id === id);
  }

  historyForAsset(assetId: string): AssetHistoryEvent[] {
    return this.history()
      .filter((event) => event.assetId === assetId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  assignmentDateFor(assetId: string): string {
    return this.historyForAsset(assetId).find((event) => event.type === 'assigned' || event.type === 'transferred')?.timestamp ?? '';
  }

  isExitClearanceBlocker(status: AssetClearanceStatus): boolean {
    return status === 'pending_return' || status === 'damaged_maintenance' || status === 'missing_recovery' || status === 'under_repair' || status === 'lost_recovery';
  }

  exitClearanceStatusLabel(status: AssetClearanceStatus): string {
    return {
      pending_return: 'Pending Return',
      collected_good: 'Collected - Good',
      returned_verified: 'Returned and Verified',
      damaged_maintenance: 'Damaged - Maintenance',
      missing_recovery: 'Missing - Recovery',
      under_repair: 'Under Repair',
      lost_recovery: 'Lost - Recovery',
      retired: 'Retired',
      waived: 'Waived',
    }[status];
  }

  exitClearanceBadge(status: AssetClearanceStatus): string {
    return {
      pending_return: 'badge-amber',
      collected_good: 'badge-blue',
      returned_verified: 'badge-green',
      damaged_maintenance: 'badge-cyan',
      missing_recovery: 'badge-red',
      under_repair: 'badge-cyan',
      lost_recovery: 'badge-red',
      retired: 'badge-slate',
      waived: 'badge-slate',
    }[status];
  }

  openExitCase(caseId: string): void {
    this.selectedExitCaseId.set(caseId);
  }

  openExitAssetOutcome(caseId: string, item: ExitClearanceAssetItem): void {
    this.selectedExitCaseId.set(caseId);
    this.selectedExitAssetId.set(item.assetId);
    this.exitOutcomeDraft.set({
      status: item.status,
      returnedOn: item.returnedOn ?? '2026-06-05',
      verifiedBy: item.verifiedBy ?? 'Rahul Jain',
      condition: item.condition ?? 'good',
      actionRequired: item.actionRequired,
      remarks: item.remarks,
    });
    this.showExitOutcomeDialog.set(true);
  }

  updateExitStatus(status: AssetClearanceStatus): void {
    const defaults: Record<AssetClearanceStatus, Pick<ExitOutcomeDraft, 'condition' | 'actionRequired' | 'remarks'>> = {
      pending_return: {
        condition: 'good',
        actionRequired: 'Employee must return asset to IT before final HR clearance.',
        remarks: 'Follow up with employee and manager.',
      },
      returned_verified: {
        condition: 'good',
        actionRequired: 'No further action. Asset return has been verified by IT.',
        remarks: 'Returned with required accessories and verified physically.',
      },
      collected_good: {
        condition: 'good',
        actionRequired: 'Asset collected by IT. Complete physical verification and accessory check.',
        remarks: 'Collected at IT desk and queued for verification.',
      },
      damaged_maintenance: {
        condition: 'damaged',
        actionRequired: 'Move asset to maintenance and record repair/recovery decision.',
        remarks: 'Damage identified during IT inspection.',
      },
      missing_recovery: {
        condition: 'missing',
        actionRequired: 'Asset is missing. Coordinate with employee, HR, and Finance for recovery decision.',
        remarks: 'Employee could not produce the asset during clearance.',
      },
      under_repair: {
        condition: 'under_repair',
        actionRequired: 'Asset collected but requires repair before inventory can be reused.',
        remarks: 'Repair ticket must be linked and monitored by IT.',
      },
      lost_recovery: {
        condition: 'lost',
        actionRequired: 'Finance recovery decision required for lost asset.',
        remarks: 'Employee reported the asset as lost during offboarding.',
      },
      retired: {
        condition: 'damaged',
        actionRequired: 'Asset recovered and retired from active inventory.',
        remarks: 'Retirement approved after IT inspection.',
      },
      waived: {
        condition: 'good',
        actionRequired: 'Exception approved. HR and IT can close this asset row.',
        remarks: 'Waiver approved by HR and IT.',
      },
    };

    this.exitOutcomeDraft.update((draft) => ({ ...draft, status, ...defaults[status] }));
  }

  saveExitAssetOutcome(): void {
    const caseId = this.selectedExitCaseId();
    const assetId = this.selectedExitAssetId();
    const draft = this.exitOutcomeDraft();

    this.exitClearances.update((cases) =>
      cases.map((clearance) => {
        if (clearance.id !== caseId) {
          return clearance;
        }

        const assetItems = clearance.assetItems.map((item) =>
          item.assetId === assetId
            ? {
                ...item,
                status: draft.status,
                returnedOn: draft.status === 'pending_return' ? undefined : draft.returnedOn,
                verifiedBy: draft.status === 'pending_return' ? undefined : draft.verifiedBy,
                condition: draft.status === 'pending_return' || draft.status === 'waived' ? undefined : draft.condition,
                actionRequired: draft.actionRequired,
                remarks: draft.remarks,
              }
            : item,
        );

        const hasBlocker = assetItems.some((item) => this.isExitClearanceBlocker(item.status));
        return { ...clearance, status: hasBlocker ? 'blocked' : 'ready', assetItems };
      }),
    );

    this.assets.update((assets) =>
      assets.map((asset) => {
        if (asset.id !== assetId) {
          return asset;
        }

        if (draft.status === 'returned_verified' || draft.status === 'collected_good' || draft.status === 'waived') {
          return { ...asset, status: 'available', assignedToId: undefined, location: 'Storage Room B', office: 'Storage Room B', desk: undefined, storage: 'Storage Room B' };
        }

        if (draft.status === 'damaged_maintenance' || draft.status === 'under_repair') {
          return { ...asset, status: 'maintenance', assignedToId: undefined, location: 'IT Support Bay', office: 'IT Support Bay', desk: undefined, storage: undefined };
        }

        if (draft.status === 'missing_recovery' || draft.status === 'lost_recovery') {
          return { ...asset, status: 'lost', assignedToId: undefined, desk: undefined, storage: undefined };
        }

        if (draft.status === 'retired') {
          return { ...asset, status: 'retired', assignedToId: undefined, desk: undefined, storage: 'Retired Inventory' };
        }

        return asset;
      }),
    );

    this.addHistoryEvent({
      assetId,
      type: draft.status === 'damaged_maintenance' ? 'maintenance_created' : draft.status === 'pending_return' ? 'updated' : 'returned',
      title: 'Exit clearance asset updated',
      description: `IT marked this asset as ${this.exitClearanceStatusLabel(draft.status)} during employee offboarding.`,
      condition: draft.status === 'pending_return' || draft.status === 'waived' ? undefined : draft.condition,
      notes: draft.remarks,
      source: 'workflow',
      metadata: {
        exitCaseId: caseId,
        actionRequired: draft.actionRequired,
      },
    });

    this.showExitOutcomeDialog.set(false);
  }

  currentHolderId(assetId: string): string | undefined {
    const events = this.history()
      .filter((event) => event.assetId === assetId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let holderId: string | undefined;
    for (const event of events) {
      if (event.type === 'assigned') {
        holderId = event.toEmployeeId;
      }
      if (event.type === 'transferred') {
        holderId = event.toEmployeeId;
      }
      if (event.type === 'returned' || event.type === 'retired' || event.type === 'deleted') {
        holderId = undefined;
      }
    }

    return holderId;
  }

  assignSelectedAsset(): void {
    const asset = this.selectedAsset();
    const draft = this.assignmentDraft();
    const employee = this.employeeById(draft.employeeId);
    if (!employee) {
      return;
    }

    const previousHolderId = this.currentHolderId(asset.id) ?? asset.assignedToId;
    const type: AssetHistoryType = previousHolderId ? 'transferred' : 'assigned';
    const previousEmployee = this.employeeById(previousHolderId);

    this.assets.update((assets) =>
      assets.map((item) =>
        item.id === asset.id
          ? {
              ...item,
              status: 'assigned',
              assignedToId: employee.id,
              location: employee.location,
              office: employee.location,
              storage: undefined,
            }
          : item,
      ),
    );

    this.addHistoryEvent({
      assetId: asset.id,
      type,
      fromEmployeeId: previousHolderId,
      toEmployeeId: employee.id,
      fromLocation: previousEmployee?.location ?? asset.storage ?? asset.location,
      toLocation: employee.location,
      title: type === 'transferred' ? 'Asset transferred' : 'Asset assigned',
      description:
        type === 'transferred'
          ? `${asset.name} moved from ${previousEmployee?.name ?? 'previous holder'} to ${employee.name}.`
          : `${asset.name} was assigned to ${employee.name}.`,
      notes: draft.remarks,
      source: 'workflow',
      metadata: {
        assignedDate: draft.assignedDate,
        expectedReturnDate: draft.expectedReturnDate,
      },
    });

    this.showAssignDialog.set(false);
    this.detailTab.set('history');
  }

  returnSelectedAsset(): void {
    const asset = this.selectedAsset();
    const holderId = this.currentHolderId(asset.id) ?? asset.assignedToId;
    const holder = this.employeeById(holderId);
    const draft = this.returnDraft();

    this.assets.update((assets) =>
      assets.map((item) =>
        item.id === asset.id
          ? {
              ...item,
              status: draft.condition === 'lost' ? 'lost' : draft.condition === 'damaged' ? 'maintenance' : 'available',
              assignedToId: undefined,
              location: draft.condition === 'damaged' ? 'IT Support Bay' : 'Storage Room B',
              office: draft.condition === 'damaged' ? 'IT Support Bay' : 'Storage Room B',
              desk: undefined,
              storage: draft.condition === 'damaged' ? undefined : 'Storage Room B',
            }
          : item,
      ),
    );

    this.addHistoryEvent({
      assetId: asset.id,
      type: 'returned',
      fromEmployeeId: holderId,
      toLocation: draft.condition === 'damaged' ? 'IT Support Bay' : 'Storage Room B',
      condition: draft.condition,
      title: 'Asset returned',
      description: `${asset.name} was returned${holder ? ` by ${holder.name}` : ''}.`,
      notes: draft.remarks,
      source: 'workflow',
      metadata: { returnDate: draft.returnDate },
    });

    if (draft.condition === 'damaged') {
      this.addHistoryEvent({
        assetId: asset.id,
        type: 'maintenance_created',
        title: 'Maintenance record opened',
        description: 'A maintenance record was opened from the damaged return workflow.',
        source: 'workflow',
        metadata: { reason: 'Damaged return' },
      });
    }

    this.showReturnDialog.set(false);
    this.detailTab.set('history');
  }

  retireSelectedAsset(): void {
    const asset = this.selectedAsset();
    this.assets.update((assets) => assets.map((item) => (item.id === asset.id ? { ...item, status: 'retired', assignedToId: undefined } : item)));
    this.addHistoryEvent({
      assetId: asset.id,
      type: 'retired',
      title: 'Asset retired',
      description: `${asset.name} was retired from active inventory.`,
      source: 'manual',
      metadata: { reason: 'End of life' },
    });
    this.detailTab.set('history');
  }

  addMaintenanceRecord(): void {
    const asset = this.selectedAsset();
    this.showMaintenanceSheet.set(false);
    this.assets.update((assets) => assets.map((item) => (item.id === asset.id ? { ...item, status: 'maintenance' } : item)));
    this.addHistoryEvent({
      assetId: asset.id,
      type: 'maintenance_created',
      title: 'Maintenance record opened',
      description: 'Keyboard replacement was logged and assigned to Dell Care.',
      source: 'manual',
      metadata: { vendor: 'Dell Care', cost: 4200 },
    });
    this.detailTab.set('history');
  }

  eventIcon(type: AssetHistoryType): string {
    return {
      created: '+',
      updated: 'U',
      assigned: 'A',
      returned: 'R',
      transferred: 'T',
      maintenance_created: 'M',
      maintenance_closed: 'C',
      document_uploaded: 'D',
      retired: 'X',
      deleted: '!',
    }[type];
  }

  eventTone(type: AssetHistoryType): string {
    if (type === 'assigned' || type === 'transferred') return 'blue';
    if (type === 'returned' || type === 'maintenance_closed') return 'green';
    if (type === 'maintenance_created' || type === 'document_uploaded') return 'cyan';
    if (type === 'retired' || type === 'deleted') return 'red';
    return 'slate';
  }

  private addHistoryEvent(event: Omit<AssetHistoryEvent, 'id' | 'actorId' | 'actorName' | 'timestamp'> & Partial<Pick<AssetHistoryEvent, 'actorId' | 'actorName' | 'timestamp'>>): void {
    const asset = this.assets().find((item) => item.id === event.assetId);
    this.history.update((history) => [
      ...history,
      {
        id: `HIS-${event.assetId}-${Date.now()}`,
        actorId: event.actorId ?? 'EMP-2007',
        actorName: event.actorName ?? 'Rahul Jain',
        timestamp: event.timestamp ?? new Date().toISOString(),
        source: event.source,
        title: event.title,
        description: event.description,
        assetId: event.assetId,
        type: event.type,
        fromEmployeeId: event.fromEmployeeId,
        toEmployeeId: event.toEmployeeId,
        fromLocation: event.fromLocation,
        toLocation: event.toLocation ?? asset?.location,
        condition: event.condition,
        notes: event.notes,
        metadata: event.metadata,
      },
    ]);
  }
}
