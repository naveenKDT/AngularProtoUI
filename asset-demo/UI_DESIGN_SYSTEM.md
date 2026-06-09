# Enterprise SaaS Design System

## Overview

This document defines the global UI/UX standards for the application. All modules, pages, forms, dashboards, tables, reports, workflows, and future features must follow these design guidelines to ensure consistency, scalability, accessibility, and a premium enterprise experience.

---

# Design Principles

### 1. Consistency First

All screens must use the same spacing, typography, colors, shadows, border radius, and interaction patterns.

### 2. Clean Enterprise Experience

Interfaces should feel modern, professional, and uncluttered. Prioritize readability and hierarchy.

### 3. Information Hierarchy

Users should immediately understand:

* What page they are on
* What actions are available
* What information is most important

### 4. Responsive by Default

Every component must work seamlessly across:

* Desktop (1920px+)
* Laptop (1440px–1366px)
* Tablet (1024px–768px)
* Mobile (<768px)

### 5. Accessibility

All interactive elements must support:

* Keyboard navigation
* Focus states
* Sufficient color contrast
* Screen reader compatibility

---

# Technology Standards

* Angular Standalone Components
* Angular Signals for state management
* Tailwind CSS utilities
* SCSS design tokens
* No external UI component libraries

---

# Color System

| Token          | Hex     |
| -------------- | ------- |
| Background     | #F3F6FB |
| Surface        | #FFFFFF |
| Border         | #E5EAF3 |
| Text Primary   | #0F172A |
| Text Secondary | #64748B |
| Primary        | #3B82F6 |
| Primary Hover  | #2563EB |
| Success        | #22C55E |
| Success Light  | #DCFCE7 |
| Warning        | #F59E0B |
| Warning Light  | #FEF3C7 |
| Danger         | #EF4444 |
| Danger Light   | #FEE2E2 |
| Purple         | #8B5CF6 |
| Purple Light   | #F3E8FF |
| Info           | #06B6D4 |
| Info Light     | #CFFAFE |

---

# Typography

Font Family:

```scss
font-family: 'Inter', sans-serif;
```

| Element       | Size | Weight |
| ------------- | ---- | ------ |
| Page Title    | 36px | 700    |
| Section Title | 28px | 700    |
| Card Title    | 18px | 600    |
| Table Header  | 15px | 600    |
| Label         | 14px | 500    |
| Body Text     | 14px | 400    |
| Caption       | 12px | 400    |

---

# Spacing Scale

```scss
4px
8px
12px
16px
20px
24px
32px
40px
48px
```

Use consistent spacing throughout the application.

---

# Border Radius System

| Element          | Radius |
| ---------------- | ------ |
| Inputs           | 14px   |
| Buttons          | 16px   |
| Navigation Items | 18px   |
| Icon Containers  | 20px   |
| Cards            | 24px   |
| Large Panels     | 28px   |
| Modals           | 28px   |

---

# Shadow System

## Card

```scss
box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
```

## Card Hover

```scss
box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
```

## Floating Elements

```scss
box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
```

---

# Global Layout

## Page Container

```scss
max-width: 1600px;
margin: 0 auto;
padding: 32px;
```

## Content Area

```scss
display: flex;
flex-direction: column;
gap: 24px;
```

---

# Breadcrumbs

* Display at top of every page.
* Show current navigation hierarchy.
* Use muted secondary text.
* Active page uses primary text color.

---

# Page Header

## Structure

Left Side:

* Icon Container
* Page Title
* Description

Right Side:

* Primary Action Button

## Styling

```scss
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
```

### Icon Container

```scss
width: 72px;
height: 72px;
border-radius: 20px;
display: flex;
align-items: center;
justify-content: center;
```

### Title

```scss
font-size: 36px;
font-weight: 700;
color: #0F172A;
```

### Description

```scss
font-size: 16px;
color: #64748B;
```

---

# Cards

```scss
.card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  transition: all 200ms ease;
}
```

### Hover

```scss
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
}
```

---

# Statistic Cards

## Layout

Desktop:

* 4 Columns

Tablet:

* 2 Columns

Mobile:

* 1 Column

## Structure

Left:

* Colored Icon Container

Right:

* Value
* Label

### Value

```scss
font-size: 28px;
font-weight: 700;
```

### Label

```scss
font-size: 14px;
color: #64748B;
```

---

# Buttons

## Primary Button

```scss
height: 52px;
padding: 0 28px;

background: linear-gradient(
  135deg,
  #3B82F6 0%,
  #2563EB 100%
);

border-radius: 16px;
color: white;
font-weight: 600;
```

### Hover

```scss
transform: translateY(-2px);
```

---

## Secondary Button

```scss
background: white;
border: 2px solid #E5EAF3;
color: #0F172A;
```

---

## Icon Action Buttons

Size:

```scss
44px × 44px
```

Radius:

```scss
14px
```

### Variants

View:

* Background: #F3E8FF
* Icon: #8B5CF6

Edit:

* Background: #EFF6FF
* Icon: #3B82F6

Delete:

* Background: #FEE2E2
* Icon: #EF4444

Hover:

```scss
transform: scale(1.05);
```

---

# Forms

## Input

```scss
height: 52px;
border: 2px solid #CBD5E1;     // Use #CBD5E1 for clearly visible borders
border-radius: 14px;
padding: 0 20px;
font-size: 14px;
background: white;
```

### Hover

```scss
border-color: #94A3B8;
```

### Focus

```scss
border-color: #3B82F6;
box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
```

### Error

```scss
border-color: #EF4444;
```

---

## Textarea

```scss
min-height: 120px;
padding: 16px 20px;
border-radius: 14px;
resize: vertical;
```

---

## Select Dropdown

```scss
height: 52px;
border-radius: 14px;
background: white;
```

---

## Labels

```scss
font-size: 14px;
font-weight: 500;
color: #0F172A;
```

---

## Error Message

```scss
font-size: 12px;
color: #EF4444;
margin-top: 6px;
```

---

# Info Banner

A contextual banner used at the top of forms to explain the purpose or provide guidance.

## Container

```scss
display: flex;
align-items: flex-start;
gap: 16px;
padding: 20px 24px;
background: var(--primary-light);   // #EFF6FF
border: 1px solid #BFDBFE;
border-radius: var(--radius-lg);    // 24px
```

## Icon Container

* 44px × 44px
* Border-radius: 14px
* Background: #DBEAFE
* Color: var(--primary)

## Content

* Strong label: 15px / 600 / text-primary
* Body: 14px / 400 / text-secondary
* Inline links: text-primary color, hover underline

---

# Workflow Banner

A horizontal status strip shown above forms to communicate ticket/request state, SLA, and assignment.

## Container

```scss
display: flex;
align-items: center;
padding: 20px 28px;
background: var(--bg-card);
border-radius: var(--radius-lg);     // 24px
box-shadow: var(--shadow-card);
```

## Item

* Flex: 1
* Padding: 0 20px

## Label

* Font-size: 11px
* Font-weight: 600
* Text-transform: uppercase
* Letter-spacing: 0.6px
* Color: text-secondary

## Divider

* Width: 1px
* Height: 40px
* Background: var(--border-color)

## Value

* Font-size: 14px
* Font-weight: 600
* Color: text-primary

---

# Form Card

A standardized card container used to wrap form content with a title bar at the top.

## Container

```scss
background: var(--bg-card);
border-radius: var(--radius-lg);     // 24px
box-shadow: var(--shadow-card);
overflow: hidden;
```

## Title Bar

* Padding: 28px 32px 20px
* Border-bottom: 1px solid var(--border-color)
* Title: 18px / 600 / text-primary
* Subtitle: 14px / 400 / text-secondary

## Body

* Padding: 28px 32px
* Display: grid (2 columns by default, 20px gap)

## Footer

* Padding: 20px 32px
* Border-top: 1px solid var(--border-color)
* Background: var(--bg-page)
* Border-radius: 0 0 var(--radius-lg) var(--radius-lg)

---

# File Upload

A dropzone area for uploading attachments.

## Dropzone

* Padding: 32px 24px
* Border: 2px dashed var(--border-color)
* Border-radius: var(--radius-lg)
* Background: var(--bg-card)
* Hover: border-color primary, background primary-light

## Upload Icon Container

* 48px × 48px
* Border-radius: 14px
* Background: var(--bg-page)
* Hover: background #DBEAFE, color primary

## Text

* Primary: 14px / 500 / text-primary
* Hint: 12px / 400 / text-secondary

## Attachment List

Each attachment item:
* Padding: 12px 16px
* Background: var(--bg-page)
* Border: 1px solid var(--border-color)
* Border-radius: 14px
* Icon container: 32px × 32px, primary-light background
* Remove button: 28px × 28px, hover danger-light

---

# Contact / Radio Options

A row of selectable cards for radio-style choices.

## Container

* Display: flex
* Gap: 12px

## Option

* Padding: 14px 20px
* Border: 2px solid var(--border-color)
* Border-radius: 14px
* Font-size: 14px / 500
* Color: text-secondary

### Hover

* Border-color: #CBD5E1
* Color: text-primary

### Selected

* Border-color: primary
* Background: primary-light
* Color: primary

---

# SLA / Helper Info

Small inline informational text shown at the bottom of forms.

## Container

* Display: flex
* Align-items: center
* Gap: 8px
* Font-size: 12px
* Color: text-secondary

## Strong text

* Font-weight: 600
* Color: text-primary

---

# Priority Selector

A grid of selectable cards for priority levels.

## Grid

* Display: grid
* 4 columns on desktop, 2 on tablet, 1 on mobile
* Gap: 12px

## Option Card

* Padding: 16px
* Border: 2px solid var(--border-color)
* Border-radius: 14px
* Hover: translateY(-2px), border-color #CBD5E1

## Color Coding

| Level     | Color     | Light BG     |
| --------- | --------- | ------------ |
| Critical  | danger    | danger-light |
| High      | warning   | warning-light|
| Medium    | primary   | primary-light|
| Low       | success   | success-light|

## Dot Indicator

* 10px circle
* Border: 2px (3px when selected)
* Color matches the priority level
* Background fills when selected

---

# Tables

## Container

```scss
background: white;
border-radius: 28px;
overflow: hidden;
```

## Header

```scss
font-size: 15px;
font-weight: 600;
```

## Rows

```scss
height: 88px;
```

### Hover

```scss
background: #F8FAFC;
```

---

# Status Badges

## Available

```scss
background: #DCFCE7;
color: #22C55E;
```

## Assigned

```scss
background: #CFFAFE;
color: #06B6D4;
```

## Pending

```scss
background: #FEF3C7;
color: #F59E0B;
```

## Completed

```scss
background: #DCFCE7;
color: #22C55E;
```

## Rejected

```scss
background: #FEE2E2;
color: #EF4444;
```

## Inactive

```scss
background: #F1F5F9;
color: #64748B;
```

### Badge Style

```scss
padding: 6px 14px;
border-radius: 999px;
font-size: 12px;
font-weight: 600;
```

---

# Search & Filter Toolbar

```scss
display: flex;
gap: 16px;
padding: 20px 24px;
```

## Search Box

```scss
height: 48px;
border-radius: 16px;
```

## Filter Dropdown

```scss
height: 48px;
border-radius: 14px;
```

---

# Modals

## Overlay

```scss
background: rgba(15,23,42,0.6);
backdrop-filter: blur(4px);
```

## Content

```scss
background: white;
border-radius: 28px;
max-width: 600px;
width: 90%;
```

### Animation

```scss
@keyframes modalEntry {
  from {
    opacity: 0;
    transform: scale(.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

# Empty States

## Structure

* Icon
* Title
* Description
* Primary Action

### Icon Container

```scss
width: 80px;
height: 80px;
border-radius: 24px;
background: #F3F6FB;
```

---

# Animations

Global transition:

```scss
transition: all 200ms ease;
```

## Card Hover

```scss
translateY(-4px)
```

## Button Hover

```scss
translateY(-2px)
```

## Action Buttons

```scss
scale(1.05)
```

## Modal

```scss
fade + scale
```

---

# Responsive Breakpoints

| Width   | Behavior                  |
| ------- | ------------------------- |
| 1920px+ | Full desktop layout       |
| 1440px  | Laptop optimized          |
| 1366px  | No horizontal scrolling   |
| 1024px  | Navigation collapses      |
| 768px   | Single-column layouts     |
| 480px   | Mobile-first card layouts |

---

# Global Design Rules

1. Never use hardcoded colors outside design tokens.
2. Every interactive element must have hover and focus states.
3. Avoid excessive borders; prefer spacing and shadows.
4. Use cards as the primary content container.
5. Maintain consistent spacing using the spacing scale.
6. All forms must include validation states.
7. All tables must support responsive layouts.
8. Every page should contain breadcrumbs and a page header.
9. Keep visual hierarchy clear through typography and spacing.
10. Maintain a premium enterprise SaaS appearance across the entire application.

---

# Root Design Tokens

```scss
:root {
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

  --radius-sm: 14px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 28px;

  --shadow-card:
    0 8px 30px rgba(15, 23, 42, 0.06);

  --shadow-card-hover:
    0 15px 40px rgba(15, 23, 42, 0.12);

  --shadow-dropdown:
    0 20px 50px rgba(15, 23, 42, 0.15);

  --transition: 200ms ease;
}
```
