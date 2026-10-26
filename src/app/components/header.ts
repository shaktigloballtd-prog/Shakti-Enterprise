import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <header class="sticky top-0 z-30 border-b border-white/5 bg-[#0e1422]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Mobile Sidebar Toggle -->
        <button
          type="button"
          (click)="toggleMenu.emit()"
          class="lg:hidden p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          aria-label="Toggle navigation menu"
        >
          <mat-icon>menu</mat-icon>
        </button>

        <!-- Brand Identity -->
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-lg tracking-wider">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-lg text-white tracking-wide">SHAKTI</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold uppercase tracking-wider">v1.0 AI</span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">Cross-Platform Enterprise Social Engine</p>
          </div>
        </div>
      </div>

      <!-- Right Header Actions & Indicators -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- AI Model Status Pill -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-400">Model:</span>
          <span class="text-slate-200 font-medium">Gemini 3.8 Flash</span>
        </div>

        <!-- Pending Approvals Alert Badge -->
        @if (pendingApprovalsCount() > 0) {
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <mat-icon class="text-sm">verified_user</mat-icon>
            <span>{{ pendingApprovalsCount() }} Pending Review</span>
          </div>
        }

        <!-- Switch to Customer Storefront View -->
        <button
          type="button"
          (click)="switchToStorefront.emit()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
          title="View Public Customer Storefront"
        >
          <mat-icon class="text-sm">storefront</mat-icon>
          <span class="hidden sm:inline">Storefront View</span>
        </button>

        <!-- Quick Refresh Button -->
        <button
          type="button"
          (click)="api.refreshAll()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          title="Refresh real-time data"
        >
          <mat-icon class="text-sm">sync</mat-icon>
          <span class="hidden sm:inline">Sync</span>
        </button>

        <!-- User Profile Pill & Logout -->
        @let user = api.currentUser();
        <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400">
            {{ userInitials() }}
          </div>
          <div class="hidden sm:block text-left">
            <div class="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{{ user?.name || 'Kamal Das' }}</span>
              @if (user?.isEmailVerified) {
                <span class="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Verified</span>
              } @else {
                <span class="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Pending</span>
              }
            </div>
            <div class="text-[10px] text-slate-400 capitalize">{{ user?.role || 'Administrator' }}</div>
          </div>

          <button
            type="button"
            (click)="api.logout()"
            class="ml-1 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Sign out of SHAKTI session"
          >
            <mat-icon class="text-sm text-rose-400">logout</mat-icon>
            <span class="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class Header {
  readonly api = inject(ShaktiApi);
  readonly toggleMenu = output<void>();
  readonly switchToStorefront = output<void>();

  pendingApprovalsCount(): number {
    return this.api.calendarItems().filter((item) => item.approvalStatus === 'pending').length;
  }

  userInitials(): string {
    const name = this.api.currentUser()?.name || 'Kamal Das';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
