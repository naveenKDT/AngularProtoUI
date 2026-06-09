import {
  Asset,
  AssetCategory,
  AssetDocument,
  AssetHistoryEvent,
  AssetRequest,
  AssetServiceRequestType,
  Employee,
  AssetClearanceStatus,
  ExitClearanceStatus,
  ReturnCondition,
  ExitClearanceCase,
  MaintenanceRecord,
  OffboardingStageStatus,
  OffboardingCase,
  ServiceCategory,
} from './asset-management.models';

const categories: AssetCategory[] = ['Laptop', 'Desktop', 'Phone', 'Monitor', 'Accessory', 'ID Card', 'Printer', 'Office Device'];
const buildings = ['Bengaluru HQ', 'Hyderabad Office', 'Pune Office', 'Mumbai Office'];
const cities = ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai'];
const departments = ['Engineering', 'People Ops', 'Finance', 'Sales', 'IT Support', 'Design'];
const assetNames = [
  ['Dell Latitude 7440', 'Dell', 'Latitude 7440', 'Business Laptop'],
  ['MacBook Pro 14', 'Apple', 'M3 Pro', 'Business Laptop'],
  ['iPhone 15', 'Apple', '15', 'Corporate Phone'],
  ['Logitech MX Keys', 'Logitech', 'MX Keys', 'Keyboard'],
  ['HP LaserJet M404', 'HP', 'M404', 'Printer'],
  ['YubiKey 5 NFC', 'Yubico', '5 NFC', 'Security Key'],
  ['Dell UltraSharp U2723QE', 'Dell', 'U2723QE', 'Monitor'],
  ['Zebra ZC300', 'Zebra', 'ZC300', 'ID Card Printer'],
];
const conditions = ['New', 'Good', 'Fair', 'Damaged'] as const;

const requestTypes: AssetServiceRequestType[] = ['New Asset', 'Replacement', 'Repair', 'Lost Asset', 'Software Installation', 'Hardware Support', 'Access Request', 'General IT Support'];

export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 20 }, (_, index) => {
  const names = [
    'Aditi Sharma',
    'Karan Mehta',
    'Priya Nair',
    'Arjun Rao',
    'Neha Kapoor',
    'Riya Shah',
    'Rahul Jain',
    'Sana Khan',
    'Vikram Iyer',
    'Meera Menon',
    'Ananya Das',
    'Dev Patel',
    'Ishaan Verma',
    'Tanvi Gupta',
    'Nikhil Reddy',
    'Pooja Bansal',
    'Kabir Sethi',
    'Shruti Kulkarni',
    'Manav Joshi',
    'Avni Singh',
  ];

  const name = names[index];
  return {
    id: `EMP-${String(2001 + index).padStart(4, '0')}`,
    name,
    department: departments[index % departments.length],
    designation: ['Product Engineer', 'HR Partner', 'Finance Analyst', 'Sales Manager', 'IT Specialist'][index % 5],
    location: buildings[index % buildings.length],
    avatar: name
      .split(' ')
      .map((part) => part[0])
      .join(''),
  };
});

export const MOCK_ASSETS: Asset[] = Array.from({ length: 50 }, (_, index) => {
  const base = assetNames[index % assetNames.length];
  const category = categories[index % categories.length];
  const assigned = index % 5 !== 1 && index % 7 !== 0;
  const maintenance = index % 11 === 0;
  const retired = index % 17 === 0;
  const warrantyExpiring = index % 9 === 0;
  const building = buildings[index % buildings.length];
  const city = cities[index % cities.length];

  return {
    id: `AST-ID-${String(1001 + index)}`,
    tag: `AST-${String(1001 + index)}`,
    name: base[0],
    category,
    type: base[3],
    brand: base[1],
    model: base[2],
    modelNumber: `MN-${1000 + index}`,
    serialNumber: `${base[1].slice(0, 2).toUpperCase()}-${String(7440 + index)}-${String(index * 37).padStart(4, '0')}`,
    condition: conditions[index % conditions.length],
    status: retired ? 'retired' : maintenance ? 'maintenance' : assigned ? 'assigned' : 'available',
    assignedToId: assigned && !retired ? MOCK_EMPLOYEES[index % MOCK_EMPLOYEES.length].id : undefined,
    // Location
    building,
    floor: String((index % 10) + 1),
    zone: departments[index % departments.length],
    desk: assigned ? `${String.fromCharCode(65 + (index % 6))}-${800 + index}` : undefined,
    city,
    state: 'Karnataka',
    // Procurement
    purchaseDate: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 26) + 1).padStart(2, '0')}`,
    purchaseCost: 2500 + index * 3200,
    vendor: ['Softline Systems', 'Dell Care', 'Apple Enterprise', 'OfficeKart', 'SecureIT'][index % 5],
    purchaseOrderNumber: `PO-${2025 + Math.floor(index / 12)}-${String(index % 100).padStart(3, '0')}`,
    invoiceNumber: `INV-${88421 + index}`,
    deliveryDate: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 26) + 1).padStart(2, '0')}`,
    paymentTerms: ['Net 30', 'Prepaid', 'EMI'][index % 3],
    // Warranty
    warrantyProvider: ['Dell Care', 'AppleCare', 'HP Support'][index % 3],
    warrantyPeriod: [1, 2, 3][index % 3],
    warrantyStart: `2025-${String((index % 12) + 1).padStart(2, '0')}-01`,
    warrantyEnd: warrantyExpiring ? '2026-06-20' : `2027-${String((index % 12) + 1).padStart(2, '0')}-28`,
    warrantyStatus: warrantyExpiring ? 'expiring' : retired ? 'expired' : 'active',
    warrantyContact: '+91-9876543210',
    warrantyEmail: 'support@example.com',
    // Specifications
    specifications: {
      processor: 'Intel Core i7-1355U',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      operatingSystem: 'Windows 11 Pro',
    },
    // Additional
    notes: index % 3 === 0 ? 'Issued for remote work setup.' : undefined,
  };
});

export const MOCK_MAINTENANCE: MaintenanceRecord[] = MOCK_ASSETS.filter((_, index) => index % 6 === 0).map((asset, index) => ({
  id: `MNT-${900 + index}`,
  assetId: asset.id,
  issue: ['Keyboard replacement', 'Battery health check', 'Display flicker', 'Printer roller cleaning'][index % 4],
  vendor: ['Dell Care', 'Softline Systems', 'Apple Enterprise'][index % 3],
  cost: 1200 + index * 850,
  repairDate: `2026-0${(index % 6) + 1}-14`,
  status: index % 3 === 0 ? 'open' : index % 3 === 1 ? 'in_progress' : 'closed',
  remarks: 'Logged by IT Support with vendor follow-up.',
}));

export const MOCK_DOCUMENTS: AssetDocument[] = MOCK_ASSETS.slice(0, 12).flatMap((asset, index) => [
  {
    id: `DOC-${asset.tag}-INV`,
    assetId: asset.id,
    name: `${asset.tag}-invoice.pdf`,
    type: 'Invoice PDF',
    uploadedBy: 'Rahul Jain',
    uploadedAt: `2026-05-${String((index % 20) + 1).padStart(2, '0')}T10:30:00`,
  },
  {
    id: `DOC-${asset.tag}-WAR`,
    assetId: asset.id,
    name: `${asset.tag}-warranty.pdf`,
    type: 'Warranty PDF',
    uploadedBy: 'Rahul Jain',
    uploadedAt: `2026-05-${String((index % 20) + 1).padStart(2, '0')}T10:40:00`,
  },
]);

export const MOCK_REQUESTS: AssetRequest[] = Array.from({ length: 18 }, (_, index) => {
  const employee = MOCK_EMPLOYEES[index % MOCK_EMPLOYEES.length];
  const assignedAssets = MOCK_ASSETS.filter((asset) => asset.assignedToId === employee.id);
  const requestType = requestTypes[index % requestTypes.length];
  const linkedAsset = ['New Asset', 'Software Installation', 'Access Request', 'General IT Support'].includes(requestType) ? undefined : assignedAssets[index % Math.max(assignedAssets.length, 1)];
  const statusCycle: AssetRequest['status'][] = ['submitted', 'manager_review', 'it_review', 'approved', 'assigned', 'repairing', 'replaced', 'closed', 'rejected'];
  const status = statusCycle[index % statusCycle.length];
  const assignedToTeamByStatus: Record<AssetRequest['status'], AssetRequest['assignedToTeam']> = {
    submitted: 'Manager',
    manager_review: 'Manager',
    it_review: 'IT Support',
    approved: 'IT Asset Team',
    assigned: 'IT Asset Team',
    repairing: 'IT Support',
    replaced: 'IT Asset Team',
    rejected: 'Closed',
    closed: 'Closed',
  };
  const categoryByRequestType: Record<AssetServiceRequestType, ServiceCategory> = {
    'New Asset': 'Asset Request',
    Replacement: 'Asset Issue',
    Repair: 'Asset Issue',
    'Lost Asset': 'Asset Issue',
    'Software Installation': 'Software',
    'Hardware Support': 'Hardware',
    'Access Request': 'Access',
    'General IT Support': 'General IT',
  };

  return {
    id: `ASR-${901 + index}`,
    employeeId: employee.id,
    requestType,
    category: categoryByRequestType[requestType],
    subcategory: [
      'Laptop allocation',
      'Device replacement',
      'Diagnostics and repair',
      'Lost company property',
      'Licensed software',
      'Peripheral/device support',
      'Application access',
      'IT helpdesk',
    ][index % 8],
    assetType: linkedAsset?.category ?? categories[index % categories.length],
    linkedAssetId: linkedAsset?.id,
    reason: [
      'New hire workstation setup',
      'Replacement requested for unstable device',
      'Keyboard replacement and diagnostics',
      'Employee reported an assigned asset as missing',
      'Need design software for project delivery',
      'Laptop battery drains within one hour',
      'VPN and project repository access required',
      'General IT support required for assigned workstation',
    ][index % 8],
    businessJustification: [
      'Required to complete onboarding and enable day-one productivity.',
      'Current device impacts customer delivery and meeting reliability.',
      'Repair is needed before the employee can continue hybrid work.',
      'Loss must be recorded for recovery, replacement, and finance action.',
      'Project work requires approved licensed software.',
      'Hardware issue blocks daily assigned work.',
      'Access is required for approved project responsibilities.',
      'Support request impacts employee productivity.',
    ][index % 8],
    priority: index % 5 === 0 ? 'high' : index % 3 === 0 ? 'medium' : 'low',
    status,
    requestedAt: `2026-05-${String((index % 24) + 1).padStart(2, '0')}T09:15:00`,
    assignedToTeam: assignedToTeamByStatus[status],
    currentOwner: {
      submitted: employee.name,
      manager_review: 'Reporting Manager',
      it_review: 'Rahul Jain',
      approved: 'IT Asset Team',
      assigned: 'Rahul Jain',
      repairing: 'Vendor Desk',
      replaced: 'IT Asset Team',
      rejected: 'Closed',
      closed: 'Closed',
    }[status],
    slaDue: `2026-06-${String((index % 18) + 6).padStart(2, '0')}T18:00:00`,
    lastUpdatedAt: `2026-06-${String((index % 5) + 1).padStart(2, '0')}T14:20:00`,
    attachments: index % 3 === 0 ? [`ASR-${901 + index}-screenshot.png`, `ASR-${901 + index}-device-photo.jpg`] : [],
    communication: [
      `${employee.name}: ${requestType} submitted with asset context.`,
      'System: IT team notified automatically.',
      `${status === 'closed' || status === 'rejected' ? 'System: Request closed.' : 'Rahul Jain: Request is queued for workflow action.'}`,
    ],
    internalNotes: [
      'Validate employee asset history before fulfillment.',
      status === 'repairing' ? 'Vendor estimate requested; keep employee updated.' : 'No blocker identified by IT desk.',
    ],
    approvalHistory: [
      'System: Ticket created and routed by category.',
      status === 'manager_review' ? 'Pending manager approval.' : 'Manager approval not required or already completed.',
      ['approved', 'assigned', 'repairing', 'replaced', 'closed'].includes(status) ? 'IT approval completed.' : 'IT approval pending.',
    ],
    auditLogs: [
      `Created ${requestType} ticket on 2026-05-${String((index % 24) + 1).padStart(2, '0')}.`,
      `Assigned to ${assignedToTeamByStatus[status]}.`,
      `Last updated 2026-06-${String((index % 5) + 1).padStart(2, '0')}.`,
    ],
    escalationLevel: index % 7 === 0 ? 'manager' : index % 5 === 0 ? 'team_lead' : 'none',
    nextAction: {
      submitted: 'Notify manager and move to business approval.',
      manager_review: 'Manager/HR must approve or reject the business need.',
      it_review: 'IT must triage, assign owner, and decide repair, replacement, or assignment.',
      approved: 'IT must reserve stock and assign an asset.',
      assigned: 'Confirm employee acknowledgement and close ticket.',
      repairing: 'Track vendor repair and update maintenance history.',
      replaced: 'Link replacement asset and close employee communication.',
      rejected: 'No further action.',
      closed: 'No further action.',
    }[status],
  };
});

const exitingEmployeeIds = ['EMP-2001', 'EMP-2003', 'EMP-2009', 'EMP-2014'];

export const MOCK_EXIT_CLEARANCES: ExitClearanceCase[] = exitingEmployeeIds.map((employeeId, caseIndex) => {
  const assignedAssets = MOCK_ASSETS.filter((asset) => asset.assignedToId === employeeId);
  const assetItems = assignedAssets.map((asset, assetIndex) => {
    const status = (caseIndex === 0 && assetIndex === 0
      ? 'pending_return'
      : caseIndex === 1 && assetIndex === 0
        ? 'damaged_maintenance'
        : caseIndex === 2 && assetIndex === 1
          ? 'missing_recovery'
          : caseIndex === 3 && assetIndex === 0
            ? 'under_repair'
            : caseIndex === 3 && assetIndex === 1
              ? 'lost_recovery'
            : assetIndex % 5 === 0
              ? 'collected_good'
              : 'returned_verified') as AssetClearanceStatus;

    const condition: ReturnCondition | undefined = status === 'damaged_maintenance' ? 'damaged' : status === 'missing_recovery' ? 'missing' : status === 'under_repair' ? 'under_repair' : status === 'lost_recovery' ? 'lost' : status === 'returned_verified' || status === 'collected_good' ? 'good' : undefined;

    return {
      assetId: asset.id,
      status,
      returnedOn: status === 'pending_return' ? undefined : `2026-06-0${assetIndex + 1}`,
      verifiedBy: status === 'pending_return' ? undefined : 'Rahul Jain',
      condition,
      actionRequired: {
        pending_return: 'Employee must return asset to IT before final HR clearance.',
        collected_good: 'Asset collected by IT and ready for final verification.',
        returned_verified: 'No further action. Asset return has been verified by IT.',
        damaged_maintenance: 'Move asset to maintenance and record repair/recovery decision.',
        missing_recovery: 'Asset is missing. Finance and HR recovery decision required.',
        under_repair: 'Asset collected and sent for repair before inventory status can be closed.',
        lost_recovery: 'Finance recovery decision required for lost asset.',
        retired: 'Asset recovered and retired from active inventory.',
        waived: 'Waiver approved by HR and IT.',
      }[status],
      remarks: {
        pending_return: 'Reminder sent to employee and manager.',
        collected_good: 'Collected at IT desk; accessory checklist pending.',
        returned_verified: 'Returned with required accessories and verified physically.',
        damaged_maintenance: 'Visible damage found during return inspection.',
        missing_recovery: 'Employee could not locate the asset during clearance.',
        under_repair: 'Asset received but requires repair before reuse.',
        lost_recovery: 'Employee reported the asset as lost during offboarding.',
        retired: 'Recovered asset is at end of life.',
        waived: 'Cleared through exception approval.',
      }[status],
    };
  });

  const hasBlocker = assetItems.some((item) => item.status === 'pending_return' || item.status === 'damaged_maintenance' || item.status === 'missing_recovery' || item.status === 'under_repair' || item.status === 'lost_recovery');
  const status: ExitClearanceStatus = hasBlocker ? 'blocked' : 'ready';
  const managerApproval: OffboardingStageStatus = caseIndex === 0 ? 'active' : 'completed';
  const knowledgeTransfer: OffboardingStageStatus = caseIndex === 1 ? 'waiting' : 'completed';
  const accessRevocation: OffboardingStageStatus = hasBlocker ? 'waiting' : 'completed';
  const payrollSettlement: OffboardingStageStatus = hasBlocker ? 'blocked' : 'active';
  const documentsIssued: OffboardingStageStatus = hasBlocker ? 'waiting' : 'active';

  return {
    id: `EXIT-${7001 + caseIndex}`,
    employeeId,
    offboardingId: `OFF-${5001 + caseIndex}`,
    triggeredBy: 'Meera Menon',
    triggeredAt: `2026-06-0${caseIndex + 1}T10:00:00`,
    lastWorkingDay: `2026-06-${String(14 + caseIndex * 3).padStart(2, '0')}`,
    status,
    separationType: ['Resignation', 'Termination', 'Contract End', 'Resignation'][caseIndex] as ExitClearanceCase['separationType'],
    hrOwner: 'Meera Menon',
    managerApproval,
    knowledgeTransfer,
    accessRevocation,
    payrollSettlement,
    documentsIssued,
    assetItems,
  };
}).filter((clearance) => clearance.assetItems.length > 0);

export const MOCK_OFFBOARDING_CASES: OffboardingCase[] = MOCK_EXIT_CLEARANCES.map((clearance, index) => ({
  id: clearance.offboardingId,
  employeeId: clearance.employeeId,
  exitClearanceId: clearance.id,
  separationType: clearance.separationType,
  resignationDate: `2026-05-${String(16 + index).padStart(2, '0')}`,
  noticeStart: `2026-05-${String(18 + index).padStart(2, '0')}`,
  lastWorkingDay: clearance.lastWorkingDay,
  hrOwner: clearance.hrOwner,
  managerName: ['Dev Patel', 'Ananya Das', 'Karan Mehta', 'Neha Kapoor'][index % 4],
  status: clearance.status === 'ready' ? 'settlement_pending' : index === 0 ? 'notice_period' : 'clearance_in_progress',
  exitInterview: index === 0 ? 'active' : 'completed',
  knowledgeTransfer: clearance.knowledgeTransfer,
  managerClearance: clearance.managerApproval,
  hrClearance: clearance.status === 'ready' ? 'active' : 'waiting',
  payrollSettlement: clearance.payrollSettlement,
  benefitsReview: index % 2 === 0 ? 'waiting' : 'completed',
  accessRevocation: clearance.accessRevocation,
  checklistCompletion: clearance.status === 'ready' ? 78 : 44 + index * 8,
}));

export const MOCK_HISTORY: AssetHistoryEvent[] = MOCK_ASSETS.flatMap((asset, index) => {
  const employee = asset.assignedToId ? MOCK_EMPLOYEES.find((item) => item.id === asset.assignedToId) : undefined;
  const createdAt = `2025-${String((index % 12) + 1).padStart(2, '0')}-03T09:00:00`;
  const events: AssetHistoryEvent[] = [
    {
      id: `HIS-${asset.tag}-CREATED`,
      assetId: asset.id,
      type: 'created',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: createdAt,
      source: 'manual',
      toLocation: asset.building,
      title: 'Asset created',
      description: `${asset.name} was added to the asset registry.`,
      metadata: { invoiceNumber: asset.invoiceNumber ?? '', vendor: asset.vendor },
    },
    {
      id: `HIS-${asset.tag}-DOC`,
      assetId: asset.id,
      type: 'document_uploaded',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2025-${String((index % 12) + 1).padStart(2, '0')}-04T11:20:00`,
      source: 'manual',
      title: 'Documents uploaded',
      description: 'Invoice and warranty files were attached.',
      metadata: { documentCount: 2 },
    },
  ];

  if (employee) {
    events.push({
      id: `HIS-${asset.tag}-ASSIGNED`,
      assetId: asset.id,
      type: 'assigned',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2025-${String(((index + 1) % 12) + 1).padStart(2, '0')}-08T14:30:00`,
      source: 'workflow',
      toEmployeeId: employee.id,
      fromLocation: asset.building,
      toLocation: employee.location,
      title: 'Asset assigned',
      description: `${asset.name} was assigned to ${employee.name}.`,
      notes: 'Issued after manager approval.',
      metadata: { expectedReturnDate: '2027-05-21' },
    });
  }

  if (index % 8 === 0 && employee) {
    const nextEmployee = MOCK_EMPLOYEES[(index + 3) % MOCK_EMPLOYEES.length];
    events.push({
      id: `HIS-${asset.tag}-TRANSFERRED`,
      assetId: asset.id,
      type: 'transferred',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2026-02-${String((index % 20) + 1).padStart(2, '0')}T16:45:00`,
      source: 'workflow',
      fromEmployeeId: employee.id,
      toEmployeeId: nextEmployee.id,
      fromLocation: employee.location,
      toLocation: nextEmployee.location,
      title: 'Asset transferred',
      description: `${asset.name} moved from ${employee.name} to ${nextEmployee.name}.`,
    });
  }

  if (index % 6 === 0) {
    events.push({
      id: `HIS-${asset.tag}-MNT`,
      assetId: asset.id,
      type: 'maintenance_created',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2026-03-${String((index % 20) + 1).padStart(2, '0')}T10:10:00`,
      source: 'manual',
      title: 'Maintenance record opened',
      description: 'An issue was logged and assigned to the vendor.',
      metadata: { vendor: 'Dell Care', cost: 4200 },
    });
  }

  if (index % 10 === 0 && employee) {
    events.push({
      id: `HIS-${asset.tag}-RETURNED`,
      assetId: asset.id,
      type: 'returned',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2026-04-${String((index % 20) + 1).padStart(2, '0')}T13:20:00`,
      source: 'workflow',
      fromEmployeeId: employee.id,
      toLocation: 'Storage Room B',
      condition: index % 20 === 0 ? 'damaged' : 'good',
      title: 'Asset returned',
      description: `${asset.name} was returned by ${employee.name}.`,
      notes: index % 20 === 0 ? 'Returned with visible wear. Inspection required.' : 'Returned with accessories.',
    });
  }

  if (asset.status === 'retired') {
    events.push({
      id: `HIS-${asset.tag}-RETIRED`,
      assetId: asset.id,
      type: 'retired',
      actorId: 'EMP-2007',
      actorName: 'Rahul Jain',
      timestamp: `2026-05-${String((index % 20) + 1).padStart(2, '0')}T15:05:00`,
      source: 'manual',
      title: 'Asset retired',
      description: `${asset.name} was retired from active inventory.`,
      metadata: { reason: 'End of life' },
    });
  }

  return events;
});
