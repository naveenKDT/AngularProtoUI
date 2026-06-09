import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent
} from '../../shared/components/ui/ui-components';

interface AssetCategory {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'knodtec-add-asset',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent
  ],
  template: `
    <div class="add-asset-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-title">
            <h1>Add New Asset</h1>
            <p>Register a new asset in the inventory system</p>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="banner-content">
          <strong>Adding a New Asset</strong>
          <span>Complete all required fields to add an asset to the inventory. Assets can be assigned to employees once registered.</span>
        </div>
      </div>

      <!-- Form -->
      <div class="form-container">
        <!-- Section 1: Asset Identification -->
        <knod-card title="Asset Identification">
          <div class="form-grid">
            <!-- Asset ID (Auto Generated, Read Only) -->
            <div class="form-group">
              <label class="form-label">Asset ID</label>
              <input 
                type="text" 
                class="form-input read-only"
                [value]="generatedAssetId()"
                readonly>
              <span class="form-hint">Auto-generated unique identifier</span>
            </div>

            <!-- Asset Tag -->
            <div class="form-group">
              <label class="form-label">
                Asset Tag <span class="required">*</span>
              </label>
              <div class="input-with-prefix">
                <span class="input-prefix">AST-</span>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="0001"
                  [ngModel]="assetTag()"
                  (ngModelChange)="assetTag.set($event)">
              </div>
              <span class="form-hint">Auto-generated if left empty</span>
            </div>

            <!-- Asset Category -->
            <div class="form-group">
              <label class="form-label">
                Asset Category <span class="required">*</span>
              </label>
              <div class="category-options">
                @for (cat of categories; track cat.value) {
                  <label class="category-option" [class.selected]="category() === cat.value">
                    <input 
                      type="radio" 
                      name="category" 
                      [value]="cat.value"
                      [ngModel]="category()"
                      (ngModelChange)="category.set($event)">
                    <div class="category-icon" [innerHTML]="cat.icon"></div>
                    <span class="category-label">{{ cat.label }}</span>
                  </label>
                }
              </div>
            </div>

            <!-- Asset Sub Category -->
            <div class="form-group">
              <label class="form-label">Asset Sub Category</label>
              <select class="form-select" [ngModel]="subCategory()" (ngModelChange)="subCategory.set($event)">
                <option value="">Select sub category</option>
                @if (category() === 'Laptop' || category() === 'Desktop') {
                  <option value="business">Business</option>
                  <option value="gaming">Gaming</option>
                  <option value="workstation">Workstation</option>
                  <option value="ultrabook">Ultrabook</option>
                }
                @if (category() === 'Monitor') {
                  <option value="hd">HD (1080p)</option>
                  <option value="qhd">QHD (1440p)</option>
                  <option value="uhd">UHD (4K)</option>
                  <option value="curved">Curved</option>
                }
                @if (category() === 'Phone') {
                  <option value="smartphone">Smartphone</option>
                  <option value="tablet">Tablet</option>
                  <option value="landline">Landline</option>
                }
                @if (category() === 'Printer') {
                  <option value="laser">Laser</option>
                  <option value="inkjet">Inkjet</option>
                  <option value="all-in-one">All-in-One</option>
                  <option value="plotter">Plotter</option>
                }
                @if (category() === 'Accessory') {
                  <option value="keyboard">Keyboard</option>
                  <option value="mouse">Mouse</option>
                  <option value="headset">Headset</option>
                  <option value="cable">Cable/Adapter</option>
                  <option value="docking">Docking Station</option>
                }
              </select>
            </div>

            <!-- Asset Name -->
            <div class="form-group">
              <label class="form-label">
                Asset Name <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., MacBook Pro 14-inch M3"
                [ngModel]="name()"
                (ngModelChange)="name.set($event)">
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label">
                Brand <span class="required">*</span>
              </label>
              <select class="form-select" [ngModel]="brand()" (ngModelChange)="brand.set($event)">
                <option value="">Select brand</option>
                <option value="Apple">Apple</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Samsung">Samsung</option>
                <option value="Sony">Sony</option>
                <option value="Logitech">Logitech</option>
                <option value="Cisco">Cisco</option>
                <option value="ASUS">ASUS</option>
                <option value="Acer">Acer</option>
                <option value="Toshiba">Toshiba</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Model -->
            <div class="form-group">
              <label class="form-label">
                Model <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., MacBook Pro 14-inch"
                [ngModel]="model()"
                (ngModelChange)="model.set($event)">
            </div>

            <!-- Model Number -->
            <div class="form-group">
              <label class="form-label">Model Number</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Enter model number"
                [ngModel]="modelNumber()"
                (ngModelChange)="modelNumber.set($event)">
            </div>

            <!-- Serial Number -->
            <div class="form-group">
              <label class="form-label">
                Serial Number <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Enter serial number"
                [ngModel]="serialNumber()"
                (ngModelChange)="serialNumber.set($event)">
            </div>

            <!-- Manufacturer -->
            <div class="form-group">
              <label class="form-label">Manufacturer</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., Apple Inc."
                [ngModel]="manufacturer()"
                (ngModelChange)="manufacturer.set($event)">
            </div>

            <!-- Asset Description -->
            <div class="form-group full-width">
              <label class="form-label">Asset Description</label>
              <textarea 
                class="form-textarea"
                rows="2"
                placeholder="Enter detailed description of the asset"
                [ngModel]="assetDescription()"
                (ngModelChange)="assetDescription.set($event)">
              </textarea>
            </div>
          </div>
        </knod-card>

        <!-- Section 2: Procurement Information -->
        <knod-card title="Procurement Information">
          <div class="form-grid">
            <!-- Purchase Date -->
            <div class="form-group">
              <label class="form-label">
                Purchase Date <span class="required">*</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="purchaseDate()"
                (ngModelChange)="purchaseDate.set($event); calculateWarrantyEnd()">
            </div>

            <!-- Purchase Cost -->
            <div class="form-group">
              <label class="form-label">
                Purchase Cost <span class="required">*</span>
              </label>
              <div class="budget-input">
                <select class="currency-select" [ngModel]="currency()" (ngModelChange)="currency.set($event)">
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  [ngModel]="purchaseCost()"
                  (ngModelChange)="purchaseCost.set($event)">
              </div>
            </div>

            <!-- Vendor/Supplier -->
            <div class="form-group">
              <label class="form-label">Vendor/Supplier</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., Amazon, Ingram Micro"
                [ngModel]="vendor()"
                (ngModelChange)="vendor.set($event)">
            </div>

            <!-- Invoice Number -->
            <div class="form-group">
              <label class="form-label">Invoice Number</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., INV-2025-001"
                [ngModel]="invoiceNumber()"
                (ngModelChange)="invoiceNumber.set($event)">
            </div>

            <!-- Purchase Order Number -->
            <div class="form-group">
              <label class="form-label">Purchase Order Number (PO)</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., PO-2025-001"
                [ngModel]="poNumber()"
                (ngModelChange)="poNumber.set($event)">
            </div>

            <!-- Procurement Type -->
            <div class="form-group">
              <label class="form-label">Procurement Type</label>
              <select class="form-select" [ngModel]="procurementType()" (ngModelChange)="procurementType.set($event)">
                <option value="purchase">Purchase</option>
                <option value="lease">Lease</option>
                <option value="rental">Rental</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            <!-- Delivery Date -->
            <div class="form-group">
              <label class="form-label">Delivery Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="deliveryDate()"
                (ngModelChange)="deliveryDate.set($event)">
            </div>

            <!-- Asset Received Date -->
            <div class="form-group">
              <label class="form-label">Asset Received Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="assetReceivedDate()"
                (ngModelChange)="assetReceivedDate.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Section 3: Ownership & Financial Information -->
        <knod-card title="Ownership & Financial Information">
          <div class="form-grid">
            <!-- Asset Owner (Company/Department) -->
            <div class="form-group">
              <label class="form-label">Asset Owner (Company/Department)</label>
              <select class="form-select" [ngModel]="assetOwner()" (ngModelChange)="assetOwner.set($event)">
                <option value="">Select owner</option>
                <option value="Company">Company Owned</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>

            <!-- Cost Center -->
            <div class="form-group">
              <label class="form-label">Cost Center</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., CC-001"
                [ngModel]="costCenter()"
                (ngModelChange)="costCenter.set($event)">
            </div>

            <!-- Budget Code -->
            <div class="form-group">
              <label class="form-label">Budget Code</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., BUD-2025-IT-001"
                [ngModel]="budgetCode()"
                (ngModelChange)="budgetCode.set($event)">
            </div>

            <!-- Depreciation Method -->
            <div class="form-group">
              <label class="form-label">Depreciation Method</label>
              <select class="form-select" [ngModel]="depreciationMethod()" (ngModelChange)="depreciationMethod.set($event)">
                <option value="">Select method</option>
                <option value="straight-line">Straight Line</option>
                <option value="declining-balance">Declining Balance</option>
                <option value="double-declining">Double Declining</option>
                <option value="sum-of-years">Sum of Years Digits</option>
                <option value="units-of-production">Units of Production</option>
                <option value="none">No Depreciation</option>
              </select>
            </div>

            <!-- Depreciation Period -->
            <div class="form-group">
              <label class="form-label">Depreciation Period (Years)</label>
              <select class="form-select" [ngModel]="depreciationPeriod()" (ngModelChange)="depreciationPeriod.set($event)">
                <option value="">Select period</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="7">7 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>

            <!-- Current Asset Value -->
            <div class="form-group">
              <label class="form-label">Current Asset Value</label>
              <div class="budget-input">
                <span class="currency">{{ getCurrencySymbol() }}</span>
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  [ngModel]="currentAssetValue()"
                  (ngModelChange)="currentAssetValue.set($event)">
              </div>
            </div>

            <!-- Residual Value -->
            <div class="form-group">
              <label class="form-label">Residual Value</label>
              <div class="budget-input">
                <span class="currency">{{ getCurrencySymbol() }}</span>
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  [ngModel]="residualValue()"
                  (ngModelChange)="residualValue.set($event)">
              </div>
            </div>
          </div>
        </knod-card>

        <!-- Section 4: Warranty Information -->
        <knod-card title="Warranty Information">
          <div class="form-grid">
            <!-- Warranty Provider -->
            <div class="form-group">
              <label class="form-label">Warranty Provider</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., AppleCare, Dell ProSupport"
                [ngModel]="warrantyProvider()"
                (ngModelChange)="warrantyProvider.set($event)">
            </div>

            <!-- Warranty Start Date -->
            <div class="form-group">
              <label class="form-label">Warranty Start Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="warrantyStartDate()"
                (ngModelChange)="warrantyStartDate.set($event); calculateWarrantyEnd()">
            </div>

            <!-- Warranty End Date -->
            <div class="form-group">
              <label class="form-label">Warranty End Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="warrantyEndDate()"
                (ngModelChange)="warrantyEndDate.set($event)"
                [class.auto-calculated]="warrantyEndAutoCalculated()">
              @if (warrantyEndAutoCalculated()) {
                <span class="form-hint">Auto-calculated from warranty start and period</span>
              }
            </div>

            <!-- Warranty Status -->
            <div class="form-group">
              <label class="form-label">Warranty Status</label>
              <select class="form-select" [ngModel]="warrantyStatus()" (ngModelChange)="warrantyStatus.set($event)">
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="void">Void</option>
                <option value="transferable">Transferable</option>
              </select>
            </div>

            <!-- Warranty Period -->
            <div class="form-group">
              <label class="form-label">Warranty Period</label>
              <select class="form-select" [ngModel]="warrantyPeriod()" (ngModelChange)="warrantyPeriod.set($event); calculateWarrantyEnd()">
                <option value="">Select warranty</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="none">No Warranty</option>
              </select>
            </div>

            <!-- Extended Warranty Available -->
            <div class="form-group">
              <label class="form-label">Extended Warranty Available</label>
              <select class="form-select" [ngModel]="extendedWarrantyAvailable()" (ngModelChange)="extendedWarrantyAvailable.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <!-- Extended Warranty Expiry Date -->
            @if (extendedWarrantyAvailable() === 'yes') {
              <div class="form-group">
                <label class="form-label">Extended Warranty Expiry Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="extendedWarrantyExpiryDate()"
                  (ngModelChange)="extendedWarrantyExpiryDate.set($event)">
              </div>
            }

            <!-- Support Contact Number -->
            <div class="form-group">
              <label class="form-label">Support Contact Number</label>
              <input 
                type="tel" 
                class="form-input"
                placeholder="E.g., 1800-123-4567"
                [ngModel]="supportContactNumber()"
                (ngModelChange)="supportContactNumber.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Section 5: Assignment Information -->
        <knod-card title="Assignment Information">
          <div class="form-grid">
            <!-- Assignment Type -->
            <div class="form-group">
              <label class="form-label">Assignment Type</label>
              <div class="assignment-options">
                @for (type of assignmentTypes; track type.value) {
                  <label class="assignment-option" [class.selected]="assignmentType() === type.value">
                    <input 
                      type="radio" 
                      name="assignmentType" 
                      [value]="type.value"
                      [ngModel]="assignmentType()"
                      (ngModelChange)="assignmentType.set($event)">
                    <span class="assignment-icon" [innerHTML]="type.icon"></span>
                    <span class="assignment-label">{{ type.label }}</span>
                  </label>
                }
              </div>
            </div>

            @if (assignmentType() === 'assigned') {
              <!-- Assigned Employee -->
              <div class="form-group">
                <label class="form-label">Assigned Employee</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="Enter employee name"
                  [ngModel]="assignedEmployee()"
                  (ngModelChange)="assignedEmployee.set($event)">
              </div>

              <!-- Employee ID -->
              <div class="form-group">
                <label class="form-label">Employee ID</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="E.g., EMP-001"
                  [ngModel]="employeeId()"
                  (ngModelChange)="employeeId.set($event)">
              </div>

              <!-- Department -->
              <div class="form-group">
                <label class="form-label">Department</label>
                <select class="form-select" [ngModel]="assignmentDepartment()" (ngModelChange)="assignmentDepartment.set($event)">
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="IT">Information Technology</option>
                </select>
              </div>

              <!-- Manager -->
              <div class="form-group">
                <label class="form-label">Manager</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="Enter manager name"
                  [ngModel]="manager()"
                  (ngModelChange)="manager.set($event)">
              </div>

              <!-- Assignment Date -->
              <div class="form-group">
                <label class="form-label">Assignment Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="assignmentDate()"
                  (ngModelChange)="assignmentDate.set($event)">
              </div>

              <!-- Expected Return Date -->
              <div class="form-group">
                <label class="form-label">Expected Return Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="expectedReturnDate()"
                  (ngModelChange)="expectedReturnDate.set($event)">
              </div>
            }
          </div>
        </knod-card>

        <!-- Section 6: Location Information -->
        <knod-card title="Location Information">
          <div class="form-grid">
            <!-- Office Location -->
            <div class="form-group">
              <label class="form-label">Office Location</label>
              <select class="form-select" [ngModel]="officeLocation()" (ngModelChange)="officeLocation.set($event)">
                <option value="">Select location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <!-- Building -->
            <div class="form-group">
              <label class="form-label">Building</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., Tower A, Block 1"
                [ngModel]="building()"
                (ngModelChange)="building.set($event)">
            </div>

            <!-- Floor -->
            <div class="form-group">
              <label class="form-label">Floor</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., 3rd Floor"
                [ngModel]="floor()"
                (ngModelChange)="floor.set($event)">
            </div>

            <!-- Room -->
            <div class="form-group">
              <label class="form-label">Room</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., 301, Conference Room A"
                [ngModel]="room()"
                (ngModelChange)="room.set($event)">
            </div>

            <!-- Desk/Cubicle -->
            <div class="form-group">
              <label class="form-label">Desk/Cubicle</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="E.g., D-12, Cubicle 5"
                [ngModel]="deskCubicle()"
                (ngModelChange)="deskCubicle.set($event)">
            </div>

            <!-- Storage Location -->
            <div class="form-group">
              <label class="form-label">Storage Location</label>
              <select class="form-select" [ngModel]="storageLocation()" (ngModelChange)="storageLocation.set($event)">
                <option value="">Select storage</option>
                <option value="it-bay">IT Support Bay</option>
                <option value="main-warehouse">Main Warehouse</option>
                <option value="branch-office">Branch Office</option>
                <option value="vendor-location">Vendor Location</option>
                <option value="in-transit">In Transit</option>
              </select>
            </div>
          </div>
        </knod-card>

        <!-- Section 7: Technical Specifications (Dynamic based on category) -->
        <knod-card title="Technical Specifications">
          <div class="form-grid">
            @if (category() === 'Laptop' || category() === 'Desktop') {
              <!-- Processor -->
              <div class="form-group">
                <label class="form-label">Processor</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="E.g., Apple M3 Pro, Intel i7-12700K"
                  [ngModel]="processor()"
                  (ngModelChange)="processor.set($event)">
              </div>

              <!-- RAM -->
              <div class="form-group">
                <label class="form-label">RAM</label>
                <select class="form-select" [ngModel]="ram()" (ngModelChange)="ram.set($event)">
                  <option value="">Select RAM</option>
                  <option value="4GB">4 GB</option>
                  <option value="8GB">8 GB</option>
                  <option value="16GB">16 GB</option>
                  <option value="32GB">32 GB</option>
                  <option value="64GB">64 GB</option>
                  <option value="128GB">128 GB</option>
                </select>
              </div>

              <!-- Storage Type -->
              <div class="form-group">
                <label class="form-label">Storage Type</label>
                <select class="form-select" [ngModel]="storageType()" (ngModelChange)="storageType.set($event)">
                  <option value="">Select type</option>
                  <option value="SSD">SSD</option>
                  <option value="HDD">HDD</option>
                  <option value="NVMe">NVMe</option>
                  <option value="Hybrid">Hybrid (SSHD)</option>
                </select>
              </div>

              <!-- Storage Capacity -->
              <div class="form-group">
                <label class="form-label">Storage Capacity</label>
                <select class="form-select" [ngModel]="storageCapacity()" (ngModelChange)="storageCapacity.set($event)">
                  <option value="">Select capacity</option>
                  <option value="128GB">128 GB</option>
                  <option value="256GB">256 GB</option>
                  <option value="512GB">512 GB</option>
                  <option value="1TB">1 TB</option>
                  <option value="2TB">2 TB</option>
                  <option value="4TB">4 TB</option>
                </select>
              </div>

              <!-- Operating System -->
              <div class="form-group">
                <label class="form-label">Operating System</label>
                <select class="form-select" [ngModel]="operatingSystem()" (ngModelChange)="operatingSystem.set($event)">
                  <option value="">Select OS</option>
                  <option value="macOS Sonoma">macOS Sonoma</option>
                  <option value="macOS Ventura">macOS Ventura</option>
                  <option value="Windows 11 Pro">Windows 11 Pro</option>
                  <option value="Windows 11 Home">Windows 11 Home</option>
                  <option value="Windows 10 Pro">Windows 10 Pro</option>
                  <option value="Ubuntu 22.04">Ubuntu 22.04 LTS</option>
                  <option value="Ubuntu 24.04">Ubuntu 24.04 LTS</option>
                  <option value="Linux Mint">Linux Mint</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Hostname -->
              <div class="form-group">
                <label class="form-label">Hostname</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="E.g., MACBOOK-PRO-001"
                  [ngModel]="hostname()"
                  (ngModelChange)="hostname.set($event)">
              </div>

              <!-- MAC Address -->
              <div class="form-group">
                <label class="form-label">MAC Address</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="E.g., AA:BB:CC:DD:EE:FF"
                  [ngModel]="macAddress()"
                  (ngModelChange)="macAddress.set($event)">
              </div>
            }

            @if (category() === 'Phone') {
              <!-- IMEI Number -->
              <div class="form-group">
                <label class="form-label">IMEI Number</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="Enter 15-digit IMEI"
                  [ngModel]="imeiNumber()"
                  (ngModelChange)="imeiNumber.set($event)">
              </div>

              <!-- Phone Number -->
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  class="form-input"
                  placeholder="E.g., +91 98765 43210"
                  [ngModel]="phoneNumber()"
                  (ngModelChange)="phoneNumber.set($event)">
              </div>

              <!-- Carrier -->
              <div class="form-group">
                <label class="form-label">Carrier</label>
                <select class="form-select" [ngModel]="carrier()" (ngModelChange)="carrier.set($event)">
                  <option value="">Select carrier</option>
                  <option value="jio">Jio</option>
                  <option value="airtel">Airtel</option>
                  <option value="vi">Vi (Vodafone Idea)</option>
                  <option value="bsnl">BSNL</option>
                </select>
              </div>
            }

            @if (category() === 'Monitor') {
              <!-- Screen Size -->
              <div class="form-group">
                <label class="form-label">Screen Size</label>
                <select class="form-select" [ngModel]="screenSize()" (ngModelChange)="screenSize.set($event)">
                  <option value="">Select size</option>
                  <option value="21.5">21.5 inch</option>
                  <option value="24">24 inch</option>
                  <option value="27">27 inch</option>
                  <option value="32">32 inch</option>
                  <option value="34">34 inch</option>
                  <option value="49">49 inch (Ultrawide)</option>
                </select>
              </div>

              <!-- Resolution -->
              <div class="form-group">
                <label class="form-label">Resolution</label>
                <select class="form-select" [ngModel]="resolution()" (ngModelChange)="resolution.set($event)">
                  <option value="">Select resolution</option>
                  <option value="1920x1080">Full HD (1920x1080)</option>
                  <option value="2560x1440">QHD (2560x1440)</option>
                  <option value="3840x2160">4K UHD (3840x2160)</option>
                  <option value="5120x2880">5K (5120x2880)</option>
                </select>
              </div>
            }

            @if (category() === 'Printer') {
              <!-- Printer Type -->
              <div class="form-group">
                <label class="form-label">Printer Type</label>
                <select class="form-select" [ngModel]="printerType()" (ngModelChange)="printerType.set($event)">
                  <option value="">Select type</option>
                  <option value="laser">Laser Printer</option>
                  <option value="inkjet">Inkjet Printer</option>
                  <option value="led">LED Printer</option>
                  <option value="all-in-one">All-in-One Printer</option>
                  <option value="dot-matrix">Dot Matrix</option>
                  <option value="plotter">Plotter</option>
                </select>
              </div>

              <!-- Network IP Address -->
              <div class="form-group">
                <label class="form-label">Network IP Address</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="E.g., 192.168.1.100"
                  [ngModel]="networkIpAddress()"
                  (ngModelChange)="networkIpAddress.set($event)">
              </div>
            }

            @if (category() === '') {
              <div class="form-group full-width empty-state">
                <p>Select a category above to see specific technical specifications</p>
              </div>
            }
          </div>
        </knod-card>

        <!-- Section 8: Security Information -->
        <knod-card title="Security Information">
          <div class="form-grid">
            <!-- Encryption Enabled -->
            <div class="form-group">
              <label class="form-label">Encryption Enabled</label>
              <select class="form-select" [ngModel]="encryptionEnabled()" (ngModelChange)="encryptionEnabled.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="na">Not Applicable</option>
              </select>
            </div>

            <!-- Antivirus Installed -->
            <div class="form-group">
              <label class="form-label">Antivirus Installed</label>
              <select class="form-select" [ngModel]="antivirusInstalled()" (ngModelChange)="antivirusInstalled.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="na">Not Applicable</option>
              </select>
            </div>

            @if (antivirusInstalled() === 'yes') {
              <!-- Antivirus Expiry Date -->
              <div class="form-group">
                <label class="form-label">Antivirus Expiry Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="antivirusExpiryDate()"
                  (ngModelChange)="antivirusExpiryDate.set($event)">
              </div>
            }

            <!-- Device Compliance Status -->
            <div class="form-group">
              <label class="form-label">Device Compliance Status</label>
              <select class="form-select" [ngModel]="deviceComplianceStatus()" (ngModelChange)="deviceComplianceStatus.set($event)">
                <option value="compliant">Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
                <option value="pending">Pending Review</option>
                <option value="na">Not Applicable</option>
              </select>
            </div>

            <!-- BitLocker Enabled -->
            <div class="form-group">
              <label class="form-label">BitLocker Enabled</label>
              <select class="form-select" [ngModel]="bitLockerEnabled()" (ngModelChange)="bitLockerEnabled.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="na">Not Applicable</option>
              </select>
            </div>

            <!-- MFA Enabled -->
            <div class="form-group">
              <label class="form-label">MFA Enabled</label>
              <select class="form-select" [ngModel]="mfaEnabled()" (ngModelChange)="mfaEnabled.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="na">Not Applicable</option>
              </select>
            </div>
          </div>
        </knod-card>

        <!-- Section 9: Maintenance Information -->
        <knod-card title="Maintenance Information">
          <div class="form-grid">
            <!-- AMC Available -->
            <div class="form-group">
              <label class="form-label">AMC Available</label>
              <select class="form-select" [ngModel]="amcAvailable()" (ngModelChange)="amcAvailable.set($event)">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            @if (amcAvailable() === 'yes') {
              <!-- AMC Vendor -->
              <div class="form-group">
                <label class="form-label">AMC Vendor</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="Enter AMC vendor name"
                  [ngModel]="amcVendor()"
                  (ngModelChange)="amcVendor.set($event)">
              </div>

              <!-- AMC Start Date -->
              <div class="form-group">
                <label class="form-label">AMC Start Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="amcStartDate()"
                  (ngModelChange)="amcStartDate.set($event)">
              </div>

              <!-- AMC End Date -->
              <div class="form-group">
                <label class="form-label">AMC End Date</label>
                <input 
                  type="date" 
                  class="form-input"
                  [ngModel]="amcEndDate()"
                  (ngModelChange)="amcEndDate.set($event)">
              </div>
            }

            <!-- Last Maintenance Date -->
            <div class="form-group">
              <label class="form-label">Last Maintenance Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="lastMaintenanceDate()"
                (ngModelChange)="lastMaintenanceDate.set($event)">
            </div>

            <!-- Next Maintenance Date -->
            <div class="form-group">
              <label class="form-label">Next Maintenance Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="nextMaintenanceDate()"
                (ngModelChange)="nextMaintenanceDate.set($event)">
            </div>

            <!-- Maintenance Notes -->
            <div class="form-group full-width">
              <label class="form-label">Maintenance Notes</label>
              <textarea 
                class="form-textarea"
                rows="2"
                placeholder="Enter any maintenance-related notes"
                [ngModel]="maintenanceNotes()"
                (ngModelChange)="maintenanceNotes.set($event)">
              </textarea>
            </div>
          </div>
        </knod-card>

        <!-- Section 10: Lifecycle Information -->
        <knod-card title="Lifecycle Information">
          <div class="form-grid">
            <!-- Asset Status -->
            <div class="form-group">
              <label class="form-label">Asset Status</label>
              <div class="lifecycle-status-options">
                @for (status of assetStatuses; track status.value) {
                  <label class="lifecycle-status-option" [class.selected]="assetStatus() === status.value">
                    <input 
                      type="radio" 
                      name="assetStatus" 
                      [value]="status.value"
                      [ngModel]="assetStatus()"
                      (ngModelChange)="assetStatus.set($event)">
                    <span class="status-indicator" [class]="'status-' + status.color"></span>
                    <span class="status-label">{{ status.label }}</span>
                  </label>
                }
              </div>
            </div>

            <!-- Asset Condition -->
            <div class="form-group">
              <label class="form-label">Asset Condition</label>
              <div class="condition-options">
                @for (condition of assetConditions; track condition.value) {
                  <label class="condition-option" [class.selected]="assetCondition() === condition.value">
                    <input 
                      type="radio" 
                      name="assetCondition" 
                      [value]="condition.value"
                      [ngModel]="assetCondition()"
                      (ngModelChange)="assetCondition.set($event)">
                    <span class="condition-icon" [innerHTML]="condition.icon"></span>
                    <span class="condition-label">{{ condition.label }}</span>
                  </label>
                }
              </div>
            </div>

            <!-- Lifecycle Stage -->
            <div class="form-group full-width">
              <label class="form-label">Lifecycle Stage</label>
              <select class="form-select" [ngModel]="lifecycleStage()" (ngModelChange)="lifecycleStage.set($event)">
                <option value="procurement">Procurement</option>
                <option value="active">Active</option>
                <option value="repair">Repair</option>
                <option value="retired">Retired</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
          </div>
        </knod-card>

        <!-- Section 11: Compliance & Audit -->
        <knod-card title="Compliance & Audit">
          <div class="form-grid">
            <!-- Last Audit Date -->
            <div class="form-group">
              <label class="form-label">Last Audit Date</label>
              <input 
                type="date" 
                class="form-input"
                [ngModel]="lastAuditDate()"
                (ngModelChange)="lastAuditDate.set($event)">
            </div>

            <!-- Audit Status -->
            <div class="form-group">
              <label class="form-label">Audit Status</label>
              <select class="form-select" [ngModel]="auditStatus()" (ngModelChange)="auditStatus.set($event)">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <!-- Compliance Status -->
            <div class="form-group">
              <label class="form-label">Compliance Status</label>
              <select class="form-select" [ngModel]="complianceStatus()" (ngModelChange)="complianceStatus.set($event)">
                <option value="compliant">Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
                <option value="under-review">Under Review</option>
                <option value="exempt">Exempt</option>
              </select>
            </div>

            <!-- Disposal Certificate Number -->
            <div class="form-group">
              <label class="form-label">Disposal Certificate Number</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Enter certificate number if disposed"
                [ngModel]="disposalCertificateNumber()"
                (ngModelChange)="disposalCertificateNumber.set($event)">
            </div>
          </div>
        </knod-card>

        <!-- Section 12: Attachments -->
        <knod-card title="Attachments">
          <div class="form-grid">
            <!-- Invoice Upload -->
            <div class="form-group">
              <label class="form-label">Invoice</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="invoice-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  (change)="handleFileUpload($event, 'invoice')">
                <label for="invoice-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span>Upload Invoice</span>
                  <span class="upload-hint">PDF, JPG, PNG up to 10MB</span>
                </label>
              </div>
              @if (attachments()['invoice']) {
                <div class="attachment-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span class="file-name">{{ attachments()['invoice'].name }}</span>
                  <button class="remove-btn" (click)="removeAttachment('invoice')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Warranty Documents Upload -->
            <div class="form-group">
              <label class="form-label">Warranty Documents</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="warranty-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  (change)="handleFileUpload($event, 'warranty')">
                <label for="warranty-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>Upload Warranty</span>
                  <span class="upload-hint">PDF, JPG, PNG up to 10MB</span>
                </label>
              </div>
              @if (attachments()['warranty']) {
                <div class="attachment-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span class="file-name">{{ attachments()['warranty'].name }}</span>
                  <button class="remove-btn" (click)="removeAttachment('warranty')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Purchase Order Upload -->
            <div class="form-group">
              <label class="form-label">Purchase Order</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="po-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  (change)="handleFileUpload($event, 'purchaseOrder')">
                <label for="po-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M9 15l2 2 4-4"/>
                  </svg>
                  <span>Upload PO</span>
                  <span class="upload-hint">PDF, JPG, PNG up to 10MB</span>
                </label>
              </div>
              @if (attachments()['purchaseOrder']) {
                <div class="attachment-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span class="file-name">{{ attachments()['purchaseOrder'].name }}</span>
                  <button class="remove-btn" (click)="removeAttachment('purchaseOrder')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Asset Images Upload -->
            <div class="form-group">
              <label class="form-label">Asset Images</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="images-upload"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  (change)="handleFileUpload($event, 'images')">
                <label for="images-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Upload Images</span>
                  <span class="upload-hint">JPG, PNG up to 10MB each</span>
                </label>
              </div>
              @if (attachments()['images']?.length) {
                <div class="attachment-list">
                  @for (file of attachments()['images']; track file.name) {
                    <div class="attachment-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span class="file-name">{{ file.name }}</span>
                      <button class="remove-btn" (click)="removeImageAttachment(file.name)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Compliance Documents Upload -->
            <div class="form-group">
              <label class="form-label">Compliance Documents</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="compliance-upload"
                  accept=".pdf,.doc,.docx"
                  (change)="handleFileUpload($event, 'compliance')">
                <label for="compliance-upload" class="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Upload Compliance Docs</span>
                  <span class="upload-hint">PDF, DOC, DOCX up to 10MB</span>
                </label>
              </div>
              @if (attachments()['compliance']) {
                <div class="attachment-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span class="file-name">{{ attachments()['compliance'].name }}</span>
                  <button class="remove-btn" (click)="removeAttachment('compliance')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              }
            </div>
          </div>
        </knod-card>

        <!-- Section 13: Additional Information -->
        <knod-card title="Additional Information">
          <div class="form-grid">
            <!-- Notes -->
            <div class="form-group full-width">
              <label class="form-label">Notes</label>
              <textarea 
                class="form-textarea"
                rows="3"
                placeholder="Any additional notes or comments about this asset"
                [ngModel]="notes()"
                (ngModelChange)="notes.set($event)">
              </textarea>
            </div>

            <!-- Remarks -->
            <div class="form-group full-width">
              <label class="form-label">Remarks</label>
              <textarea 
                class="form-textarea"
                rows="2"
                placeholder="Internal remarks (not visible to employees)"
                [ngModel]="remarks()"
                (ngModelChange)="remarks.set($event)">
              </textarea>
            </div>

            <!-- Custom Tags -->
            <div class="form-group full-width">
              <label class="form-label">Custom Tags</label>
              <div class="tags-input-container">
                <div class="tags-list">
                  @for (tag of customTags(); track tag) {
                    <span class="tag">
                      {{ tag }}
                      <button class="tag-remove" (click)="removeTag(tag)">×</button>
                    </span>
                  }
                </div>
                <input 
                  type="text" 
                  class="tag-input"
                  placeholder="Type and press Enter to add tags"
                  (keydown.enter)="addTag($event)">
              </div>
              <span class="form-hint">Press Enter to add tags. Tags help in searching and filtering assets.</span>
            </div>
          </div>
        </knod-card>

        <!-- Form Footer - Sticky -->
        <div class="form-footer">
          <div class="summary-info">
            <span>{{ getAssetSummary() }}</span>
            <span>{{ getFieldCompletionText() }}</span>
          </div>
          <div class="form-actions">
            <knod-button variant="secondary" (click)="goBack()">Cancel</knod-button>
            <knod-button variant="primary" [icon]="saveIcon" (click)="saveAsset()">Add Asset</knod-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-asset-page {
      max-width: 1100px;
      margin: 0 auto;
      padding-bottom: 100px;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: white;
      border: 1px solid var(--color-slate-200);
      color: var(--color-slate-600);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      background: var(--color-slate-50);
      border-color: var(--color-slate-300);
    }

    .header-title h1 {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .header-title p {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 4px 0 0 0;
    }

    /* Info Banner */
    .info-banner {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-100);
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .banner-content strong {
      font-size: 14px;
      color: var(--color-slate-900);
    }

    .banner-content span {
      font-size: 13px;
      color: var(--color-slate-600);
    }

    /* Form Container */
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .form-group.full-width {
        grid-column: span 1;
      }
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
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .required {
      color: var(--color-red-500);
    }

    .optional {
      font-weight: 400;
      color: var(--color-slate-400);
    }

    .form-hint {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
      transition: all var(--transition-fast);
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .form-input.read-only {
      background: var(--color-slate-50);
      color: var(--color-slate-500);
    }

    .form-input.auto-calculated {
      background: var(--color-primary-50);
      border-color: var(--color-primary-200);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Input with Prefix */
    .input-with-prefix {
      display: flex;
      align-items: center;
    }

    .input-prefix {
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-right: none;
      border-radius: 8px 0 0 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .input-with-prefix .form-input {
      border-radius: 0 8px 8px 0;
    }

    /* Currency Select */
    .currency-select {
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-right: none;
      border-radius: 8px 0 0 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
      min-width: 70px;
    }

    .budget-input {
      display: flex;
      align-items: center;
    }

    .budget-input .form-input {
      border-radius: 0 8px 8px 0;
    }

    .currency {
      padding: 10px 12px;
      background: var(--color-slate-100);
      border: 1px solid var(--color-slate-200);
      border-right: none;
      border-radius: 8px 0 0 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    /* Category Options */
    .category-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .category-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .category-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .category-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .category-option input {
      display: none;
    }

    .category-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-slate-500);
    }

    .category-icon svg {
      width: 18px;
      height: 18px;
    }

    .category-option.selected .category-icon {
      color: var(--color-primary-600);
    }

    .category-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Assignment Options */
    .assignment-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .assignment-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .assignment-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .assignment-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .assignment-option input {
      display: none;
    }

    .assignment-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-slate-500);
    }

    .assignment-icon svg {
      width: 16px;
      height: 16px;
    }

    .assignment-option.selected .assignment-icon {
      color: var(--color-primary-600);
    }

    .assignment-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Lifecycle Status Options */
    .lifecycle-status-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .lifecycle-status-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .lifecycle-status-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .lifecycle-status-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .lifecycle-status-option input {
      display: none;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .status-indicator.status-green { background: var(--color-success-500); }
    .status-indicator.status-blue { background: var(--color-primary-500); }
    .status-indicator.status-amber { background: var(--color-warning-500); }
    .status-indicator.status-red { background: var(--color-red-500); }
    .status-indicator.status-purple { background: var(--color-purple-500); }
    .status-indicator.status-gray { background: var(--color-slate-400); }
    .status-indicator.status-orange { background: var(--color-orange-500); }
    .status-indicator.status-teal { background: var(--color-teal-500); }

    .lifecycle-status-option .status-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Condition Options */
    .condition-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .condition-option {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .condition-option:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .condition-option.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .condition-option input {
      display: none;
    }

    .condition-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-slate-500);
    }

    .condition-icon svg {
      width: 14px;
      height: 14px;
    }

    .condition-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* File Upload */
    .file-upload {
      position: relative;
    }

    .file-upload input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      border: 2px dashed var(--color-slate-200);
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .upload-label:hover {
      border-color: var(--color-primary-400);
      background: var(--color-primary-50);
    }

    .upload-label svg {
      color: var(--color-slate-400);
    }

    .upload-label span {
      font-size: 13px;
      color: var(--color-slate-600);
    }

    .upload-hint {
      font-size: 11px !important;
      color: var(--color-slate-400) !important;
    }

    .attachment-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--color-slate-50);
      border-radius: 6px;
      font-size: 12px;
    }

    .attachment-item svg {
      color: var(--color-slate-400);
    }

    .file-name {
      flex: 1;
      color: var(--color-slate-700);
    }

    .file-size {
      color: var(--color-slate-400);
    }

    .remove-btn {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--color-slate-400);
      cursor: pointer;
    }

    .remove-btn:hover {
      background: var(--color-slate-200);
      color: var(--color-slate-600);
    }

    /* Tags Input */
    .tags-input-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .tag-remove {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--color-primary-500);
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 0;
    }

    .tag-remove:hover {
      color: var(--color-primary-700);
    }

    .tag-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      transition: all var(--transition-fast);
    }

    .tag-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    /* Empty State */
    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--color-slate-400);
      font-size: 13px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    /* Form Footer - Sticky */
    .form-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-top: 1px solid var(--color-slate-200);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      z-index: 100;
    }

    @media (max-width: 768px) {
      .form-footer {
        flex-direction: column;
        gap: 12px;
        padding: 16px;
      }
      .form-actions {
        width: 100%;
      }
      .form-actions knod-button {
        flex: 1;
      }
    }

    .summary-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .summary-info span:last-child {
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .form-actions {
      display: flex;
      gap: 12px;
    }
  `]
})
export class AddAssetComponent {
  private router: Router;

  // Asset Identification
  readonly generatedAssetId = signal(this.generateAssetId());
  readonly assetTag = signal('');
  readonly category = signal('');
  readonly subCategory = signal('');
  readonly name = signal('');
  readonly brand = signal('');
  readonly model = signal('');
  readonly modelNumber = signal('');
  readonly serialNumber = signal('');
  readonly manufacturer = signal('');
  readonly assetDescription = signal('');

  // Procurement Information
  readonly purchaseDate = signal('');
  readonly currency = signal('INR');
  readonly purchaseCost = signal<number | null>(null);
  readonly vendor = signal('');
  readonly invoiceNumber = signal('');
  readonly poNumber = signal('');
  readonly procurementType = signal('purchase');
  readonly deliveryDate = signal('');
  readonly assetReceivedDate = signal('');

  // Ownership & Financial Information
  readonly assetOwner = signal('');
  readonly costCenter = signal('');
  readonly budgetCode = signal('');
  readonly depreciationMethod = signal('');
  readonly depreciationPeriod = signal('');
  readonly currentAssetValue = signal<number | null>(null);
  readonly residualValue = signal<number | null>(null);

  // Warranty Information
  readonly warrantyProvider = signal('');
  readonly warrantyStartDate = signal('');
  readonly warrantyEndDate = signal('');
  readonly warrantyStatus = signal('active');
  readonly warrantyPeriod = signal('');
  readonly warrantyEndAutoCalculated = signal(false);
  readonly extendedWarrantyAvailable = signal('no');
  readonly extendedWarrantyExpiryDate = signal('');
  readonly supportContactNumber = signal('');

  // Assignment Information
  readonly assignmentType = signal('unassigned');
  readonly assignedEmployee = signal('');
  readonly employeeId = signal('');
  readonly assignmentDepartment = signal('');
  readonly manager = signal('');
  readonly assignmentDate = signal('');
  readonly expectedReturnDate = signal('');

  // Location Information
  readonly officeLocation = signal('');
  readonly building = signal('');
  readonly floor = signal('');
  readonly room = signal('');
  readonly deskCubicle = signal('');
  readonly storageLocation = signal('');

  // Technical Specifications (Laptop/Desktop)
  readonly processor = signal('');
  readonly ram = signal('');
  readonly storageType = signal('');
  readonly storageCapacity = signal('');
  readonly operatingSystem = signal('');
  readonly hostname = signal('');
  readonly macAddress = signal('');

  // Technical Specifications (Mobile)
  readonly imeiNumber = signal('');
  readonly phoneNumber = signal('');
  readonly carrier = signal('');

  // Technical Specifications (Monitor)
  readonly screenSize = signal('');
  readonly resolution = signal('');

  // Technical Specifications (Printer)
  readonly printerType = signal('');
  readonly networkIpAddress = signal('');

  // Security Information
  readonly encryptionEnabled = signal('na');
  readonly antivirusInstalled = signal('na');
  readonly antivirusExpiryDate = signal('');
  readonly deviceComplianceStatus = signal('pending');
  readonly bitLockerEnabled = signal('na');
  readonly mfaEnabled = signal('na');

  // Maintenance Information
  readonly amcAvailable = signal('no');
  readonly amcVendor = signal('');
  readonly amcStartDate = signal('');
  readonly amcEndDate = signal('');
  readonly lastMaintenanceDate = signal('');
  readonly nextMaintenanceDate = signal('');
  readonly maintenanceNotes = signal('');

  // Lifecycle Information
  readonly assetStatus = signal('available');
  readonly assetCondition = signal('new');
  readonly lifecycleStage = signal('procurement');

  // Compliance & Audit
  readonly lastAuditDate = signal('');
  readonly auditStatus = signal('pending');
  readonly complianceStatus = signal('compliant');
  readonly disposalCertificateNumber = signal('');

  // Additional Information
  readonly notes = signal('');
  readonly remarks = signal('');
  readonly customTags = signal<string[]>([]);

  // Attachments
  readonly attachments = signal<Record<string, any>>({});

  readonly saveIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

  readonly categories: AssetCategory[] = [
    { value: 'Laptop', label: 'Laptop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Desktop', label: 'Desktop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Monitor', label: 'Monitor', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Phone', label: 'Phone', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { value: 'Accessory', label: 'Accessory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { value: 'Printer', label: 'Printer', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' }
  ];

  readonly assignmentTypes = [
    { value: 'unassigned', label: 'Unassigned', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>' },
    { value: 'assigned', label: 'Assigned', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { value: 'shared', label: 'Shared', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { value: 'reserved', label: 'Reserved', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' }
  ];

  readonly assetStatuses = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'assigned', label: 'Assigned', color: 'blue' },
    { value: 'in-stock', label: 'In Stock', color: 'teal' },
    { value: 'under-maintenance', label: 'Maintenance', color: 'amber' },
    { value: 'lost', label: 'Lost', color: 'red' },
    { value: 'retired', label: 'Retired', color: 'gray' },
    { value: 'disposed', label: 'Disposed', color: 'purple' },
    { value: 'damaged', label: 'Damaged', color: 'orange' }
  ];

  readonly assetConditions = [
    { value: 'new', label: 'New', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
    { value: 'good', label: 'Good', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
    { value: 'fair', label: 'Fair', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' },
    { value: 'poor', label: 'Poor', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' }
  ];

  constructor(router: Router) {
    this.router = router;
  }

  private generateAssetId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AST-${timestamp}-${random}`;
  }

  getCurrencySymbol(): string {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return symbols[this.currency()] || '₹';
  }

  calculateWarrantyEnd(): void {
    const startDate = this.warrantyStartDate() || this.purchaseDate();
    const period = this.warrantyPeriod();
    
    if (startDate && period && period !== 'none') {
      const start = new Date(startDate);
      const years = parseInt(period);
      if (!isNaN(years)) {
        start.setFullYear(start.getFullYear() + years);
        this.warrantyEndDate.set(start.toISOString().split('T')[0]);
        this.warrantyEndAutoCalculated.set(true);
      }
    }
  }

  handleFileUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileData = {
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type,
        lastModified: file.lastModified
      };

      if (type === 'images') {
        const currentImages = this.attachments()['images'] || [];
        this.attachments.update(att => ({
          ...att,
          images: [...currentImages, fileData]
        }));
      } else {
        this.attachments.update(att => ({
          ...att,
          [type]: fileData
        }));
      }
    }
  }

  removeAttachment(type: string): void {
    this.attachments.update(att => {
      const newAttachments = { ...att };
      delete newAttachments[type];
      return newAttachments;
    });
  }

  removeImageAttachment(fileName: string): void {
    this.attachments.update(att => ({
      ...att,
      images: (att['images'] || []).filter((f: any) => f.name !== fileName)
    }));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const tagValue = input.value.trim();
    
    if (tagValue && !this.customTags().includes(tagValue)) {
      this.customTags.update(tags => [...tags, tagValue]);
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    this.customTags.update(tags => tags.filter(t => t !== tag));
  }

  getAssetSummary(): string {
    const parts = [];
    if (this.category()) parts.push(this.category());
    if (this.brand()) parts.push(this.brand());
    if (this.name()) parts.push(`- ${this.name()}`);
    return parts.join(' ') || 'No details entered';
  }

  getFieldCompletionText(): string {
    const requiredFields = [
      this.category(),
      this.name(),
      this.brand(),
      this.model(),
      this.serialNumber(),
      this.purchaseDate(),
      this.purchaseCost()
    ];
    
    const filledCount = requiredFields.filter(f => f !== '' && f !== null && f !== undefined).length;
    const totalCount = requiredFields.length;
    
    return `${filledCount}/${totalCount} required fields completed`;
  }

  goBack(): void {
    this.router.navigate(['/assets']);
  }

  saveAsset(): void {
    // Validate required fields
    if (!this.category() || !this.name() || !this.brand() || !this.model() || 
        !this.serialNumber() || !this.purchaseDate() || !this.purchaseCost()) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate asset tag if empty
    const assetTag = this.assetTag() || `AST-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

    // Submit asset with all data
    const newAsset = {
      // Asset Identification
      assetId: this.generatedAssetId(),
      assetTag: assetTag,
      category: this.category(),
      subCategory: this.subCategory(),
      name: this.name(),
      brand: this.brand(),
      model: this.model(),
      modelNumber: this.modelNumber(),
      serialNumber: this.serialNumber(),
      manufacturer: this.manufacturer(),
      assetDescription: this.assetDescription(),

      // Procurement Information
      purchaseDate: this.purchaseDate(),
      currency: this.currency(),
      purchaseCost: this.purchaseCost(),
      vendor: this.vendor(),
      invoiceNumber: this.invoiceNumber(),
      poNumber: this.poNumber(),
      procurementType: this.procurementType(),
      deliveryDate: this.deliveryDate(),
      assetReceivedDate: this.assetReceivedDate(),

      // Ownership & Financial Information
      assetOwner: this.assetOwner(),
      costCenter: this.costCenter(),
      budgetCode: this.budgetCode(),
      depreciationMethod: this.depreciationMethod(),
      depreciationPeriod: this.depreciationPeriod(),
      currentAssetValue: this.currentAssetValue(),
      residualValue: this.residualValue(),

      // Warranty Information
      warrantyProvider: this.warrantyProvider(),
      warrantyStartDate: this.warrantyStartDate(),
      warrantyEndDate: this.warrantyEndDate(),
      warrantyStatus: this.warrantyStatus(),
      warrantyPeriod: this.warrantyPeriod(),
      extendedWarrantyAvailable: this.extendedWarrantyAvailable(),
      extendedWarrantyExpiryDate: this.extendedWarrantyExpiryDate(),
      supportContactNumber: this.supportContactNumber(),

      // Assignment Information
      assignmentType: this.assignmentType(),
      assignedEmployee: this.assignedEmployee(),
      employeeId: this.employeeId(),
      assignmentDepartment: this.assignmentDepartment(),
      manager: this.manager(),
      assignmentDate: this.assignmentDate(),
      expectedReturnDate: this.expectedReturnDate(),

      // Location Information
      officeLocation: this.officeLocation(),
      building: this.building(),
      floor: this.floor(),
      room: this.room(),
      deskCubicle: this.deskCubicle(),
      storageLocation: this.storageLocation(),

      // Technical Specifications
      processor: this.processor(),
      ram: this.ram(),
      storageType: this.storageType(),
      storageCapacity: this.storageCapacity(),
      operatingSystem: this.operatingSystem(),
      hostname: this.hostname(),
      macAddress: this.macAddress(),
      imeiNumber: this.imeiNumber(),
      phoneNumber: this.phoneNumber(),
      carrier: this.carrier(),
      screenSize: this.screenSize(),
      resolution: this.resolution(),
      printerType: this.printerType(),
      networkIpAddress: this.networkIpAddress(),

      // Security Information
      encryptionEnabled: this.encryptionEnabled(),
      antivirusInstalled: this.antivirusInstalled(),
      antivirusExpiryDate: this.antivirusExpiryDate(),
      deviceComplianceStatus: this.deviceComplianceStatus(),
      bitLockerEnabled: this.bitLockerEnabled(),
      mfaEnabled: this.mfaEnabled(),

      // Maintenance Information
      amcAvailable: this.amcAvailable(),
      amcVendor: this.amcVendor(),
      amcStartDate: this.amcStartDate(),
      amcEndDate: this.amcEndDate(),
      lastMaintenanceDate: this.lastMaintenanceDate(),
      nextMaintenanceDate: this.nextMaintenanceDate(),
      maintenanceNotes: this.maintenanceNotes(),

      // Lifecycle Information
      assetStatus: this.assetStatus(),
      assetCondition: this.assetCondition(),
      lifecycleStage: this.lifecycleStage(),

      // Compliance & Audit
      lastAuditDate: this.lastAuditDate(),
      auditStatus: this.auditStatus(),
      complianceStatus: this.complianceStatus(),
      disposalCertificateNumber: this.disposalCertificateNumber(),

      // Additional Information
      notes: this.notes(),
      remarks: this.remarks(),
      customTags: this.customTags(),

      // Attachments
      attachments: this.attachments(),

      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating asset:', newAsset);
    
    // Navigate back to assets
    this.router.navigate(['/assets']);
  }
}