# Asset Management Architecture

## Purpose

This Angular feature is a frontend prototype for an HRMS Asset Management area. It now covers asset inventory, employee assets, asset support and request workflows, reporting, and an HR-owned Offboarding module with linked Exit Clearance.

The implementation is still mock-data driven. State lives in Angular signals inside `src/app/asset-management/asset-management.component.ts`, with seed data in `src/app/asset-management/asset-management.mock-data.ts`. There is no backend persistence, authentication, notification service, or real approval engine yet.

## Module Structure

### Asset Inventory

Asset Inventory is the IT/Admin master list for company-owned assets.

It includes available stock, assigned devices, maintenance items, retired items, lost assets, procurement data, warranty data, location data, documents, and audit history.

### My Employee Assets

My Employee Assets is the employee self-service view. It shows the active employee's assigned assets and routes the employee into Asset Support & Requests for new assets, issue reports, damaged assets, repairs, replacements, and IT support.

### Asset Support & Requests

Asset Support & Requests replaces the older, narrower Asset Requests module.

It supports:

- New asset requests.
- Damaged or malfunctioning asset reports.
- IT support tickets linked to assigned assets.
- Repairs and maintenance.
- Replacements.
- Request approvals and rejections.
- IT assignment, review, repair, replacement, and closure actions.
- Communication history and SLA visibility.
- Asset linkage so a request can be reflected against an employee's assigned asset.

Expected workflow:

1. Employee submits a service ticket from self-service or the support queue.
2. The system notifies IT automatically and, where required, sends business approval to Manager/HR.
3. Manager/HR approves or rejects business need.
4. IT triages the ticket, assigns an owner, and decides whether to assign, repair, replace, reject, or close.
5. Repair tickets can create maintenance records and vendor follow-up.
6. Replacement tickets link the old and replacement asset.
7. Closure records communication and updates the asset history.

### Offboarding

Offboarding is a dedicated tab under Asset Management for now. It represents the HR-owned employee separation workflow and links Exit Clearance as the asset-recovery stage.

HR responsibilities covered in the process flow:

- Separation initiation for resignation, termination, or contract end.
- Last working day and notice-period tracking.
- Manager handover approval.
- Knowledge transfer and pending work handoff.
- Linked Exit Clearance for assigned assets.
- Access revocation coordination with IT/Security.
- Payroll and finance settlement, including deductions and recoveries.
- Experience letter, relieving letter, statutory documents, exit interview notes, and final HR closure.

### Exit Clearance

Exit Clearance is no longer treated as an isolated HR clearance button. It is linked inside Offboarding.

Expected asset-clearance flow:

1. HR opens the offboarding case.
2. The system maps all assets assigned to the exiting employee.
3. IT reviews each asset row.
4. IT marks the asset as pending return, returned and verified, damaged and moved to maintenance, lost and sent for recovery, or waived by exception.
5. Damaged and lost assets remain blockers until IT/Finance resolve the required action.
6. When every asset row is resolved, IT sends asset clearance back to HR.
7. HR completes final offboarding only after all stages are complete.

The former button label `Complete HR Clearance` was incorrect because IT is only completing asset clearance. It is now represented as `Send Asset Clearance to HR`.

### Asset Reports

Reports now cover broader operational visibility:

- Asset inventory summary.
- Asset allocation status.
- Employee-wise asset assignments.
- Asset lifecycle tracking.
- Pending requests and tickets.
- Repair and maintenance history.
- Lost and damaged asset reports.
- Asset utilization and aging reports.
- Offboarding asset recovery reports.

The reports page combines summary cards with an insight table that names the report purpose, current metric, owner, and recommended next action.

## Data Model

Core models live in `src/app/asset-management/asset-management.models.ts`.

- `Employee`: employee identity, department, designation, location, and avatar.
- `Asset`: master inventory record with status, assignment, location, procurement, and warranty data.
- `AssetHistoryEvent`: audit timeline for create, assign, return, transfer, maintenance, document, retire, and delete events.
- `MaintenanceRecord`: repair or vendor follow-up record.
- `AssetDocument`: invoice, warranty, image, or repair attachment.
- `AssetRequest`: asset service ticket with request type, linked asset, priority, owner, SLA, communication, and workflow status.
- `ExitClearanceCase`: HR offboarding case with HR stages and linked asset-clearance rows.
- `ExitClearanceAssetItem`: one asset outcome inside an exit-clearance case.
- `AssignmentDraft`, `ReturnDraft`, and `ExitOutcomeDraft`: temporary UI form states.

## Current Frontend State

Signals in `AssetManagementComponent` hold:

- `assets`
- `employees`
- `history`
- `maintenance`
- `documents`
- `requests`
- `exitClearances`
- `page`
- `detailTab`
- form draft signals

Computed values derive filtered inventory, KPIs, support-ticket metrics, report cards, report insight rows, employee assets, offboarding cases, exit blockers, and selected clearance views.

## Current Workflow Behavior

### Assign Asset

`assignSelectedAsset()` updates the selected asset to assigned, sets the employee location, and adds either an `assigned` or `transferred` history event.

### Return Asset

`returnSelectedAsset()` clears the employee assignment and changes the asset status based on condition:

- Good return becomes `available`.
- Damaged return becomes `maintenance`.
- Lost return becomes `lost`.

It also writes a `returned` history event. Damaged returns create a maintenance history event.

### Exit Asset Outcome

`saveExitAssetOutcome()` updates the selected offboarding asset row, recalculates blockers, changes asset assignment/status where appropriate, and writes an asset history event.

### Reports

Report cards and insight rows are computed from mock inventory, request, maintenance, warranty, and offboarding data.

## Remaining Implementation Gaps

- Replace local `page` signal navigation with route-level screens.
- Persist create-asset form data into `assets`.
- Add real create/update actions for asset service tickets.
- Make request actions mutate workflow status and append communication events.
- Create maintenance rows from repair tickets, not only history events.
- Add role-based views for Employee, Manager/HR, IT Admin, IT Support, Finance, and Security.
- Connect Offboarding to a real HR employee separation module.
- Add backend APIs, notifications, file storage, and audit persistence.
- Add tests for service-ticket transitions, assignment, return, exit-clearance blocker resolution, and report metrics.
