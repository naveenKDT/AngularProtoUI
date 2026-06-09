# Asset Management Module - UI Redesign Specification

## Overview

This document outlines the comprehensive UI redesign for the Asset Management module, following the premium enterprise SaaS Admin Dashboard design system. The redesign maintains all existing functionality while elevating the visual experience.

---

## Design System Summary

### Tech Stack
- Angular 21 with Standalone Components
- Angular Signals for state management
- Tailwind CSS for utility classes
- SCSS for component styling and theme variables
- No external UI component libraries

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#F3F6FB` | Page background |
| Card Background | `#FFFFFF` | All card surfaces |
| Border | `#E5EAF3` | Dividers and borders |
| Text Primary | `#0F172A` | Headlines, titles |
| Text Secondary | `#64748B` | Descriptions, labels |
| Primary Blue | `#3B82F6` | Primary actions |
| Primary Hover | `#2563EB` | Hover states |
| Success | `#22C55E` | Positive status |
| Success Light | `#DCFCE7` | Success backgrounds |
| Warning | `#F59E0B` | Caution states |
| Warning Light | `#FEF3C7` | Warning backgrounds |
| Danger | `#EF4444` | Error states |
| Danger Light | `#FEE2E2` | Danger backgrounds |
| Purple | `#8B5CF6` | View actions |
| Purple Light | `#F3E8FF` | Purple backgrounds |
| Info | `#06B6D4` | Info states |
| Info Light | `#CFFAFE` | Info backgrounds |

### Typography

| Element | Size | Weight |
|---------|------|--------|
| Page Title | 36px | 700 |
| Section Title | 28px | 700 |
| Card Title | 18px | 600 |
| Table Header | 15px | 600 |
| Body Text | 14px | 400-500 |

Font Family: **Inter, sans-serif**

### Spacing Scale
4, 8, 12, 16, 20, 24, 32, 40, 48px

### Border Radius System

| Element | Radius |
|---------|--------|
| Inputs | 14px |
| Buttons | 16px |
| Cards | 24px |
| Large panels | 28px |
| Sidebar nav items | 18px |
| Icon containers | 20px |

### Shadow System

```scss
// Card default
box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);

// Card hover
box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);

// Dropdown/floating
box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
```

---

## Module Structure

### Route Structure

```
/assets                    → Assets List (default view)
/assets/new               → Add New Asset
/assets/:id               → Asset Details

/requests                 → Requests List
/requests/new             → Raise New Request
/requests/:id             → Request Details

/tickets                  → Tickets List
/tickets/new              → Raise New Ticket
/tickets/:id              → Ticket Details

/reports                  → Reports Dashboard

/it-clearance             → IT Clearance List
/it-clearance/:id         → Clearance Details
```

---

## Component Specifications

### 1. Page Header

**Structure:**
- Left: Icon container (72×72px, 20px radius) + Title (36px bold) + Description (16px muted)
- Right: Primary action button (blue gradient, 52px height, 16px radius)
- Above: Breadcrumb navigation

**Styles:**
```scss
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  .icon-container {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 16px;
    color: var(--text-secondary);
  }
}
```

### 2. Stat Cards Grid

**Layout:** 4 columns desktop → 2 columns tablet → 1 column mobile

**Structure per card:**
- White background, 24px border radius, soft shadow
- Left: Icon container (72×72px, 20px radius, colored background)
- Right: Large numeric value (28px bold) + muted label (14px)

**Hover effect:**
```scss
.stat-card {
  transition: transform 200ms ease, box-shadow 200ms ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
  }
}
```

### 3. Data Tables

**Container:**
- White background
- 28px border radius
- Soft shadow
- Row height: 88px

**Column headers:** 15px, weight 600, gray text

**Row hover:** Light blue background highlight (#F8FAFC)

**Row structure:**
- Rounded square icon container
- Bold primary name + muted secondary description
- Status badge (fully rounded pill)
- Action buttons aligned right

**Status badges (fully rounded pills):**
| Status | Background | Text Color |
|--------|------------|------------|
| Available | `#DCFCE7` | `#22C55E` |
| Assigned | `#CFFAFE` | `#06B6D4` |
| Maintenance | `#FEF3C7` | `#F59E0B` |
| Retired | `#F1F5F9` | `#64748B` |

### 4. Action Buttons

**Size:** 44×44px, 14px border radius

**Hover:** Scale up animation (1.05)

| Type | Background | Icon Color |
|------|------------|------------|
| View | `#F3E8FF` | `#8B5CF6` |
| Edit | `#EFF6FF` | `#3B82F6` |
| Delete | `#FEE2E2` | `#EF4444` |

### 5. Primary Action Button

```scss
.primary-btn {
  height: 52px;
  padding: 0 28px;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  border-radius: 16px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
  transition: all 200ms ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.45);
  }
}
```

### 6. Form Inputs

```scss
.form-input {
  height: 52px;
  border: 2px solid #E2E8F0;
  border-radius: 14px;
  padding: 0 20px;
  font-size: 14px;
  transition: all 200ms ease;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
  
  &.error {
    border-color: #EF4444;
  }
}

.error-message {
  font-size: 12px;
  color: #EF4444;
  margin-top: 6px;
}
```

### 7. Cards

```scss
.card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  transition: all 200ms ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .card-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
  }
}
```

### 8. Modals

```scss
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 28px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: modalEntry 200ms ease;
}

@keyframes modalEntry {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 9. Search & Filter Bar

```scss
.toolbar {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #E5EAF3;
  
  .search-box {
    flex: 1;
    max-width: 400px;
    position: relative;
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748B;
    }
    
    input {
      width: 100%;
      height: 48px;
      padding-left: 48px;
      border: 2px solid #E5EAF3;
      border-radius: 16px;
      
      &:focus {
        border-color: #3B82F6;
      }
    }
  }
  
  .filter-select {
    height: 48px;
    padding: 0 40px 0 16px;
    border: 2px solid #E5EAF3;
    border-radius: 14px;
    background: white url("data:image/svg+xml...") no-repeat right 16px center;
    cursor: pointer;
  }
}
```

### 10. Empty States

```scss
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    background: #F3F6FB;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: #64748B;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .empty-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
}
```

---

## Page-Specific Designs

### 1. Assets List Page (`/assets`)

**Components:**
1. Page Header with "Add Asset" button
2. Stat Cards: Total Assets, Available, Assigned, Maintenance, Total Value
3. Main Card with:
   - Toolbar (search, filters for status & category)
   - Data table with columns: Asset, Tag, Category, Status, Assigned To, Location, Value, Actions
4. Pagination footer

**Responsive Behavior:**
- Desktop: Full table view
- Tablet: Horizontal scroll with sticky first column
- Mobile: Card-based view with essential info

### 2. Asset Details Page (`/assets/:id`)

**Layout:** Two-column (70% content, 30% sidebar)

**Left Column:**
- Asset information card
- Assignment history
- Maintenance log
- Activity timeline

**Right Column:**
- Quick actions card
- Asset image/specs
- Related requests/tickets

### 3. Add Asset Page (`/assets/new`)

**Layout:** Centered form (max-width 800px)

**Sections:**
1. Basic Information (name, category, brand, model, serial number)
2. Purchase Details (date, cost, vendor, warranty)
3. Assignment Settings (location, department)
4. Custom Fields

**Form validation with inline error messages**

### 4. Requests Page (`/requests`)

**Components:**
1. Page Header with "New Request" button
2. Stats: Pending, Approved, Fulfilled, Rejected
3. Filter tabs by status
4. Request list with expandable details
5. Side panel for request details when selected

### 5. Tickets Page (`/tickets`)

**Components:**
1. Page Header with "New Ticket" button
2. Info banner explaining ticket vs request
3. Stats: Open, In Progress, Pending, Resolved
4. Two-column layout:
   - Left: Ticket list with filters
   - Right: Selected ticket details with comments

### 6. Reports Page (`/reports`)

**Layout:** Dashboard-style grid

**Cards:**
- Asset Distribution by Category (pie chart)
- Assets by Status (bar chart)
- Monthly Acquisitions (line chart)
- Top Assigned Employees
- Assets Nearing Warranty Expiry
- Recent Activity Feed

### 7. IT Clearance Page (`/it-clearance`)

**Components:**
1. Page Header
2. Stats: Pending, In Progress, Completed
3. Clearance requests table with:
   - Employee info
   - Department
   - Status
   - Due date
   - Assigned reviewer

---

## Animations & Transitions

All transitions use: `200ms ease`

| Element | Animation |
|---------|-----------|
| Card hover | `translateY(-4px)` + elevated shadow |
| Button hover | `translateY(-2px)` + darker color |
| Modal entry | `fade in` + `scale(0.95 → 1)` |
| Sidebar items | `slide` + `fade` |
| Dropdown | `height expand` + `chevron rotation` |
| Action buttons | `scale(1 → 1.05)` |

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| 1920px | Full enterprise layout, all columns visible |
| 1440px | Optimized laptop layout |
| 1366px | Fit without horizontal scroll |
| 1024px | Sidebar collapses to icon-only |
| 768px | Single-column, sidebar hidden |
| 480px | Mobile card-based presentation |

---

## Implementation Checklist

### Phase 1: Core Components
- [ ] Update theme variables with design tokens
- [ ] Create/review stat-card component
- [ ] Create/review badge component with all variants
- [ ] Create/review page-header component
- [ ] Create/review breadcrumb component
- [ ] Create/review data-table component

### Phase 2: Layout
- [ ] Verify sidebar styling matches design
- [ ] Verify header styling matches design
- [ ] Verify main content area padding/margins

### Phase 3: Pages
- [ ] Assets List page styling
- [ ] Asset Details page styling
- [ ] Add Asset form styling
- [ ] Requests page styling
- [ ] Tickets page styling
- [ ] Reports page styling
- [ ] IT Clearance page styling

### Phase 4: Polish
- [ ] Add hover states to all interactive elements
- [ ] Add focus states for accessibility
- [ ] Verify mobile responsiveness
- [ ] Test animations and transitions
- [ ] Verify all shadow styles
- [ ] Check color contrast for accessibility

---

## Design Tokens Reference

```scss
:root {
  // Colors
  --bg-page: #F3F6FB;
  --bg-card: #FFFFFF;
  --border-color: #E5EAF3;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  
  --primary: #3B82F6;
  --primary-hover: #2563EB;
  
  --success: #22C55E;
  --success-light: #DCFCE7;
  
  --warning: #F59E0B;
  --warning-light: #FEF3C7;
  
  --danger: #EF4444;
  --danger-light: #FEE2E2;
  
  --purple: #8B5CF6;
  --purple-light: #F3E8FF;
  
  --info: #06B6D4;
  --info-light: #CFFAFE;
  
  // Spacing
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  
  // Border Radius
  --radius-sm: 14px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 28px;
  
  // Shadows
  --shadow-card: 0 8px 30px rgba(15, 23, 42, 0.06);
  --shadow-card-hover: 0 15px 40px rgba(15, 23, 42, 0.12);
  --shadow-dropdown: 0 20px 50px rgba(15, 23, 42, 0.15);
  
  // Transitions
  --transition: 200ms ease;
}
```

---

*Last Updated: 2026-06-09*
*Version: 1.0*