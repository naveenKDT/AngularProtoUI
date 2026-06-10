# IT Asset Management System - Enhancement Documentation

## Document Version: 1.0
## Last Updated: 2026-06-10
## Target: .NET Backend with Relational Database

---

## 1. Complete Module List

### 1.1 Existing Modules (No Changes)

| Module | Description |
|--------|-------------|
| Asset Inventory | Main asset listing and search |
| Asset Details | Tabbed view (Overview, Assignment, History, Maintenance, Documents, Procurement, Warranty, Location) |
| Add Asset | Asset creation form |
| Asset Requests | Request listing and management |
| Support Tickets | Ticket management |
| IT Clearance | Employee clearance workflow |
| Raise Asset Request | Request creation form |
| Raise Support Ticket | Ticket creation form |

### 1.2 New Modules

| Module | Description |
|--------|-------------|
| Asset Lifecycle Management | Status transitions and state management |
| Asset Transfer | Transfer workflow between employees |
| Asset Return Verification | Return processing and condition assessment |
| Vendor Master | Vendor management and contact information |
| Notification Engine | Automated reminders and alerts |
| Approval Workflow | Generic approval processing |
| Asset Retirement | Disposal process management |
| Asset Reservation | Asset reservation and conflict prevention |

---

## 2. Functional Requirements

### 2.1 Asset Lifecycle Status Management

**Description:** Extend the current 3-status system (Available, Assigned, Maintenance) to a comprehensive 12-status lifecycle.

#### Status Definitions

| Status | Code | Description |
|--------|------|-------------|
| Draft | `draft` | Asset created but not finalized |
| Ordered | `ordered` | Asset procurement in progress |
| Received | `received` | Asset received but not yet available |
| Available | `available` | Ready for assignment |
| Reserved | `reserved` | Temporarily held for specific employee |
| Assigned | `assigned` | Currently assigned to an employee |
| Maintenance | `maintenance` | Under repair or service |
| Returned | `returned` | Returned to inventory |
| Lost | `lost` | Asset reported missing |
| Stolen | `stolen` | Asset reported stolen |
| Retired | `retired` | Disposed of or decommissioned |

#### Status Transitions

```
Draft → Ordered → Received → Available
                              ↓
                          Reserved → Assigned → Returned → Available
                              ↓
                          Reserved → Maintenance → Returned → Available
                              ↓
                        Lost / Stolen → (Investigation) → Retired
                              ↓
                        Returned → Retired
```

#### Business Rules

1. Only `Available`, `Reserved`, `Returned` assets can be assigned
2. `Reserved` assets can only be assigned to the reserving employee
3. `Maintenance` assets cannot be assigned
4. `Lost` and `Stolen` assets trigger incident workflow
5. `Retired` assets are permanently removed from active inventory

---

### 2.2 Asset Transfer Workflow

**Description:** Enable asset transfers between employees with approval and audit trail.

#### Features

1. **Transfer Initiation**
   - Select source and destination employees
   - Capture transfer reason (mandatory)
   - Specify urgency level

2. **Approval Process**
   - Manager approval required for inter-department transfers
   - IT Admin approval for high-value assets (configurable threshold)
   - Auto-approve for same-department transfers (optional)

3. **Transfer Completion**
   - Update asset assignment
   - Record transfer date/time
   - Generate transfer confirmation

4. **Transfer History**
   - All transfers recorded in Asset History tab
   - Includes: date, from employee, to employee, reason, approver, notes

#### Data Captured

```typescript
interface AssetTransfer {
  id: string;
  assetId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  reason: TransferReason;
  reasonDetails: string;
  requestedBy: string;
  requestedAt: Date;
  approvedBy: string;
  approvedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  notes: string;
}
```

#### Transfer Reasons

- Employee Transfer
- Department Reorganization
- Role Change
- Equipment Upgrade
- Temporary Assignment
- Return and Reassign
- Other

---

### 2.3 Asset Return Verification

**Description:** Process asset returns with condition assessment and accessory verification.

#### Features

1. **Return Initiation**
   - Employee initiates return request
   - Or IT admin initiates during offboarding

2. **Condition Assessment**
   - Physical condition: Excellent / Good / Fair / Poor / Damaged
   - Functional status: Working / Partially Working / Not Working

3. **Accessory Verification**
   - List all expected accessories
   - Mark each as: Returned / Missing / Damaged
   - Capture serial numbers for accessories where applicable

4. **Remarks Capture**
   - Free-text remarks field
   - Damage description if applicable
   - Recommendations for repair/replacement

5. **Status Update**
   - Asset status → `Returned`
   - Update assignment end date
   - Record return date

#### Data Captured

```typescript
interface AssetReturn {
  id: string;
  assetId: string;
  returnedBy: string;
  returnedAt: Date;
  receivedBy: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  functionalStatus: 'working' | 'partially_working' | 'not_working';
  accessories: AccessoryReturn[];
  remarks: string;
  repairNeeded: boolean;
  replacementNeeded: boolean;
}

interface AccessoryReturn {
  accessoryName: string;
  serialNumber: string;
  status: 'returned' | 'missing' | 'damaged';
  remarks: string;
}
```

---

### 2.4 Vendor Master Management

**Description:** Maintain vendor information for procurement and support coordination.

#### Features

1. **Vendor Details**
   - Company name
   - Contact person
   - Email (primary, secondary)
   - Phone (office, mobile)
   - Address

2. **Support Information**
   - Support email
   - Support phone
   - Support portal URL
   - Support contract number
   - Contract expiry date

3. **Business Information**
   - GST/VAT number
   - Payment terms
   - Bank details
   - Rating (1-5 stars)

4. **Linked Records**
   - Link to procurement records
   - Link to warranty information
   - Link to maintenance records

#### Data Model

```typescript
interface Vendor {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  secondaryEmail: string;
  phone: string;
  mobile: string;
  address: Address;
  supportEmail: string;
  supportPhone: string;
  supportPortalUrl: string;
  supportContractNumber: string;
  contractExpiryDate: Date;
  gstVatNumber: string;
  paymentTerms: string;
  bankDetails: string;
  rating: number;
  isActive: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2.5 Notification & Reminder Engine

**Description:** Automated notifications for warranty, maintenance, and pending actions.

#### Notification Events

| Event | Trigger | Recipients | Template |
|-------|---------|------------|----------|
| Warranty Expiry (30 days) | 30 days before expiry | IT Admin, Asset Owner | Warranty Expiry Notice |
| Warranty Expiry (7 days) | 7 days before expiry | IT Admin, Asset Owner | Warranty Expiry Warning |
| Warranty Expired | On expiry date | IT Admin | Warranty Expired Alert |
| Maintenance Due | On scheduled date | IT Admin, Assigned To | Maintenance Due Reminder |
| Maintenance Overdue | 1 day after due | IT Admin | Maintenance Overdue Alert |
| Pending Asset Request | Request pending > 24h | Approver | Pending Request Reminder |
| Pending Ticket | Ticket pending > 4h | Assignee | Ticket Escalation |
| IT Clearance Due | Employee leaving in 7 days | HR, IT Admin | Clearance Reminder |
| Asset Not Returned | Expected return date passed | IT Admin | Return Overdue Alert |

#### Notification Preferences

- Email notifications (primary)
- In-app notifications (secondary)
- Configurable quiet hours
- Notification frequency settings

#### Data Model

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  assetId: string;
  recipientUserId: string;
  createdAt: Date;
  readAt: Date;
  actionUrl: string;
  isActive: boolean;
}

interface NotificationSetting {
  userId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  enabledEvents: NotificationType[];
}
```

---

### 2.6 Generic Approval Workflow

**Description:** Configurable approval workflow for asset-related requests.

#### Workflow Types

1. **Asset Request Approval**
   - Single approver (IT Manager)
   - Or multi-level based on asset value

2. **Transfer Approval**
   - Same department: Auto-approve or single approver
   - Cross department: Manager + IT Admin

3. **Retirement Approval**
   - Single approver (IT Manager)
   - Requires retirement reason and disposal method

#### Approval Configuration

```typescript
interface ApprovalWorkflow {
  id: string;
  name: string;
  entityType: 'asset_request' | 'transfer' | 'retirement';
  levels: ApprovalLevel[];
  isActive: boolean;
}

interface ApprovalLevel {
  order: number;
  approverRole: string;
  approverId: string;
  isMandatory: boolean;
  autoApproveConditions: AutoApproveCondition[];
}

interface ApprovalRequest {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  requestedBy: string;
  requestedAt: Date;
  currentLevel: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  history: ApprovalHistory[];
}
```

#### Approval Flow

```
Request Submitted
       ↓
  Check Workflow
       ↓
 Level 1 Approver
       ↓ (Approved)
 Level 2 Approver (if exists)
       ↓
    Complete
       ↓
  Update Entity Status
```

---

### 2.7 Retirement / Disposal Process

**Description:** Formal process to retire and dispose of assets.

#### Features

1. **Retirement Initiation**
   - Select asset(s) to retire
   - Capture retirement reason (mandatory)

2. **Reason Categories**
   - End of useful life
   - Physically damaged beyond repair
   - Lost/Stolen (after investigation)
   - Upgraded/Replaced
   - Donated
   - Recycled
   - Other

3. **Disposal Method**
   - Recycle
   - E-waste vendor
   - Donate
   - Return to vendor
   - Warehouse storage (pending disposal)
   - Write-off

4. **Documentation**
   - Retirement date
   - Retirement remarks
   - Approved by
   - Disposal certificate (upload)
   - Asset value at retirement

5. **Asset Update**
   - Status → `Retired`
   - Move to retired assets view
   - Retain for reporting purposes

#### Data Model

```typescript
interface AssetRetirement {
  id: string;
  assetId: string;
  retiredAt: Date;
  reason: RetirementReason;
  reasonDetails: string;
  disposalMethod: DisposalMethod;
  disposalDate: Date;
  disposalValue: number;
  approvedBy: string;
  approvedAt: Date;
  disposalCertificateUrl: string;
  remarks: string;
  createdAt: Date;
}
```

---

### 2.8 Asset Reservation

**Description:** Reserve assets for upcoming assignments to prevent conflicts.

#### Features

1. **Reservation Creation**
   - Select asset
   - Select employee
   - Set reservation start date
   - Set reservation end date (optional)
   - Add notes

2. **Reservation Validation**
   - Check asset is available
   - Check no conflicting reservations
   - Check asset not assigned

3. **Reservation to Assignment**
   - One-click convert to assignment
   - Auto-populate assignment form
   - Update status to `Assigned`

4. **Reservation Cancellation**
   - Cancel before start date
   - Release asset back to available

5. **Conflict Prevention**
   - Prevent assignment of reserved assets
   - Show reservation status in asset list
   - Display upcoming reservations

#### Data Model

```typescript
interface AssetReservation {
  id: string;
  assetId: string;
  employeeId: string;
  reservedBy: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'converted' | 'cancelled' | 'expired';
  notes: string;
  convertedToAssignmentId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. Database Entities

### 3.1 Core Entities

```sql
-- Asset Status Enum
CREATE TABLE AssetStatus (
    StatusId INT PRIMARY KEY,
    StatusCode VARCHAR(20) NOT NULL UNIQUE,
    StatusName VARCHAR(50) NOT NULL,
    Description VARCHAR(255),
    IsActive BIT DEFAULT 1
);

-- Vendor Master
CREATE TABLE Vendor (
    VendorId INT IDENTITY(1,1) PRIMARY KEY,
    VendorCode VARCHAR(20) NOT NULL UNIQUE,
    VendorName VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    Email VARCHAR(100),
    SecondaryEmail VARCHAR(100),
    Phone VARCHAR(20),
    Mobile VARCHAR(20),
    AddressLine1 VARCHAR(200),
    AddressLine2 VARCHAR(200),
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50),
    PostalCode VARCHAR(20),
    SupportEmail VARCHAR(100),
    SupportPhone VARCHAR(20),
    SupportPortalUrl VARCHAR(200),
    SupportContractNumber VARCHAR(50),
    ContractExpiryDate DATE,
    GstVatNumber VARCHAR(50),
    PaymentTerms VARCHAR(100),
    BankDetails VARCHAR(500),
    Rating INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    Notes VARCHAR(1000),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Asset (Extended)
CREATE TABLE Asset (
    AssetId INT IDENTITY(1,1) PRIMARY KEY,
    AssetTag VARCHAR(20) NOT NULL UNIQUE,
    SerialNumber VARCHAR(100),
    AssetName VARCHAR(200) NOT NULL,
    CategoryId INT NOT NULL,
    Brand VARCHAR(100),
    Model VARCHAR(100),
    StatusId INT NOT NULL DEFAULT 3, -- Available
    VendorId INT,
    PurchaseDate DATE,
    PurchaseCost DECIMAL(18,2),
    CurrentValue DECIMAL(18,2),
    WarrantyStartDate DATE,
    WarrantyEndDate DATE,
    LocationId INT,
    AssignedTo INT,
    AssignedDate DATE,
    ExpectedReturnDate DATE,
    Notes VARCHAR(1000),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StatusId) REFERENCES AssetStatus(StatusId),
    FOREIGN KEY (VendorId) REFERENCES Vendor(VendorId)
);

-- Asset Assignment History
CREATE TABLE AssetAssignment (
    AssignmentId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    EmployeeId INT NOT NULL,
    AssignedBy INT NOT NULL,
    AssignedDate DATETIME NOT NULL,
    ExpectedReturnDate DATE,
    ActualReturnDate DATE,
    ReturnCondition VARCHAR(20),
    ReturnRemarks VARCHAR(500),
    Status VARCHAR(20) DEFAULT 'active', -- active, returned, transferred
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);
```

### 3.2 Transfer Entities

```sql
-- Asset Transfer
CREATE TABLE AssetTransfer (
    TransferId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    FromEmployeeId INT NOT NULL,
    ToEmployeeId INT NOT NULL,
    ReasonCode VARCHAR(50) NOT NULL,
    ReasonDetails VARCHAR(500),
    RequestedBy INT NOT NULL,
    RequestedAt DATETIME DEFAULT GETDATE(),
    ApprovedBy INT,
    ApprovedAt DATETIME,
    Status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, completed, cancelled
    Notes VARCHAR(500),
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);

-- Transfer Reasons Lookup
CREATE TABLE TransferReason (
    ReasonId INT PRIMARY KEY,
    ReasonCode VARCHAR(20) NOT NULL UNIQUE,
    ReasonName VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    IsActive BIT DEFAULT 1
);
```

### 3.3 Return Verification Entities

```sql
-- Asset Return
CREATE TABLE AssetReturn (
    ReturnId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    ReturnedBy INT NOT NULL,
    ReturnedAt DATETIME NOT NULL,
    ReceivedBy INT NOT NULL,
    Condition VARCHAR(20) NOT NULL, -- excellent, good, fair, poor, damaged
    FunctionalStatus VARCHAR(30), -- working, partially_working, not_working
    RepairNeeded BIT DEFAULT 0,
    ReplacementNeeded BIT DEFAULT 0,
    Remarks VARCHAR(1000),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);

-- Asset Return Accessories
CREATE TABLE AssetReturnAccessory (
    ReturnAccessoryId INT IDENTITY(1,1) PRIMARY KEY,
    ReturnId INT NOT NULL,
    AccessoryName VARCHAR(100) NOT NULL,
    SerialNumber VARCHAR(100),
    Status VARCHAR(20) NOT NULL, -- returned, missing, damaged
    Remarks VARCHAR(500),
    FOREIGN KEY (ReturnId) REFERENCES AssetReturn(ReturnId)
);
```

### 3.4 Reservation Entities

```sql
-- Asset Reservation
CREATE TABLE AssetReservation (
    ReservationId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    EmployeeId INT NOT NULL,
    ReservedBy INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status VARCHAR(20) DEFAULT 'active', -- active, converted, cancelled, expired
    Notes VARCHAR(500),
    ConvertedToAssignmentId INT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);
```

### 3.5 Retirement Entities

```sql
-- Asset Retirement
CREATE TABLE AssetRetirement (
    RetirementId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    RetiredAt DATETIME NOT NULL,
    ReasonCode VARCHAR(50) NOT NULL,
    ReasonDetails VARCHAR(500),
    DisposalMethod VARCHAR(50) NOT NULL,
    DisposalDate DATE,
    DisposalValue DECIMAL(18,2),
    ApprovedBy INT,
    ApprovedAt DATETIME,
    DisposalCertificateUrl VARCHAR(500),
    Remarks VARCHAR(1000),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);

-- Retirement Reasons Lookup
CREATE TABLE RetirementReason (
    ReasonId INT PRIMARY KEY,
    ReasonCode VARCHAR(20) NOT NULL UNIQUE,
    ReasonName VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    IsActive BIT DEFAULT 1
);
```

### 3.6 Approval Workflow Entities

```sql
-- Approval Workflow Configuration
CREATE TABLE ApprovalWorkflow (
    WorkflowId INT IDENTITY(1,1) PRIMARY KEY,
    WorkflowName VARCHAR(100) NOT NULL,
    EntityType VARCHAR(50) NOT NULL, -- asset_request, transfer, retirement
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Approval Workflow Levels
CREATE TABLE ApprovalWorkflowLevel (
    LevelId INT IDENTITY(1,1) PRIMARY KEY,
    WorkflowId INT NOT NULL,
    LevelOrder INT NOT NULL,
    ApproverRole VARCHAR(50) NOT NULL,
    ApproverId INT,
    IsMandatory BIT DEFAULT 1,
    FOREIGN KEY (WorkflowId) REFERENCES ApprovalWorkflow(WorkflowId)
);

-- Approval Requests
CREATE TABLE ApprovalRequest (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,
    WorkflowId INT NOT NULL,
    EntityType VARCHAR(50) NOT NULL,
    EntityId INT NOT NULL,
    RequestedBy INT NOT NULL,
    RequestedAt DATETIME DEFAULT GETDATE(),
    CurrentLevel INT DEFAULT 1,
    Status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    FOREIGN KEY (WorkflowId) REFERENCES ApprovalWorkflow(WorkflowId)
);

-- Approval History
CREATE TABLE ApprovalHistory (
    HistoryId INT IDENTITY(1,1) PRIMARY KEY,
    ApprovalId INT NOT NULL,
    Level INT NOT NULL,
    Action VARCHAR(20) NOT NULL, -- approved, rejected
    ActionBy INT NOT NULL,
    ActionAt DATETIME DEFAULT GETDATE(),
    Comments VARCHAR(500),
    FOREIGN KEY (ApprovalId) REFERENCES ApprovalRequest(ApprovalId)
);
```

### 3.7 Notification Entities

```sql
-- Notification Template
CREATE TABLE NotificationTemplate (
    TemplateId INT IDENTITY(1,1) PRIMARY KEY,
    TemplateCode VARCHAR(50) NOT NULL UNIQUE,
    TemplateName VARCHAR(100) NOT NULL,
    Subject VARCHAR(200) NOT NULL,
    BodyTemplate VARCHAR(2000) NOT NULL,
    EventType VARCHAR(50) NOT NULL,
    Priority VARCHAR(10) DEFAULT 'medium',
    IsActive BIT DEFAULT 1
);

-- Notification
CREATE TABLE Notification (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    TemplateId INT,
    NotificationType VARCHAR(50) NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Message VARCHAR(1000) NOT NULL,
    Priority VARCHAR(10) DEFAULT 'medium',
    AssetId INT,
    UserId INT NOT NULL,
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME,
    ActionUrl VARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TemplateId) REFERENCES NotificationTemplate(TemplateId)
);

-- Notification Settings
CREATE TABLE NotificationSetting (
    SettingId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL UNIQUE,
    EmailEnabled BIT DEFAULT 1,
    InAppEnabled BIT DEFAULT 1,
    QuietHoursStart TIME,
    QuietHoursEnd TIME,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
```

### 3.8 Asset History Entity

```sql
-- Asset History (Unified)
CREATE TABLE AssetHistory (
    HistoryId INT IDENTITY(1,1) PRIMARY KEY,
    AssetId INT NOT NULL,
    ActionType VARCHAR(50) NOT NULL,
    ActionDate DATETIME DEFAULT GETDATE(),
    PerformedBy INT NOT NULL,
    Details VARCHAR(1000),
    OldValue VARCHAR(500),
    NewValue VARCHAR(500),
    RelatedEntityType VARCHAR(50),
    RelatedEntityId INT,
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId)
);

-- Action Types:
-- assignment, return, transfer, maintenance, status_change, 
-- warranty_update, document_upload, retirement, reservation
```

---

## 4. Entity Relationships

```
┌─────────────┐
│    Asset    │
└──────┬──────┘
       │
       ├──────────────┬──────────────────┬───────────────┐
       │              │                  │               │
       ▼              ▼                  ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Assignment   │ │  Transfer   │ │Reservation  │ │ Retirement  │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │              │              │              │
       ▼              │              │              │
┌─────────────┐       │              │              │
│AssetReturn  │       │              │              │
└──────┬──────┘       │              │              │
       │              │              │              │
       ▼              │              │              │
┌─────────────┐       │              │              │
│AccessoryRet │       │              │              │
└─────────────┘       │              │              │
                      ▼              ▼              ▼
                 ┌─────────────────────────────────────────┐
                 │           AssetHistory (Unified)        │
                 └─────────────────────────────────────────┘
                                        ▲
                                        │
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Vendor   │  │   Employee  │  │Notification │  │  Approval   │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐
│ApprovalReq  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ApprovalHistory  │
└─────────────────┘
```

### Key Relationships

| Parent Entity | Child Entity | Relationship Type |
|---------------|--------------|-------------------|
| Asset | AssetAssignment | One-to-Many |
| Asset | AssetTransfer | One-to-Many |
| Asset | AssetReservation | One-to-Many |
| Asset | AssetRetirement | One-to-Many |
| Asset | AssetReturn | One-to-Many |
| Asset | AssetHistory | One-to-Many |
| AssetReturn | AssetReturnAccessory | One-to-One |
| Vendor | Asset | One-to-Many |
| ApprovalWorkflow | ApprovalWorkflowLevel | One-to-Many |
| ApprovalRequest | ApprovalHistory | One-to-Many |

---

## 5. API Endpoints

### 5.1 Asset Transfer API

```
POST   /api/assets/{id}/transfer          - Create transfer request
GET    /api/assets/{id}/transfers         - Get transfer history
GET    /api/transfers/{id}                - Get transfer details
PUT    /api/transfers/{id}/approve        - Approve transfer
PUT    /api/transfers/{id}/reject        - Reject transfer
PUT    /api/transfers/{id}/cancel         - Cancel transfer
```

### 5.2 Asset Return API

```
POST   /api/assets/{id}/return             - Initiate return
GET    /api/assets/{id}/returns           - Get return history
GET    /api/returns/{id}                  - Get return details
PUT    /api/returns/{id}/verify           - Verify return with accessories
PUT    /api/returns/{id}/complete         - Complete return process
```

### 5.3 Asset Reservation API

```
POST   /api/assets/{id}/reserve           - Create reservation
GET    /api/assets/{id}/reservations     - Get reservations
GET    /api/reservations/{id}             - Get reservation details
PUT    /api/reservations/{id}/cancel      - Cancel reservation
PUT    /api/reservations/{id}/convert     - Convert to assignment
GET    /api/reservations/employee/{id}     - Get employee reservations
```

### 5.4 Asset Retirement API

```
POST   /api/assets/{id}/retire             - Initiate retirement
GET    /api/assets/{id}/retirement        - Get retirement record
PUT    /api/assets/{id}/retirement/approve - Approve retirement
GET    /api/retirements                    - List all retirements
GET    /api/retirements/pending            - Get pending retirements
```

### 5.5 Vendor API

```
GET    /api/vendors                        - List vendors
POST   /api/vendors                        - Create vendor
GET    /api/vendors/{id}                   - Get vendor details
PUT    /api/vendors/{id}                   - Update vendor
DELETE /api/vendors/{id}                   - Deactivate vendor
GET    /api/vendors/{id}/assets            - Get vendor assets
GET    /api/vendors/{id}/contracts         - Get vendor contracts
```

### 5.6 Approval API

```
GET    /api/approvals                      - List pending approvals
GET    /api/approvals/{id}                 - Get approval details
POST   /api/approvals/request              - Create approval request
PUT    /api/approvals/{id}/approve         - Approve
PUT    /api/approvals/{id}/reject          - Reject
GET    /api/approvals/history              - Get approval history
GET    /api/approvals/pending-count        - Get pending count by type
```

### 5.7 Notification API

```
GET    /api/notifications                  - Get user notifications
GET    /api/notifications/unread           - Get unread count
PUT    /api/notifications/{id}/read       - Mark as read
PUT    /api/notifications/read-all         - Mark all as read
GET    /api/notifications/settings         - Get notification settings
PUT    /api/notifications/settings         - Update settings
GET    /api/notifications/templates        - Get notification templates
POST   /api/notifications/test            - Send test notification
```

### 5.8 Asset Status API

```
GET    /api/asset-statuses                 - Get all statuses
GET    /api/asset-statuses/valid-transitions/{statusId}
                                        - Get valid transitions
POST   /api/assets/{id}/status             - Change status
GET    /api/assets/{id}/history            - Get asset history
```

---

## 6. Workflow Diagrams

### 6.1 Asset Transfer Workflow

```
┌──────────────┐
│ Transfer     │
│ Initiated    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Same Dept?   │
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
  Yes      No
   │       │
   ▼       ▼
┌──────────┐  ┌──────────────┐
│ Auto or  │  │ Manager     │
│ Manager  │  │ Approval    │
│ Approval │  └──────┬───────┘
└────┬─────┘        │
     │              ▼
     │        ┌──────────────┐
     │        │ IT Admin     │
     │        │ Approval     │
     │        └──────┬───────┘
     │              │
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Transfer     │
     │ Completed    │
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Update Asset │
     │ Assignment   │
     └──────┬───────┘
            │
            ▼
     ┌──────────────┐
     │ Record in    │
     │ History      │
     └──────────────┘
```

### 6.2 Asset Return Workflow

```
┌──────────────┐
│ Return       │
│ Initiated    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Condition    │
│ Assessment   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Accessory    │
│ Verification │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Remarks &    │
│ Notes        │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Repairs      │────►│ Mark as      │
│ Needed?      │ Yes │ Maintenance  │
└──────┬───────┘     └──────────────┘
       │ No
       ▼
┌──────────────┐
│ Update Asset │
│ Status       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Record in    │
│ History      │
└──────────────┘
```

### 6.3 Approval Workflow

```
┌──────────────┐
│ Request      │
│ Submitted    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Get Workflow │
│ Config       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Assign to    │
│ Level 1      │
└──────┬───────┘
       │
       ▼
   ┌───┴───┐
   │       │
Approved  Rejected
   │       │
   ▼       ▼
┌──────────┐  ┌──────────────┐
│ More     │  │ Notify       │
│ Levels?  │  │ Requester    │
└────┬─────┘  └──────────────┘
     │
  ┌──┴──┐
  │     │
 Yes    No
  │     │
  ▼     ▼
┌────┐ ┌──────────────┐
│Next│ │ Notify       │
│Lvl │ │ Requester    │
└────┘ └──────────────┘
```

### 6.4 Retirement Workflow

```
┌──────────────┐
│ Retirement   │
│ Requested    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Capture      │
│ Reason &     │
│ Disposal     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Manager     │
│ Approval    │
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
Approved  Rejected
   │       │
   ▼       ▼
┌──────────┐  ┌──────────────┐
│ Update    │  │ Notify       │
│ Asset to  │  │ Requester    │
│ Retired   │  └──────────────┘
└────┬─────┘
     │
     ▼
┌──────────────┐
│ Upload       │
│ Disposal     │
│ Certificate  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Record in    │
│ History      │
└──────────────┘
```

---

## 7. Status Transitions

### 7.1 Complete Status Transition Matrix

| From Status | To Status | Trigger | Requires Approval |
|-------------|-----------|---------|-------------------|
| Draft | Ordered | Submit order | No |
| Ordered | Received | Mark received | No |
| Ordered | Draft | Cancel order | No |
| Received | Available | Mark available | No |
| Available | Reserved | Create reservation | No |
| Reserved | Assigned | Convert reservation | No |
| Reserved | Available | Cancel reservation | No |
| Available | Assigned | Assign to employee | No |
| Assigned | Maintenance | Create maintenance | No |
| Assigned | Returned | Return initiated | No |
| Assigned | Reserved | Reserve for other | Yes |
| Maintenance | Available | Maintenance complete | No |
| Maintenance | Retired | Unable to repair | Yes |
| Returned | Available | Verify return | No |
| Returned | Maintenance | Repair needed | No |
| Returned | Retired | Dispose | Yes |
| Available | Retired | Direct retire | Yes |
| Assigned | Returned | Force return | Yes |
| Available | Lost | Report lost | No |
| Available | Stolen | Report stolen | No |
| Lost | Retired | Confirm lost | Yes |
| Stolen | Retired | Confirm stolen | Yes |

### 7.2 Status Color Coding

| Status | Color | Usage |
|--------|-------|-------|
| Draft | Gray | Inactive/pending |
| Ordered | Blue | In procurement |
| Received | Cyan | Just received |
| Available | Green | Ready for use |
| Reserved | Purple | Temporarily held |
| Assigned | Blue | In use |
| Maintenance | Amber | Being serviced |
| Returned | Teal | Back in inventory |
| Lost | Red | Missing asset |
| Stolen | Red | Stolen asset |
| Retired | Slate | Disposed |

---

## 8. Approval Flow Definitions

### 8.1 Asset Request Approval

```
Flow: Asset Request Approval

Trigger: New asset request submitted

Steps:
1. Submit request → Status: Pending Approval
2. Check asset category
3. If high-value (> $1000):
   - Level 1: IT Manager approval
   - Level 2: Finance approval (if > $5000)
4. If standard:
   - Level 1: IT Manager approval
5. On approval:
   - Notify requester
   - Update request status
   - Create procurement record (if new asset)
6. On rejection:
   - Notify requester
   - Request status → Rejected
```

### 8.2 Transfer Approval

```
Flow: Asset Transfer Approval

Trigger: Asset transfer initiated

Steps:
1. Submit transfer → Status: Pending
2. Check department
3. If same department:
   - Auto-approve OR IT Manager approval (configurable)
4. If cross-department:
   - Level 1: Source manager approval
   - Level 2: Destination manager approval
   - Level 3: IT Admin approval
5. If high-value asset:
   - Additional IT Manager approval
6. On approval:
   - Update asset assignment
   - Record transfer in history
   - Notify both employees
7. On rejection:
   - Notify initiator
   - Cancel transfer
```

### 8.3 Retirement Approval

```
Flow: Asset Retirement Approval

Trigger: Retirement requested

Steps:
1. Submit retirement → Status: Pending
2. Validate asset status
3. Level 1: IT Manager approval
4. On approval:
   - Update asset to Retired
   - Record retirement details
   - Move to retired assets view
5. On rejection:
   - Notify initiator
   - Cancel retirement
```

### 8.4 Approval Extensibility

```typescript
interface ApprovalConfig {
  entityType: string;
  conditions: ApprovalCondition[];
  levels: ApprovalLevelConfig[];
}

interface ApprovalCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'in';
  value: any;
  skipLevels: number;
}

// Example: High-value transfer
{
  entityType: 'transfer',
  conditions: [
    { field: 'asset.purchaseCost', operator: 'gt', value: 5000, skipLevels: 0 }
  ],
  levels: [
    { order: 1, approverRole: 'IT_MANAGER', mandatory: true },
    { order: 2, approverRole: 'FINANCE_MANAGER', mandatory: true }
  ]
}
```

---

## 9. Notification Events

### 9.1 Notification Event Definitions

| Event ID | Event Name | Trigger | Recipients | Priority |
|----------|------------|---------|------------|----------|
| WEX-30 | Warranty Expiry 30 Days | 30 days before warranty end | IT Admin, Asset Owner | Medium |
| WEX-07 | Warranty Expiry 7 Days | 7 days before warranty end | IT Admin, Asset Owner | High |
| WEX-00 | Warranty Expired | On warranty end date | IT Admin | High |
| MNT-DUE | Maintenance Due | On scheduled maintenance date | IT Admin, Assigned To | Medium |
| MNT-OVR | Maintenance Overdue | 1 day after due date | IT Admin | High |
| REQ-PND | Pending Asset Request | Request pending > 24h | Approver | Medium |
| TKT-PND | Pending Support Ticket | Ticket pending > 4h | Assignee | High |
| CLR-DUE | IT Clearance Due | Employee leaving in 7 days | HR, IT Admin | High |
| AST-OVR | Asset Return Overdue | Expected return date passed | IT Admin | High |
| RSV-CONF | Reservation Conflict | Conflicting reservation detected | IT Admin | Medium |
| TRF-REQ | Transfer Requested | New transfer initiated | Approver | Medium |
| TRF-APR | Transfer Approved | Transfer approved | Requester, From Employee, To Employee | Medium |
| TRF-REJ | Transfer Rejected | Transfer rejected | Requester | High |
| RET-REQ | Retirement Requested | Retirement initiated | Approver | Medium |
| RET-APR | Retirement Approved | Retirement approved | Requester | Medium |

### 9.2 Notification Template Structure

```html
<!-- Warranty Expiry Notice -->
Subject: Warranty Expiry Reminder - {{AssetName}} ({{AssetTag}})

Body:
Dear {{RecipientName}},

This is a reminder that the warranty for the following asset is expiring soon:

Asset: {{AssetName}}
Tag: {{AssetTag}}
Warranty End Date: {{WarrantyEndDate}}
Days Remaining: {{DaysLeft}}

Please take necessary action to ensure warranty coverage is maintained.

Regards,
IT Asset Management System
```

### 9.3 Notification Delivery Rules

| Event | Email | In-App | SMS (Optional) |
|-------|-------|--------|----------------|
| Warranty Expiry | Yes | Yes | No |
| Maintenance Due | Yes | Yes | No |
| Pending Request | Yes | Yes | Yes |
| Pending Ticket | Yes | Yes | Yes |
| IT Clearance | Yes | Yes | Yes |
| Return Overdue | Yes | Yes | Yes |
| Transfer Status | Yes | Yes | No |
| Retirement | Yes | Yes | No |

---

## 10. Backend Architecture Recommendations

### 10.1 Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Backend Framework | ASP.NET Core 8.0 | Modern, cross-platform |
| API Style | RESTful + OData | For filtering/pagination |
| ORM | Entity Framework Core | With SQL Server |
| Database | SQL Server 2022 | Standard/Enterprise |
| Authentication | JWT + Claims | Role-based access |
| Authorization | Policy-based | Fine-grained control |
| Background Jobs | .NET BackgroundService | For notifications |
| Caching | Redis | For performance |
| Logging | Serilog | Structured logging |
| Documentation | Swagger/OpenAPI | API documentation |

### 10.2 Project Structure

```
src/
├── ITAssetManagement.Api/           # Web API project
│   ├── Controllers/
│   ├── Middleware/
│   ├── Filters/
│   └── Program.cs
│
├── ITAssetManagement.Core/          # Domain layer
│   ├── Entities/
│   ├── Interfaces/
│   ├── Enums/
│   └── Events/
│
├── ITAssetManagement.Application/   # Application layer
│   ├── Services/
│   ├── DTOs/
│   ├── Mappings/
│   ├── Validators/
│   └── Workflows/
│
├── ITAssetManagement.Infrastructure/ # Infrastructure layer
│   ├── Data/
│   ├── Repositories/
│   ├── Services/
│   └── BackgroundJobs/
│
└── ITAssetManagement.Tests/         # Unit tests
```

### 10.3 Key Services

#### AssetService
- CRUD operations for assets
- Status management
- Assignment operations
- Transfer operations
- Return processing
- Reservation management

#### VendorService
- Vendor CRUD
- Contract management
- Vendor linking to assets

#### ApprovalWorkflowService
- Workflow configuration
- Approval routing
- Notification triggers

#### NotificationService
- Event-based notifications
- Scheduled reminders
- User preference management

#### NotificationScheduler (Background Job)
- Runs daily at configured time
- Checks warranty expiry
- Checks maintenance due
- Checks pending approvals
- Sends notifications

### 10.4 Domain Events (Event-Driven Architecture)

```csharp
// Domain Events
public abstract class DomainEvent
{
    public Guid EventId { get; }
    public DateTime OccurredAt { get; }
}

public class AssetStatusChangedEvent : DomainEvent
{
    public int AssetId { get; }
    public string OldStatus { get; }
    public string NewStatus { get; }
    public int ChangedBy { get; }
}

public class AssetTransferRequestedEvent : DomainEvent
{
    public int TransferId { get; }
    public int AssetId { get; }
    public int RequestedBy { get; }
}

public class ApprovalCompletedEvent : DomainEvent
{
    public int ApprovalId { get; }
    public string EntityType { get; }
    public int EntityId { get; }
    public bool IsApproved { get; }
}

public class WarrantyExpiringEvent : DomainEvent
{
    public int AssetId { get; }
    public DateTime ExpiryDate { get; }
    public int DaysRemaining { get; }
}
```

### 10.5 API Response Format

```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully",
  "errors": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  }
}
```

### 10.6 Caching Strategy

| Data | Cache Duration | Invalidation |
|------|---------------|--------------|
| Asset List | 5 minutes | On any asset change |
| Asset Details | 10 minutes | On asset update |
| Vendor List | 30 minutes | On vendor change |
| Status Configuration | 1 hour | On config change |
| User Preferences | 1 hour | On user update |
| Notification Settings | 1 hour | On setting change |

### 10.7 Security Considerations

1. **Role-Based Access Control**
   - IT Admin: Full access
   - IT Manager: Approvals + view
   - Employee: View own assets + requests

2. **Data Protection**
   - Sensitive fields encrypted at rest
   - Audit logging for all changes
   - JWT token expiration (1 hour)

3. **API Security**
   - Rate limiting
   - Input validation
   - SQL injection prevention
   - CORS configuration

### 10.8 Performance Recommendations

1. **Database**
   - Indexed columns: AssetTag, SerialNumber, StatusId, AssignedTo
   - Include foreign keys in queries
   - Avoid N+1 queries with eager loading

2. **API**
   - Pagination for list endpoints (default 20)
   - OData for complex filtering
   - Response compression

3. **Caching**
   - Redis for session and frequently accessed data
   - In-memory cache for static configuration

---

## 11. Implementation Priority

### Phase 1: Core Foundation
1. Asset Status Management (Extended)
2. Asset Transfer Workflow
3. Asset History Recording

### Phase 2: Return & Reservation
4. Asset Return Verification
5. Asset Reservation System

### Phase 3: Support Systems
6. Vendor Master Management
7. Notification Engine

### Phase 4: Approval & Retirement
8. Generic Approval Workflow
9. Retirement/Disposal Process

---

## 12. UI Integration Guidelines

### 12.1 Existing UI Extensions

The following existing components should be extended:

1. **Asset Details Page**
   - Add "Transfer" button to action menu
   - Add "Reserve" button to action menu
   - Add "Retire" button to action menu
   - History tab already shows all events

2. **Asset List Page**
   - Add status filter
   - Add reservation indicator
   - Add quick actions menu

3. **Requests Page**
   - Already has approval workflow
   - Add approval status indicators

### 12.2 New UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Transfer Modal | Asset Details | Transfer asset |
| Return Verification Modal | Asset Details | Process return |
| Reservation Panel | Asset Details | Manage reservations |
| Retirement Modal | Asset Details | Retire asset |
| Vendor List Page | New route | Vendor management |
| Notification Center | Header | User notifications |
| Approval Dashboard | New route | Pending approvals |

---

## 13. Integration Points

### 13.1 With Existing Modules

| Module | Integration |
|--------|------------|
| Add Asset | Link to vendor, set initial status |
| Asset Requests | Approval workflow integration |
| Support Tickets | Asset linking |
| IT Clearance | Return verification trigger |

### 13.2 External Integrations

| System | Integration |
|--------|------------|
| Email Server | Notification delivery |
| HR System | Employee data sync |
| Finance System | Asset value reporting |
| Active Directory | User authentication |

---

*Document End*