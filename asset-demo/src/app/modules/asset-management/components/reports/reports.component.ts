import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
  PageHeaderComponent
} from '../../../../shared/components';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ButtonComponent,
  StatCardComponent
} from '../../../../shared/components/ui-components';

interface KpiStat {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
  icon: string;
  tone: 'primary' | 'success' | 'warning' | 'purple';
  sparkColor: string;
  sparkLine: string;
  sparkArea: string;
}

interface StackedBar {
  label: string;
  laptops: number;
  monitors: number;
  phones: number;
  other: number;
  total: number;
}

interface HeatmapWeek {
  week: number;
  days: number[]; // 5 days (Mon-Fri)
}

@Component({
  selector: 'knodtec-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ButtonComponent,
    StatCardComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  // ─── Breadcrumb ─────────────────────────────────────────────
  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home',              route: '/dashboard' },
    { label: 'Asset Management',  route: '/assets' },
    { label: 'Reports' }
  ];

  // ─── Page Header Icon ────────────────────────────────────────
  readonly pageIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  `;

  readonly monthLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  readonly dayNames    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // ─── KPI Stats (with sparkline paths) ────────────────────────
  readonly kpiStats = signal<KpiStat[]>([
    {
      label: 'Total Assets', value: '247', trend: '+8.2%', trendDirection: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      tone: 'primary', sparkColor: '#3B82F6',
      sparkLine: 'M0,22 L10,18 L20,20 L30,14 L40,16 L50,10 L60,12 L70,8 L80,10 L90,5 L100,7',
      sparkArea: 'M0,22 L10,18 L20,20 L30,14 L40,16 L50,10 L60,12 L70,8 L80,10 L90,5 L100,7 L100,30 L0,30 Z'
    },
    {
      label: 'Utilization', value: '73.7%', trend: '+2.5%', trendDirection: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      tone: 'success', sparkColor: '#22C55E',
      sparkLine: 'M0,18 L10,20 L20,16 L30,18 L40,12 L50,14 L60,10 L70,12 L80,8 L90,10 L100,6',
      sparkArea: 'M0,18 L10,20 L20,16 L30,18 L40,12 L50,14 L60,10 L70,12 L80,8 L90,10 L100,6 L100,30 L0,30 Z'
    },
    {
      label: 'Open Tickets', value: '24', trend: '-12%', trendDirection: 'down',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      tone: 'warning', sparkColor: '#F59E0B',
      sparkLine: 'M0,8 L10,10 L20,8 L30,12 L40,10 L50,14 L60,12 L70,16 L80,14 L90,18 L100,20',
      sparkArea: 'M0,8 L10,10 L20,8 L30,12 L40,10 L50,14 L60,12 L70,16 L80,14 L90,18 L100,20 L100,30 L0,30 Z'
    },
    {
      label: 'Recovery Rate', value: '94%', trend: '+3.1%', trendDirection: 'up',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      tone: 'purple', sparkColor: '#8B5CF6',
      sparkLine: 'M0,16 L10,14 L20,16 L30,12 L40,14 L50,10 L60,8 L70,10 L80,7 L90,5 L100,3',
      sparkArea: 'M0,16 L10,14 L20,16 L30,12 L40,14 L50,10 L60,8 L70,10 L80,7 L90,5 L100,3 L100,30 L0,30 Z'
    }
  ]);

  // ─── Trend Chart (computed paths) ────────────────────────────
  // 12 months of data: [acquired, retired] per month
  private readonly acquiredMonthly = [12, 15, 18, 14, 22, 25, 20, 28, 24, 30, 26, 32];
  private readonly retiredMonthly  = [3,  5,  4,  8,  6,  7,  9,  5,  8, 10,  7,  9];

  readonly trendLineAcq = computed(() => this.buildLinePath(this.acquiredMonthly, 200, 40, 60));
  readonly trendAreaAcq = computed(() => this.buildAreaPath(this.acquiredMonthly, 200, 40, 60));
  readonly trendLineRet = computed(() => this.buildLinePath(this.retiredMonthly,  200, 40, 60));
  readonly trendAreaRet = computed(() => this.buildAreaPath(this.retiredMonthly,  200, 40, 60));

  readonly trendPointsAcq = computed(() => this.buildPoints(this.acquiredMonthly, 200, 40, 60));
  readonly trendPointsRet = computed(() => this.buildPoints(this.retiredMonthly,  200, 40, 60));

  // ─── Stacked Column Chart ────────────────────────────────────
  readonly stackedBars = signal<StackedBar[]>([
    { label: 'Eng',   laptops: 38, monitors: 22, phones: 18, other: 8,  total: 86 },
    { label: 'Design',laptops: 18, monitors: 14, phones: 8,  other: 5,  total: 45 },
    { label: 'Sales', laptops: 16, monitors: 8,  phones: 10, other: 4,  total: 38 },
    { label: 'Ops',   laptops: 12, monitors: 7,  phones: 5,  other: 6,  total: 30 },
    { label: 'HR',    laptops: 6,  monitors: 4,  phones: 3,  other: 4,  total: 17 },
    { label: 'Fin',   laptops: 6,  monitors: 3,  phones: 1,  other: 4,  total: 14 },
    { label: 'Mkt',   laptops: 8,  monitors: 4,  phones: 2,  other: 2,  total: 16 }
  ]);

  // ─── Heatmap (8 weeks × 5 days) ──────────────────────────────
  readonly heatmap = signal<HeatmapWeek[]>([
    { week: 1, days: [2, 5, 8, 12, 6] },
    { week: 2, days: [4, 7, 10, 14, 9] },
    { week: 3, days: [3, 6, 9, 11, 8] },
    { week: 4, days: [5, 9, 13, 16, 11] },
    { week: 5, days: [6, 11, 15, 18, 13] },
    { week: 6, days: [4, 8, 12, 15, 10] },
    { week: 7, days: [7, 13, 17, 20, 15] },
    { week: 8, days: [5, 10, 14, 18, 12] }
  ]);

  // ─── Utilization Data ────────────────────────────────────────
  readonly utilizationData = signal([
    { type: 'Laptops',     rate: 85, assigned: 73, available: 13, color: 'green' },
    { type: 'Monitors',    rate: 72, assigned: 37, available: 15, color: 'blue' },
    { type: 'Phones',      rate: 91, assigned: 41, available: 4,  color: 'green' },
    { type: 'Accessories', rate: 78, assigned: 30, available: 8,  color: 'blue' },
    { type: 'Printers',    rate: 60, assigned: 9,  available: 6,  color: 'amber' }
  ]);

  // ─── Top Holders ─────────────────────────────────────────────
  readonly topHolders = signal([
    { rank: 1, name: 'Priya Patel',  department: 'Engineering', count: 5 },
    { rank: 2, name: 'Amit Singh',   department: 'Marketing',   count: 4 },
    { rank: 3, name: 'Deepak Kumar', department: 'Finance',     count: 4 },
    { rank: 4, name: 'Sneha Gupta',  department: 'Design',      count: 3 },
    { rank: 5, name: 'Rahul Verma',  department: 'Operations',  count: 3 }
  ]);

  // ─── Helpers ────────────────────────────────────────────────
  getHeatColor(value: number): string {
    if (value <= 3)  return '#F1F5F9';
    if (value <= 6)  return '#DBEAFE';
    if (value <= 10) return '#93C5FD';
    if (value <= 14) return '#3B82F6';
    return '#1D4ED8';
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  }

  /**
   * Build a smooth (slightly rounded) SVG path from a numeric series.
   * chartHeight: total SVG height, topPad/bottomPad: padding for axis
   */
  private buildLinePath(values: number[], chartHeight: number, topPad: number, bottomPad: number): string {
    if (!values.length) return '';
    const max = Math.max(...values) * 1.1;
    const min = 0;
    const range = max - min;
    const usable = chartHeight - topPad - bottomPad;
    const xStep = (540 - 40) / (values.length - 1);

    const points = values.map((v, i) => ({
      x: 60 + i * xStep,
      y: topPad + usable - ((v - min) / range) * usable
    }));

    return points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  }

  private buildAreaPath(values: number[], chartHeight: number, topPad: number, bottomPad: number): string {
    if (!values.length) return '';
    const linePath = this.buildLinePath(values, chartHeight, topPad, bottomPad);
    const xStep = (540 - 40) / (values.length - 1);
    const lastX = 60 + (values.length - 1) * xStep;
    const baseY = chartHeight - bottomPad;
    return `${linePath} L${lastX},${baseY} L60,${baseY} Z`;
  }

  private buildPoints(values: number[], chartHeight: number, topPad: number, bottomPad: number) {
    if (!values.length) return [];
    const max = Math.max(...values) * 1.1;
    const min = 0;
    const range = max - min;
    const usable = chartHeight - topPad - bottomPad;
    const xStep = (540 - 40) / (values.length - 1);
    return values.map((v, i) => ({
      x: 60 + i * xStep,
      y: topPad + usable - ((v - min) / range) * usable
    }));
  }
}
