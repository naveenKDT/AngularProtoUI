export type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'retired' | 'lost';
export type WarrantyStatus = 'active' | 'expiring' | 'expired';
export type AssetCategory = 'Laptop' | 'Phone' | 'Monitor' | 'Accessory' | 'ID Card' | 'Printer' | 'Office Device';
export type RequestStatus = 'submitted' | 'manager_review' | 'it_review' | 'approved' | 'assigned' | 'repairing' | 'replaced' | 'rejected' | 'closed';
export type MaintenanceStatus = 'open' | 'in_progress' | 'closed';
export type ReturnCondition = 'good' | 'damaged' | 'missing' | 'under_repair' | 'lost';
export type ExitClearanceStatus = 'in_progress' | 'blocked' | 'ready' | 'completed';
export type AssetClearanceStatus = 'pending_return' | 'collected_good' | 'returned_verified' | 'damaged_maintenance' | 'missing_recovery' | 'under_repair' | 'lost_recovery' | 'retired' | 'waived';
export type AssetTicketStatus = 'open' | 'triaged' | 'maintenance_created' | 'closed';
export type AssetTicketPriority = 'low' | 'medium' | 'high';
export type AssetServiceRequestType = 'New Asset' | 'Replacement' | 'Repair' | 'Lost Asset' | 'Software Installation' | 'Hardware Support' | 'Access Request' | 'General IT Support';
export type ServiceCategory = 'Asset Request' | 'Asset Issue' | 'Software' | 'Hardware' | 'Access' | 'General IT';
export type OffboardingStageStatus = 'completed' | 'active' | 'waiting' | 'blocked';
export type OffboardingStatus = 'initiated' | 'notice_period' | 'clearance_in_progress' | 'settlement_pending' | 'completed';

export type AssetHistoryType =
  | 'created'
  | 'updated'
  | 'assigned'
  | 'returned'
  | 'transferred'
  | 'maintenance_created'
  | 'maintenance_closed'
  | 'document_uploaded'
  | 'retired'
  | 'deleted';

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  location: string;
  avatar: string;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: AssetCategory;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  assignedToId?: string;
  location: string;
  office: string;
  floor: string;
  desk?: string;
  storage?: string;
  purchaseDate: string;
  purchaseCost: number;
  vendor: string;
  invoiceNumber: string;
  warrantyStart: string;
  warrantyEnd: string;
  warrantyStatus: WarrantyStatus;
}

export interface AssetHistoryEvent {
  id: string;
  assetId: string;
  type: AssetHistoryType;
  actorId: string;
  actorName: string;
  timestamp: string;
  source: 'system' | 'manual' | 'workflow' | 'import';
  fromEmployeeId?: string;
  toEmployeeId?: string;
  fromLocation?: string;
  toLocation?: string;
  condition?: ReturnCondition;
  title: string;
  description: string;
  notes?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  issue: string;
  vendor: string;
  cost: number;
  repairDate: string;
  status: MaintenanceStatus;
  remarks: string;
}

export interface AssetDocument {
  id: string;
  assetId: string;
  name: string;
  type: 'Invoice PDF' | 'Warranty PDF' | 'Asset Image' | 'Repair Document';
  uploadedBy: string;
  uploadedAt: string;
}

export interface AssetRequest {
  id: string;
  employeeId: string;
  requestType: AssetServiceRequestType;
  category: ServiceCategory;
  subcategory: string;
  assetType: AssetCategory;
  linkedAssetId?: string;
  reason: string;
  businessJustification: string;
  priority: AssetTicketPriority;
  status: RequestStatus;
  requestedAt: string;
  assignedToTeam: 'Manager' | 'HR' | 'IT Support' | 'IT Asset Team' | 'Finance' | 'Closed';
  currentOwner: string;
  slaDue: string;
  lastUpdatedAt: string;
  attachments: string[];
  communication: string[];
  internalNotes: string[];
  approvalHistory: string[];
  auditLogs: string[];
  escalationLevel: 'none' | 'team_lead' | 'manager' | 'critical';
  nextAction: string;
}

export interface AssetTicket {
  id: string;
  assetId: string;
  employeeId: string;
  category: 'Issue' | 'Damage' | 'Lost' | 'Accessory' | 'Other';
  subject: string;
  description: string;
  priority: AssetTicketPriority;
  status: AssetTicketStatus;
  createdAt: string;
  linkedMaintenanceId?: string;
}

export interface ExitClearanceAssetItem {
  assetId: string;
  status: AssetClearanceStatus;
  returnedOn?: string;
  verifiedBy?: string;
  condition?: ReturnCondition;
  actionRequired: string;
  remarks: string;
}

export interface ExitClearanceCase {
  id: string;
  employeeId: string;
  offboardingId: string;
  triggeredBy: string;
  triggeredAt: string;
  lastWorkingDay: string;
  status: ExitClearanceStatus;
  separationType: 'Resignation' | 'Termination' | 'Contract End';
  hrOwner: string;
  managerApproval: OffboardingStageStatus;
  knowledgeTransfer: OffboardingStageStatus;
  accessRevocation: OffboardingStageStatus;
  payrollSettlement: OffboardingStageStatus;
  documentsIssued: OffboardingStageStatus;
  assetItems: ExitClearanceAssetItem[];
}

export interface OffboardingCase {
  id: string;
  employeeId: string;
  exitClearanceId: string;
  separationType: 'Resignation' | 'Termination' | 'Contract End';
  resignationDate: string;
  noticeStart: string;
  lastWorkingDay: string;
  hrOwner: string;
  managerName: string;
  status: OffboardingStatus;
  exitInterview: OffboardingStageStatus;
  knowledgeTransfer: OffboardingStageStatus;
  managerClearance: OffboardingStageStatus;
  hrClearance: OffboardingStageStatus;
  payrollSettlement: OffboardingStageStatus;
  benefitsReview: OffboardingStageStatus;
  accessRevocation: OffboardingStageStatus;
  checklistCompletion: number;
}

export interface AssignmentDraft {
  employeeId: string;
  assignedDate: string;
  expectedReturnDate: string;
  remarks: string;
}

export interface ReturnDraft {
  condition: ReturnCondition;
  returnDate: string;
  remarks: string;
}
