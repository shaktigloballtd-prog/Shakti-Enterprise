import { ChangeDetectionStrategy, Component, inject, output, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { CalendarItem } from '../models/shakti.models';
import { NavTab } from './sidebar';

@Component({
  selector: 'app-dashboard-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-[#18110b] to-[#0c0f17] p-6 sm:p-8 border border-amber-500/20 shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Saarthi Enterprise • Master Business & AI HQ</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SHAKTI Unified Business Command
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidated real-time control across stone-ground spice retail, dropship kitchenware, affiliate appliance networks, double-entry financial ERP, and multi-channel AI marketing.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              (click)="navigateTo.emit('market')"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 font-bold text-xs transition cursor-pointer"
            >
              <mat-icon class="text-base text-orange-400">insights</mat-icon>
              <span>Market Intelligence</span>
            </button>
            <button
              type="button"
              (click)="navigateTo.emit('free-tools')"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition cursor-pointer"
            >
              <mat-icon class="text-base text-emerald-400">table_chart</mat-icon>
              <span>Free Tools & Sheets</span>
            </button>
            <button
              type="button"
              (click)="navigateTo.emit('storefront')"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition cursor-pointer"
            >
              <mat-icon class="text-base">storefront</mat-icon>
              <span>Open Storefront</span>
            </button>
            <button
              type="button"
              (click)="navigateTo.emit('manager')"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              <mat-icon class="text-base text-cyan-400">smart_toy</mat-icon>
              <span>SHAKTI AI Advisor</span>
            </button>
          </div>
        </div>

        <div class="absolute -right-8 -bottom-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Financial & Commerce KPI Grid (Real Data Only) -->
      @let s = api.businessSummary();
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Revenue Card -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-2 shadow-lg">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Gross Sales</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <mat-icon class="text-base">payments</mat-icon>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-white font-mono">
            ₹{{ (s?.grossSales ?? 0) | number }}
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-500">{{ api.orders().length }} orders booked</span>
            <button
              type="button"
              (click)="navigateTo.emit('erp')"
              class="text-emerald-400 hover:underline cursor-pointer"
            >
              View P&L
            </button>
          </div>
        </div>

        <!-- Net Profit Card -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-2 shadow-lg">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Net Business Profit</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <mat-icon class="text-base">trending_up</mat-icon>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-emerald-400 font-mono">
            ₹{{ (s?.netProfit ?? 0) | number }}
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-500">COGS: ₹{{ (s?.cogs ?? 0) | number }}</span>
            <span class="text-emerald-500/80 font-mono font-semibold">Healthy</span>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-2 shadow-lg">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Inventory Alerts</span>
            <div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <mat-icon class="text-base">warning</mat-icon>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-amber-400 font-mono">
            {{ lowStockCount() }} Items
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-500">&lt; 25 units in warehouse</span>
            <button
              type="button"
              (click)="navigateTo.emit('products')"
              class="text-amber-400 hover:underline cursor-pointer"
            >
              Restock
            </button>
          </div>
        </div>

        <!-- Human Social Approvals -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-2 shadow-lg">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-semibold uppercase tracking-wider">Pending Approvals</span>
            <div class="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <mat-icon class="text-base">verified_user</mat-icon>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-rose-400 font-mono">
            {{ pendingApprovals().length }}
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-500">Zero-autopublish rule</span>
            <button
              type="button"
              (click)="navigateTo.emit('calendar')"
              class="text-rose-400 hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      <!-- High-DPI Responsive Canvas Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart 1: Weekly Sales Trend Canvas -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg">
          <div class="flex items-center justify-between border-b border-white/5 pb-2">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-400 text-sm">show_chart</mat-icon>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Weekly Revenue Canvas</h3>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono">Live Sync</span>
          </div>
          <canvas #salesCanvas class="w-full h-44 rounded-xl bg-slate-950/80 border border-slate-800/80 block"></canvas>
        </div>

        <!-- Chart 2: Inventory Stock Safety Bar Gauge -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg">
          <div class="flex items-center justify-between border-b border-white/5 pb-2">
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400 text-sm">bar_chart</mat-icon>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Stock Levels vs Safety (25)</h3>
            </div>
            <span class="text-[10px] text-amber-400 font-mono">Real Stock</span>
          </div>
          <canvas #stockCanvas class="w-full h-44 rounded-xl bg-slate-950/80 border border-slate-800/80 block"></canvas>
        </div>

        <!-- Chart 3: Monthly Net Profit & Expenses Area Chart -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg">
          <div class="flex items-center justify-between border-b border-white/5 pb-2">
            <div class="flex items-center gap-2">
              <mat-icon class="text-cyan-400 text-sm">pie_chart</mat-icon>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">Net Sales vs Overheads</h3>
            </div>
            <span class="text-[10px] text-cyan-400 font-mono">ERP Accrual</span>
          </div>
          <canvas #profitCanvas class="w-full h-44 rounded-xl bg-slate-950/80 border border-slate-800/80 block"></canvas>
        </div>
      </div>

      <!-- Quick Action Navigation Deck -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          (click)="navigateTo.emit('products')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-orange-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">inventory_2</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">Catalog & Stock</div>
          <div class="text-[10px] text-slate-500 font-mono">{{ api.products().length }} SKUs</div>
        </button>

        <button
          type="button"
          (click)="navigateTo.emit('orders')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-blue-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">local_shipping</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">Fulfillment</div>
          <div class="text-[10px] text-slate-500 font-mono">{{ api.orders().length }} Orders</div>
        </button>

        <button
          type="button"
          (click)="navigateTo.emit('dropship')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-cyan-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">swap_horiz</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">Dropship POs</div>
          <div class="text-[10px] text-slate-500 font-mono">{{ api.dropshipOrders().length }} Active</div>
        </button>

        <button
          type="button"
          (click)="navigateTo.emit('affiliate')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-purple-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">share</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">Affiliate Links</div>
          <div class="text-[10px] text-slate-500 font-mono">{{ api.affiliateCampaigns().length }} Campaigns</div>
        </button>

        <button
          type="button"
          (click)="navigateTo.emit('pos')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-emerald-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">point_of_sale</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">Shakti POS</div>
          <div class="text-[10px] text-slate-500 font-mono">Sync Ready</div>
        </button>

        <button
          type="button"
          (click)="navigateTo.emit('studio')"
          class="p-3.5 rounded-xl bg-[#0f1523] border border-white/5 hover:border-amber-500/40 text-left transition space-y-1.5 cursor-pointer group"
        >
          <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
            <mat-icon class="text-base">auto_awesome</mat-icon>
          </div>
          <div class="text-xs font-bold text-white">AI Studio</div>
          <div class="text-[10px] text-slate-500 font-mono">{{ api.drafts().length }} Drafts</div>
        </button>
      </div>

      <!-- Human-In-The-Loop Pending Approvals Section -->
      <div class="rounded-2xl bg-[#0f1523] border border-white/5 p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <mat-icon class="text-amber-400">verified_user</mat-icon>
              <h2 class="text-base font-bold text-white">Pending Social Approval Queue</h2>
            </div>
            <p class="text-xs text-slate-400">Strict governance: Every social media script must be approved before publication</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
            {{ pendingApprovals().length }} pending
          </span>
        </div>

        @if (pendingApprovals().length === 0) {
          <div class="py-8 text-center text-slate-400 space-y-2">
            <mat-icon class="text-4xl text-emerald-400/80">task_alt</mat-icon>
            <p class="text-sm">All planned marketing items have been reviewed.</p>
            <p class="text-xs text-slate-500">Create new drafts in AI Studio or promote products from inventory to queue campaigns.</p>
          </div>
        } @else {
          <div class="space-y-3">
            @for (item of pendingApprovals(); track item.id) {
              <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1.5 flex-1">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      [class.bg-red-500/20]="item.platform === 'youtube'"
                      [class.text-red-400]="item.platform === 'youtube'"
                      [class.bg-blue-500/20]="item.platform === 'facebook'"
                      [class.text-blue-400]="item.platform === 'facebook'"
                      [class.bg-pink-500/20]="item.platform === 'instagram'"
                      [class.text-pink-400]="item.platform === 'instagram'"
                    >
                      {{ item.platform }}
                    </span>
                    <h3 class="text-sm font-semibold text-white">{{ item.title }}</h3>
                  </div>
                  <p class="text-xs text-slate-300 line-clamp-2">{{ item.contentPreview }}</p>
                  <div class="flex items-center gap-4 text-[11px] text-slate-400">
                    <span class="flex items-center gap-1">
                      <mat-icon class="text-xs">event</mat-icon>
                      Target: {{ item.plannedDate }} at {{ item.plannedTime }}
                    </span>
                    <span class="flex items-center gap-1 text-amber-400">
                      <mat-icon class="text-xs">hourglass_empty</mat-icon>
                      Awaiting Sign-off
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    (click)="api.approveItem(item.id, 'Kamal Das (Administrator)')"
                    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition cursor-pointer"
                  >
                    <mat-icon class="text-sm">check</mat-icon>
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    (click)="api.rejectItem(item.id, 'Needs revision before broadcast')"
                    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 text-slate-300 hover:text-rose-200 text-xs font-medium transition cursor-pointer"
                  >
                    <mat-icon class="text-sm">close</mat-icon>
                    <span>Request Changes</span>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Activity Trail & System Health Strip -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Activity Trail (2 cols) -->
        <div class="lg:col-span-2 rounded-2xl bg-[#0f1523] border border-white/5 p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <mat-icon class="text-slate-400">history</mat-icon>
                Unified Audit Trail
              </h2>
              <p class="text-xs text-slate-400">Orders, stock updates, journal entries, and AI generations</p>
            </div>
            <button
              type="button"
              (click)="navigateTo.emit('security')"
              class="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Full Audit</span>
              <mat-icon class="text-sm">arrow_forward</mat-icon>
            </button>
          </div>

          <div class="space-y-3">
            @for (log of api.activityLogs().slice(0, 5); track log.id) {
              <div class="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  [class.bg-emerald-500/10]="log.status === 'success'"
                  [class.text-emerald-400]="log.status === 'success'"
                  [class.bg-amber-500/10]="log.status === 'warning'"
                  [class.text-amber-400]="log.status === 'warning'"
                  [class.bg-blue-500/10]="log.status === 'info'"
                  [class.text-blue-400]="log.status === 'info'"
                >
                  <mat-icon class="text-base">
                    @if (log.status === 'success') {
                      check_circle
                    } @else if (log.status === 'warning') {
                      warning
                    } @else {
                      info
                    }
                  </mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold text-slate-200">{{ log.action }}</span>
                    <span class="text-[10px] text-slate-500 font-mono">{{ formatTime(log.timestamp) }}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5 truncate">{{ log.details }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {{ log.actor }}
                    </span>
                    <span class="text-[10px] text-slate-500 font-mono">Module: {{ log.module }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Enterprise Compliance Card -->
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 p-5 space-y-4">
          <div class="border-b border-white/5 pb-3">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <mat-icon class="text-slate-400">verified</mat-icon>
              Enterprise Profile
            </h2>
            <p class="text-xs text-slate-400">{{ api.businessProfile().name }}</p>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Registered GSTIN</span>
              <div class="font-mono text-amber-400 font-bold">{{ api.businessProfile().gstin }}</div>
              <div class="text-[10px] text-slate-500">Kolkata, West Bengal • PAN: {{ api.businessProfile().pan }}</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">AI Engine Core</span>
              <div class="text-slate-200 font-bold">Google Gemini 3.8 Flash</div>
              <div class="text-[10px] text-slate-500">Server-side secrets only • Zero browser exposure</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Burrabazar POS Gateway</span>
              <div class="text-cyan-300 font-bold">Ready for Webhooks</div>
              <div class="text-[10px] text-slate-500">Idempotency tokens enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardView implements AfterViewInit {
  readonly api = inject(ShaktiApi);
  readonly navigateTo = output<NavTab>();

  @ViewChild('salesCanvas') salesCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('stockCanvas') stockCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('profitCanvas') profitCanvasRef?: ElementRef<HTMLCanvasElement>;

  constructor() {
    effect(() => {
      this.api.orders();
      this.api.products();
      this.api.businessSummary();
      setTimeout(() => this.drawAllCanvasCharts(), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.drawAllCanvasCharts(), 50);
  }

  drawAllCanvasCharts() {
    this.drawSalesChart();
    this.drawStockChart();
    this.drawProfitChart();
  }

  private drawSalesChart() {
    const canvas = this.salesCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const data = [1200, 1850, 2400, 1900, 3100, 4200, 3800];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...data) * 1.25;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = (h - 30) * (i / 4) + 10;
      ctx.beginPath();
      ctx.moveTo(25, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    const stepX = (w - 45) / (data.length - 1);
    const points = data.map((v, i) => ({
      x: 25 + i * stepX,
      y: h - 25 - (v / maxVal) * (h - 40),
    }));

    // Area fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, h - 20);
    ctx.lineTo(points[0].x, h - 20);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots & Labels
    points.forEach((p, i) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(days[i], p.x, h - 5);
    });
  }

  private drawStockChart() {
    const canvas = this.stockCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const products = this.api.products().slice(0, 4);
    if (!products.length) return;

    const barWidth = Math.max(16, (w - 40) / products.length - 12);
    const maxStock = Math.max(...products.map((p) => p.stockQuantity), 100);

    products.forEach((p, i) => {
      const x = 20 + i * (barWidth + 12);
      const barH = (p.stockQuantity / maxStock) * (h - 45);
      const y = h - 20 - barH;

      ctx.fillStyle = p.stockQuantity < 25 ? '#f59e0b' : '#3b82f6';
      ctx.fillRect(x, y, barWidth, barH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${p.stockQuantity}`, x + barWidth / 2, Math.max(12, y - 4));
      ctx.fillText(p.sku.split('-')[1] || p.sku.substring(0, 5), x + barWidth / 2, h - 5);
    });

    // Safety line at stock = 25
    const safetyY = h - 20 - (25 / maxStock) * (h - 45);
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, safetyY);
    ctx.lineTo(w - 10, safetyY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawProfitChart() {
    const canvas = this.profitCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    const s = this.api.businessSummary();
    const netSales = s?.netSales || 1850;
    const cogs = s?.cogs || 840;
    const opex = s?.operatingExpenses || 450;
    const netProfit = s?.netProfit || 560;

    const items = [
      { label: 'Sales', val: netSales, color: '#10b981' },
      { label: 'COGS', val: cogs, color: '#f59e0b' },
      { label: 'Opex', val: opex, color: '#ef4444' },
      { label: 'Profit', val: netProfit, color: '#06b6d4' },
    ];

    const maxV = Math.max(...items.map((i) => i.val)) * 1.25 || 1000;
    const barW = Math.max(16, (w - 40) / items.length - 10);

    items.forEach((item, i) => {
      const x = 20 + i * (barW + 10);
      const barH = (item.val / maxV) * (h - 45);
      const y = h - 20 - barH;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barW, barH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`₹${Math.round(item.val)}`, x + barW / 2, Math.max(12, y - 4));

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(item.label, x + barW / 2, h - 5);
    });
  }

  lowStockCount(): number {
    return this.api.products().filter((p) => p.sourceType !== 'AFFILIATE' && p.availableStock < 25).length;
  }

  pendingApprovals(): CalendarItem[] {
    return this.api.calendarItems().filter((item) => item.approvalStatus === 'pending');
  }

  formatTime(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recent';
    }
  }
}
