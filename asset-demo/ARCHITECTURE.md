# HRMS Admin Dashboard - Architecture Documentation

## Overview

This is a modern enterprise HRMS (Human Resource Management System) Admin Dashboard built with Angular 21, standalone components, Tailwind CSS, and SCSS for theming.

## Tech Stack

- **Framework**: Angular 21
- **Styling**: 
  - Tailwind CSS for utility classes
  - SCSS for component styling
  - CSS Custom Properties (CSS Variables) for theming
- **Architecture**: Standalone Components only
- **State Management**: Angular Signals
- **No External UI Libraries**: No Angular Material, Bootstrap, PrimeNG, or other UI component libraries

## Project Structure

```
asset-demo/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── layouts/
│   │   │       ├── sidebar.component.ts      # Sidebar navigation component
│   │   │       ├── header.component.ts       # Top header with search, notifications
│   │   │       └── main-layout.component.ts # Main layout wrapper
│   │   │
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── button.component.ts       # Reusable button component
│   │   │       ├── card.component.ts          # Card container component
│   │   │       ├── badge.component.ts        # Status badge component
│   │   │       ├── input.component.ts        # Form input component
│   │   │       ├── modal.component.ts         # Modal/dialog component
│   │   │       ├── stat-card.component.ts    # Statistics card
│   │   │       ├── page-header.component.ts  # Page header with icon
│   │   │       ├── breadcrumb.component.ts   # Breadcrumb navigation
│   │   │       ├── data-table.component.ts  # Data table with pagination
│   │   │       └── index.ts                 # Component exports
│   │   │
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts   # Dashboard page
│   │   │   ├── administration/
│   │   │   │   └── administration.component.ts # Admin management page
│   │   │   ├── leaves/
│   │   │   │   └── leaves.component.ts      # Leave management page
│   │   │   ├── onboarding/
│   │   │   │   └── onboarding.component.ts  # Onboarding page
│   │   │   └── profile/
│   │   │       └── profile.component.ts    # User profile page
│   │   │
│   │   ├── theme/
│   │   │   ├── _variables.scss              # SCSS variables (deprecated)
│   │   │   ├── _mixins.scss                 # SCSS mixins (deprecated)
│   │   │   └── index.scss                   # Theme exports
│   │   │
│   │   ├── app.ts                          # Root app component
│   │   ├── app.routes.ts                  # Application routes
│   │   └── app.config.ts                  # App configuration
│   │
│   ├── styles.scss                         # Global styles with CSS variables
│   ├── index.html                          # HTML entry point
│   └── main.ts                             # Bootstrap file
│
├── angular.json                             # Angular CLI configuration
├── package.json                             # Dependencies
└── tsconfig.json                           # TypeScript configuration
```

## Design System

### Color System (CSS Variables)

```scss
--primary-blue: #3B82F6
--primary-hover: #2563EB
--bg-main: #F3F6FB
--bg-card: #FFFFFF
--bg-border: #E5EAF3
--text-primary: #0F172A
--text-secondary: #64748B
--success: #22C55E
--warning: #F59E0B
--danger: #EF4444
--purple: #8B5CF6
--orange: #F97316
--info: #06B6D4
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (28px), 4xl (36px)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing System

4px base unit: 4, 8, 12, 16, 20, 24, 32, 40, 48px

### Border Radius

- sm: 8px
- md: 14px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 28px
- full: 9999px

### Shadows

- **Card**: `0 8px 30px rgba(15, 23, 42, 0.06)`
- **Card Hover**: `0 15px 40px rgba(15, 23, 42, 0.12)`
- **Dropdown**: `0 20px 50px rgba(15, 23, 42, 0.15)`

## Pages

### 1. Dashboard
- Statistics cards (Departments, Employees, Active Projects, Hierarchy Levels)
- Recent employees table
- Quick actions widget
- Organization hierarchy timeline
- Department distribution chart

### 2. Administration
- Department management with CRUD operations
- Statistics overview
- Search and filter functionality
- Detail panel for selected item

### 3. Leaves
- Leave statistics
- Leave type cards with progress bars
- Leave requests table with status
- Upcoming leaves widget
- Team availability chart

### 4. Onboarding
- New hires list with progress tracking
- Onboarding checklist
- Required documents checklist
- Quick actions

### 5. Profile
- Profile header with cover photo
- Personal information card
- Work information card
- Skills & expertise tags
- Recent activity timeline

## Components

### Core Layout Components

| Component | Description |
|-----------|-------------|
| `SidebarComponent` | Fixed sidebar with gradient background, navigation items, collapsible behavior |
| `HeaderComponent` | Top header with search, notifications, user profile dropdown |
| `MainLayoutComponent` | Layout wrapper combining sidebar, header, and content area |

### Shared UI Components

| Component | Props | Description |
|----------|-------|-------------|
| `ButtonComponent` | variant, size, type, disabled, icon, iconOnly | Reusable button with variants (primary, secondary, outline, ghost) |
| `CardComponent` | title, subtitle, hoverable, noPadding | Container card with header and body |
| `BadgeComponent` | variant | Status badge (success, warning, danger, info, purple, orange, gray) |
| `InputComponent` | label, type, placeholder, disabled, error, hint | Form input with label and validation |
| `ModalComponent` | isOpen, title, size, showFooter | Dialog modal with header, body, footer |
| `StatCardComponent` | icon, iconBg, value, label, change, changeType | Statistics display card |
| `PageHeaderComponent` | title, description, icon, iconBg | Page header with icon and actions slot |
| `BreadcrumbComponent` | items | Breadcrumb navigation |
| `DataTableComponent` | columns, data, showActions, pageSize | Data table with search, sort, pagination |

## Routes

```typescript
{
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: 'dashboard', loadComponent: () => DashboardComponent },
    { path: 'profile', loadComponent: () => ProfileComponent },
    { path: 'administration', loadComponent: () => AdministrationComponent },
    { path: 'leaves', loadComponent: () => LeavesComponent },
    { path: 'onboarding', loadComponent: () => OnboardingComponent }
  ]
}
```

## Responsive Breakpoints

- **1920px+**: Full enterprise layout
- **1440px**: Optimized laptop layout
- **1366px**: Standard laptop
- **1024px**: Tablet (sidebar collapses)
- **768px**: Mobile (single column layout)
- **480px**: Small mobile

## Key Features

1. **Gradient Sidebar**: Dark blue gradient with decorative shapes
2. **Glassmorphism Cards**: Soft shadows and rounded corners
3. **Signal-based State**: Using Angular signals for reactive state
4. **Lazy Loading**: All feature modules are lazy-loaded
5. **Fully Responsive**: Mobile-first responsive design
6. **Enterprise Design**: Professional HRMS aesthetics with clean spacing

## Development

### Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Adding New Components

1. Create component in appropriate directory under `src/app/`
2. Use standalone component architecture
3. Use CSS variables for styling (defined in `styles.scss`)
4. Export from appropriate index.ts file

### Adding New Pages

1. Create component in `src/app/features/<feature>/`
2. Add route in `app.routes.ts`
3. Add navigation item in `SidebarComponent`

## Notes

- The project uses CSS Custom Properties (CSS Variables) instead of SCSS variables for better compatibility with Angular's component-scoped styles
- SCSS variables are defined in theme files but not actively used in components
- All styling is done using inline `styles` in components or global `styles.scss`