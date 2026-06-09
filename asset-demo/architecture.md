# HRMS Admin Dashboard - Architecture Documentation

## Overview

This is a modern enterprise HRMS and Asset Management Admin Dashboard built using Angular Standalone Components, Angular Signals, SCSS Design System, and reusable UI components.

The application follows a modular architecture where each business domain is isolated into its own module while sharing common layouts, components, and design tokens.

---

# Tech Stack

## Frontend

* Angular 21
* TypeScript
* Angular Signals
* Standalone Components
* Angular Router
* SCSS
* Tailwind CSS

## UI Architecture

* Shared Component Library
* Global Design System
* CSS Variables
* SCSS Theme Layer
* Responsive Enterprise Layout

## State Management

* Angular Signals
* Component Local State
* Service-Based Data Layer

## UI Libraries

No external UI frameworks are used.

The application does NOT use:

* Angular Material
* Bootstrap
* PrimeNG
* NG-Zorro
* Nebular

All UI components are custom-built.

---

# Project Structure

```text
src/
│
├── main.ts
├── index.html
├── styles.scss
├── styles.css
│
├── app/
│
│   ├── app.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.scss
│
│   ├── core/
│   │
│   │   └── layouts/
│   │       ├── header.component.ts
│   │       ├── sidebar.component.ts
│   │       └── main-layout.component.ts
│   │
│   ├── modules/
│   │
│   │   ├── dashboard/
│   │   │   └── components/
│   │   │       └── dashboard.component.ts
│   │
│   │   ├── profile/
│   │   │   └── components/
│   │   │       └── profile.component.ts
│   │
│   │   ├── administration/
│   │   │   └── components/
│   │   │       └── administration.component.ts
│   │
│   │   ├── leaves/
│   │   │   └── components/
│   │   │       └── leaves.component.ts
│   │
│   │   ├── onboarding-offboarding/
│   │   │   └── components/
│   │   │       ├── onboarding/
│   │   │       │   └── onboarding.component.ts
│   │   │       │
│   │   │       └── offboarding/
│   │   │           ├── offboarding.component.ts
│   │   │           └── initiate-offboarding.component.ts
│   │
│   │   └── asset-management/
│   │       └── components/
│   │           ├── assets/
│   │           │   ├── assets.component.ts
│   │           │   └── asset-details.component.ts
│   │           │
│   │           ├── add-asset/
│   │           │   └── add-asset.component.ts
│   │           │
│   │           ├── requests/
│   │           │   └── requests.component.ts
│   │           │
│   │           ├── raise-request/
│   │           │   └── raise-request.component.ts
│   │           │
│   │           ├── tickets/
│   │           │   └── tickets.component.ts
│   │           │
│   │           ├── raise-ticket/
│   │           │   └── raise-ticket.component.ts
│   │           │
│   │           ├── reports/
│   │           │   └── reports.component.ts
│   │           │
│   │           └── it-clearance/
│   │               └── it-clearance.component.ts
│   │
│   ├── shared/
│   │
│   │   └── components/
│   │       ├── badge.component.ts
│   │       ├── breadcrumb.component.ts
│   │       ├── button.component.ts
│   │       ├── card.component.ts
│   │       ├── data-table.component.ts
│   │       ├── input.component.ts
│   │       ├── modal.component.ts
│   │       ├── page-header.component.ts
│   │       ├── stat-card.component.ts
│   │       ├── ui-components.ts
│   │       └── index.ts
│   │
│   └── theme/
│       ├── _variables.scss
│       ├── _mixins.scss
│       └── index.scss
```

---

# Architecture Layers

## Core Layer

Location:

```text
app/core/
```

Contains application-wide layout infrastructure.

### Components

| Component           | Responsibility              |
| ------------------- | --------------------------- |
| MainLayoutComponent | Root authenticated layout   |
| SidebarComponent    | Main application navigation |
| HeaderComponent     | Top navigation bar          |

---

## Shared Layer

Location:

```text
app/shared/
```

Contains reusable UI components used across all modules.

### Shared Components

| Component           | Purpose                   |
| ------------------- | ------------------------- |
| ButtonComponent     | Reusable button variants  |
| CardComponent       | Standard card container   |
| BadgeComponent      | Status badges             |
| InputComponent      | Form inputs               |
| ModalComponent      | Modal dialogs             |
| StatCardComponent   | KPI widgets               |
| PageHeaderComponent | Standardized page headers |
| BreadcrumbComponent | Navigation breadcrumbs    |
| DataTableComponent  | Reusable data tables      |

---

## Feature Modules

Location:

```text
app/modules/
```

Each business area is isolated into its own module.

### Dashboard

Provides organizational KPIs, quick insights, charts, and recent activity.

---

### Administration

Provides administration-related management screens and configuration features.

---

### Leaves

Handles employee leave management workflows.

---

### Onboarding & Offboarding

Handles employee lifecycle processes.

Features include:

* Employee onboarding
* Employee offboarding
* Exit process tracking
* Asset recovery workflow

---

### Asset Management

Handles complete IT asset lifecycle management.

Features include:

* Asset Inventory
* Add Asset
* Asset Details
* Asset Assignment
* Asset Requests
* Ticket Management
* IT Clearance
* Asset Reports

---

# Routing Architecture

The application uses Angular Standalone Routing.

Structure:

```text
/
├── dashboard
├── administration
├── leaves
├── onboarding
├── offboarding
├── profile
│
├── assets
├── assets/new
├── assets/:id
│
├── requests
├── requests/new
│
├── tickets
├── tickets/new
│
├── reports
│
└── it-clearance
```

---

# Design System Architecture

Location:

```text
app/theme/
```

Contains:

* Design Tokens
* Theme Variables
* SCSS Mixins
* Shared Styling Utilities

### Design Principles

* Enterprise SaaS UI
* Consistent spacing
* Responsive layouts
* Accessible components
* Reusable UI patterns

---

# State Management Strategy

The application uses Angular Signals.

### Guidelines

Use Signals for:

* UI state
* Form state
* Search state
* Filter state
* Modal state
* Component-level data

Avoid unnecessary global state management libraries.

---

# Responsive Design Strategy

## Desktop

1920px+

Full enterprise experience.

## Laptop

1366px–1440px

Optimized layouts.

## Tablet

768px–1024px

Sidebar collapses.

## Mobile

Below 768px

Single-column responsive layouts.

---

# Development Standards

## Components

All new components must:

* Be standalone
* Use Signals where appropriate
* Follow design system tokens
* Support responsive layouts
* Support accessibility requirements

## Styling

Preferred order:

1. Design Tokens
2. SCSS Variables
3. CSS Variables
4. Tailwind Utilities

No inline hardcoded styling unless necessary.

## Reusability

Before creating a new component:

* Check Shared Components
* Extend existing components when possible
* Maintain visual consistency

---

# Future Expansion

The architecture is designed to support additional modules such as:

* Payroll
* Attendance
* Recruitment
* Performance Management
* Learning & Development
* Procurement
* Vendor Management
* Finance Operations

without requiring structural changes to the application.
