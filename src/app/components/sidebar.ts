import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

export type NavTab =
  | 'dashboard'
  | 'storefront'
  | 'products'
  | 'orders'
  | 'dropship'
  | 'affiliate'
  | 'erp'
  | 'pos'
  | 'free-tools'
  | 'market'
  | 'studio'
  | 'calendar'
  | 'agents'
  | 'analytics'
  | 'manager'
  | 'security';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <aside class="flex flex-col h-full bg-[#0a0e17] border-r border-white/5 p-3 select-none">
      <!-- Section: Navigation List -->
      <div class="space-y-1 flex-1 overflow-y-auto pr-1">
        <!-- Business & Commerce Section -->
        <div class="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Commerce & ERP
        </div>

        <button
          type="button"
          (click)="selectTab('dashboard')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'dashboard'"
          [class.from-orange-500/20]="activeTab() === 'dashboard'"
          [class.to-amber-500/10]="activeTab() === 'dashboard'"
          [class.text-orange-400]="activeTab() === 'dashboard'"
          [class.border]="activeTab() === 'dashboard'"
          [class.border-orange-500/30]="activeTab() === 'dashboard'"
          [class.text-slate-400]="activeTab() !== 'dashboard'"
          [class.hover:text-slate-200]="activeTab() !== 'dashboard'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'dashboard'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">dashboard</mat-icon>
            <span>Master Dashboard</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectTab('storefront')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'storefront'"
          [class.from-orange-500/20]="activeTab() === 'storefront'"
          [class.to-amber-500/10]="activeTab() === 'storefront'"
          [class.text-orange-400]="activeTab() === 'storefront'"
          [class.border]="activeTab() === 'storefront'"
          [class.border-orange-500/30]="activeTab() === 'storefront'"
          [class.text-slate-400]="activeTab() !== 'storefront'"
          [class.hover:text-slate-200]="activeTab() !== 'storefront'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'storefront'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">storefront</mat-icon>
            <span>Storefront (Customer)</span>
          </div>
          @if (api.cart().length > 0) {
            <span class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              {{ api.cart().length }} in cart
            </span>
          }
        </button>

        <button
          type="button"
          (click)="selectTab('products')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'products'"
          [class.from-orange-500/20]="activeTab() === 'products'"
          [class.to-amber-500/10]="activeTab() === 'products'"
          [class.text-orange-400]="activeTab() === 'products'"
          [class.border]="activeTab() === 'products'"
          [class.border-orange-500/30]="activeTab() === 'products'"
          [class.text-slate-400]="activeTab() !== 'products'"
          [class.hover:text-slate-200]="activeTab() !== 'products'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'products'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">inventory_2</mat-icon>
            <span>Products & Inventory</span>
          </div>
          <span class="text-[11px] text-slate-500 font-mono">{{ api.products().length }}</span>
        </button>

        <button
          type="button"
          (click)="selectTab('orders')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'orders'"
          [class.from-orange-500/20]="activeTab() === 'orders'"
          [class.to-amber-500/10]="activeTab() === 'orders'"
          [class.text-orange-400]="activeTab() === 'orders'"
          [class.border]="activeTab() === 'orders'"
          [class.border-orange-500/30]="activeTab() === 'orders'"
          [class.text-slate-400]="activeTab() !== 'orders'"
          [class.hover:text-slate-200]="activeTab() !== 'orders'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'orders'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">local_shipping</mat-icon>
            <span>Orders & Shipping</span>
          </div>
          <span class="text-[11px] text-slate-500 font-mono">{{ api.orders().length }}</span>
        </button>

        <button
          type="button"
          (click)="selectTab('dropship')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'dropship'"
          [class.from-orange-500/20]="activeTab() === 'dropship'"
          [class.to-amber-500/10]="activeTab() === 'dropship'"
          [class.text-orange-400]="activeTab() === 'dropship'"
          [class.border]="activeTab() === 'dropship'"
          [class.border-orange-500/30]="activeTab() === 'dropship'"
          [class.text-slate-400]="activeTab() !== 'dropship'"
          [class.hover:text-slate-200]="activeTab() !== 'dropship'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'dropship'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">swap_horiz</mat-icon>
            <span>Dropshipping Hub</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
            {{ api.dropshipOrders().length }}
          </span>
        </button>

        <button
          type="button"
          (click)="selectTab('affiliate')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'affiliate'"
          [class.from-orange-500/20]="activeTab() === 'affiliate'"
          [class.to-amber-500/10]="activeTab() === 'affiliate'"
          [class.text-orange-400]="activeTab() === 'affiliate'"
          [class.border]="activeTab() === 'affiliate'"
          [class.border-orange-500/30]="activeTab() === 'affiliate'"
          [class.text-slate-400]="activeTab() !== 'affiliate'"
          [class.hover:text-slate-200]="activeTab() !== 'affiliate'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'affiliate'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">share</mat-icon>
            <span>Affiliate Marketing</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectTab('erp')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'erp'"
          [class.from-orange-500/20]="activeTab() === 'erp'"
          [class.to-amber-500/10]="activeTab() === 'erp'"
          [class.text-orange-400]="activeTab() === 'erp'"
          [class.border]="activeTab() === 'erp'"
          [class.border-orange-500/30]="activeTab() === 'erp'"
          [class.text-slate-400]="activeTab() !== 'erp'"
          [class.hover:text-slate-200]="activeTab() !== 'erp'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'erp'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">account_balance</mat-icon>
            <span>Financial ERP & GST</span>
          </div>
          <span class="text-[10px] text-emerald-400 font-mono font-bold">₹</span>
        </button>

        <button
          type="button"
          (click)="selectTab('pos')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'pos'"
          [class.from-orange-500/20]="activeTab() === 'pos'"
          [class.to-amber-500/10]="activeTab() === 'pos'"
          [class.text-orange-400]="activeTab() === 'pos'"
          [class.border]="activeTab() === 'pos'"
          [class.border-orange-500/30]="activeTab() === 'pos'"
          [class.text-slate-400]="activeTab() !== 'pos'"
          [class.hover:text-slate-200]="activeTab() !== 'pos'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'pos'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">point_of_sale</mat-icon>
            <span>Shakti Masala POS</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Sync</span>
        </button>

        <button
          type="button"
          (click)="selectTab('free-tools')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'free-tools'"
          [class.from-orange-500/20]="activeTab() === 'free-tools'"
          [class.to-amber-500/10]="activeTab() === 'free-tools'"
          [class.text-orange-400]="activeTab() === 'free-tools'"
          [class.border]="activeTab() === 'free-tools'"
          [class.border-orange-500/30]="activeTab() === 'free-tools'"
          [class.text-slate-400]="activeTab() !== 'free-tools'"
          [class.hover:text-slate-200]="activeTab() !== 'free-tools'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'free-tools'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">table_chart</mat-icon>
            <span>Free-Tools & Sheets</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">₹0</span>
        </button>

        <button
          type="button"
          (click)="selectTab('market')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'market'"
          [class.from-orange-500/20]="activeTab() === 'market'"
          [class.to-amber-500/10]="activeTab() === 'market'"
          [class.text-orange-400]="activeTab() === 'market'"
          [class.border]="activeTab() === 'market'"
          [class.border-orange-500/30]="activeTab() === 'market'"
          [class.text-slate-400]="activeTab() !== 'market'"
          [class.hover:text-slate-200]="activeTab() !== 'market'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'market'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">insights</mat-icon>
            <span>Market Intelligence</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono">
            {{ api.marketIntelligence()?.products?.length || 5 }}
          </span>
        </button>

        <!-- Social Media & Studio Section (Preserved) -->
        <div class="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Social Media Studio
        </div>

        <button
          type="button"
          (click)="selectTab('studio')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'studio'"
          [class.from-orange-500/20]="activeTab() === 'studio'"
          [class.to-amber-500/10]="activeTab() === 'studio'"
          [class.text-orange-400]="activeTab() === 'studio'"
          [class.border]="activeTab() === 'studio'"
          [class.border-orange-500/30]="activeTab() === 'studio'"
          [class.text-slate-400]="activeTab() !== 'studio'"
          [class.hover:text-slate-200]="activeTab() !== 'studio'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'studio'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">auto_awesome</mat-icon>
            <span>AI Content Studio</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">Gemini</span>
        </button>

        <button
          type="button"
          (click)="selectTab('calendar')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'calendar'"
          [class.from-orange-500/20]="activeTab() === 'calendar'"
          [class.to-amber-500/10]="activeTab() === 'calendar'"
          [class.text-orange-400]="activeTab() === 'calendar'"
          [class.border]="activeTab() === 'calendar'"
          [class.border-orange-500/30]="activeTab() === 'calendar'"
          [class.text-slate-400]="activeTab() !== 'calendar'"
          [class.hover:text-slate-200]="activeTab() !== 'calendar'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'calendar'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">calendar_month</mat-icon>
            <span>Publishing Queue</span>
          </div>
          @if (pendingCount() > 0) {
            <span class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {{ pendingCount() }}
            </span>
          }
        </button>

        <button
          type="button"
          (click)="selectTab('agents')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'agents'"
          [class.from-orange-500/20]="activeTab() === 'agents'"
          [class.to-amber-500/10]="activeTab() === 'agents'"
          [class.text-orange-400]="activeTab() === 'agents'"
          [class.border]="activeTab() === 'agents'"
          [class.border-orange-500/30]="activeTab() === 'agents'"
          [class.text-slate-400]="activeTab() !== 'agents'"
          [class.hover:text-slate-200]="activeTab() !== 'agents'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'agents'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">hub</mat-icon>
            <span>YouTube & Meta Gateways</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectTab('analytics')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'analytics'"
          [class.from-orange-500/20]="activeTab() === 'analytics'"
          [class.to-amber-500/10]="activeTab() === 'analytics'"
          [class.text-orange-400]="activeTab() === 'analytics'"
          [class.border]="activeTab() === 'analytics'"
          [class.border-orange-500/30]="activeTab() === 'analytics'"
          [class.text-slate-400]="activeTab() !== 'analytics'"
          [class.hover:text-slate-200]="activeTab() !== 'analytics'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'analytics'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">insights</mat-icon>
            <span>Audience & Reach Analytics</span>
          </div>
        </button>

        <button
          type="button"
          (click)="selectTab('manager')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'manager'"
          [class.from-orange-500/20]="activeTab() === 'manager'"
          [class.to-amber-500/10]="activeTab() === 'manager'"
          [class.text-orange-400]="activeTab() === 'manager'"
          [class.border]="activeTab() === 'manager'"
          [class.border-orange-500/30]="activeTab() === 'manager'"
          [class.text-slate-400]="activeTab() !== 'manager'"
          [class.hover:text-slate-200]="activeTab() !== 'manager'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'manager'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">smart_toy</mat-icon>
            <span>SHAKTI AI Advisor</span>
          </div>
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
        </button>

        <button
          type="button"
          (click)="selectTab('security')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-gradient-to-r]="activeTab() === 'security'"
          [class.from-orange-500/20]="activeTab() === 'security'"
          [class.to-amber-500/10]="activeTab() === 'security'"
          [class.text-orange-400]="activeTab() === 'security'"
          [class.border]="activeTab() === 'security'"
          [class.border-orange-500/30]="activeTab() === 'security'"
          [class.text-slate-400]="activeTab() !== 'security'"
          [class.hover:text-slate-200]="activeTab() !== 'security'"
          [class.hover:bg-slate-800/40]="activeTab() !== 'security'"
        >
          <div class="flex items-center gap-2.5">
            <mat-icon class="text-base">security</mat-icon>
            <span>Security & Audit</span>
          </div>
          <mat-icon class="text-xs text-emerald-400">lock</mat-icon>
        </button>
      </div>

      <!-- Business Footer -->
      <div class="mt-3 pt-3 border-t border-white/5 space-y-1">
        <div class="flex items-center justify-between text-[11px]">
          <span class="font-bold text-white">{{ api.businessProfile().name }}</span>
          <span class="text-[10px] text-emerald-400 font-mono font-medium">GST Registered</span>
        </div>
        <div class="text-[10px] text-slate-500 truncate">
          {{ api.businessProfile().city }} • FY {{ api.businessProfile().financialYear }}
        </div>
      </div>
    </aside>
  `,
})
export class Sidebar {
  readonly api = inject(ShaktiApi);
  readonly activeTab = input<NavTab>('dashboard');
  readonly tabChange = output<NavTab>();

  selectTab(tab: NavTab) {
    this.tabChange.emit(tab);
  }

  isModulePermitted(mod: NavTab): boolean {
    const user = this.api.currentUser();
    if (!user || user.role === 'admin') return true;
    return user.assignedModules?.includes(mod) ?? true;
  }

  pendingCount(): number {
    return this.api.calendarItems().filter((c) => c.approvalStatus === 'pending').length;
  }
}
