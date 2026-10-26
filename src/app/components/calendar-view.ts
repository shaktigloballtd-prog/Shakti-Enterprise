import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { CalendarItem } from '../models/shakti.models';

@Component({
  selector: 'app-calendar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Calendar Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <mat-icon class="text-lg">calendar_month</mat-icon>
            </span>
            <h1 class="text-2xl font-extrabold text-white">Publishing Calendar & Queue</h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Organize distribution schedules with mandatory human review gates before dispatch.
          </p>
        </div>

        <button
          type="button"
          (click)="showCreateModal.set(true)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <mat-icon class="text-sm">add</mat-icon>
          <span>Schedule New Content</span>
        </button>
      </div>

      <!-- Filters & Stats Bar -->
      <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Platform Filter -->
          <button
            type="button"
            (click)="filterPlatform.set('all')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer"
            [class.bg-slate-700]="filterPlatform() === 'all'"
            [class.text-white]="filterPlatform() === 'all'"
            [class.border-slate-600]="filterPlatform() === 'all'"
            [class.bg-slate-900]="filterPlatform() !== 'all'"
            [class.text-slate-400]="filterPlatform() !== 'all'"
            [class.border-slate-800]="filterPlatform() !== 'all'"
          >
            All Platforms
          </button>
          <button
            type="button"
            (click)="filterPlatform.set('youtube')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5"
            [class.bg-red-600]="filterPlatform() === 'youtube'"
            [class.text-white]="filterPlatform() === 'youtube'"
            [class.border-red-500]="filterPlatform() === 'youtube'"
            [class.bg-slate-900]="filterPlatform() !== 'youtube'"
            [class.text-slate-400]="filterPlatform() !== 'youtube'"
            [class.border-slate-800]="filterPlatform() !== 'youtube'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span>YouTube</span>
          </button>
          <button
            type="button"
            (click)="filterPlatform.set('facebook')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5"
            [class.bg-blue-600]="filterPlatform() === 'facebook'"
            [class.text-white]="filterPlatform() === 'facebook'"
            [class.border-blue-500]="filterPlatform() === 'facebook'"
            [class.bg-slate-900]="filterPlatform() !== 'facebook'"
            [class.text-slate-400]="filterPlatform() !== 'facebook'"
            [class.border-slate-800]="filterPlatform() !== 'facebook'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Facebook</span>
          </button>
          <button
            type="button"
            (click)="filterPlatform.set('instagram')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5"
            [class.bg-pink-600]="filterPlatform() === 'instagram'"
            [class.text-white]="filterPlatform() === 'instagram'"
            [class.border-pink-500]="filterPlatform() === 'instagram'"
            [class.bg-slate-900]="filterPlatform() !== 'instagram'"
            [class.text-slate-400]="filterPlatform() !== 'instagram'"
            [class.border-slate-800]="filterPlatform() !== 'instagram'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            <span>Instagram</span>
          </button>
        </div>

        <!-- Approval Status Filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">Approval State:</span>
          <select
            [value]="filterStatus()"
            (change)="onStatusFilterChange($event)"
            class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Human Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Strict Platform Safety Warning Banner -->
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <mat-icon class="text-orange-400 text-lg shrink-0 mt-0.5">policy</mat-icon>
        <div class="text-xs space-y-1 text-slate-300">
          <div class="font-semibold text-white">SHAKTI Non-Simulation Integrity Policy</div>
          <p class="text-slate-400">
            Calendar entries are scheduled internally within SHAKTI. No content will be falsely reported as "Published to YouTube or Meta" unless verified by official OAuth API confirmation tokens.
          </p>
        </div>
      </div>

      <!-- Calendar Schedule Queue List -->
      @if (filteredItems().length === 0) {
        <div class="py-20 text-center text-slate-400 space-y-3 rounded-2xl bg-[#0f1523] border border-white/5">
          <mat-icon class="text-5xl text-slate-600">event_busy</mat-icon>
          <p class="text-sm font-semibold text-slate-300">No scheduled content found for this filter.</p>
          <p class="text-xs text-slate-500">Plan your weekly video scripts and posts to organize your publishing pipeline.</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (item of filteredItems(); track item.id) {
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-4">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div class="space-y-1.5 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <!-- Platform Badge -->
                    <span
                      class="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
                      [class.bg-red-500/20]="item.platform === 'youtube'"
                      [class.text-red-400]="item.platform === 'youtube'"
                      [class.border]="item.platform === 'youtube'"
                      [class.border-red-500/30]="item.platform === 'youtube'"
                      [class.bg-blue-500/20]="item.platform === 'facebook'"
                      [class.text-blue-400]="item.platform === 'facebook'"
                      [class.border-blue-500/30]="item.platform === 'facebook'"
                      [class.bg-pink-500/20]="item.platform === 'instagram'"
                      [class.text-pink-400]="item.platform === 'instagram'"
                      [class.border-pink-500/30]="item.platform === 'instagram'"
                    >
                      {{ item.platform }}
                    </span>

                    <!-- Approval Badge -->
                    @if (item.approvalStatus === 'pending') {
                      <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <mat-icon class="text-xs">hourglass_empty</mat-icon>
                        <span>Pending Human Review</span>
                      </span>
                    } @else if (item.approvalStatus === 'approved') {
                      <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <mat-icon class="text-xs">check_circle</mat-icon>
                        <span>Approved for Dispatch</span>
                      </span>
                    } @else {
                      <span class="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                        <mat-icon class="text-xs">cancel</mat-icon>
                        <span>Rejected (Revision Needed)</span>
                      </span>
                    }

                    <span class="text-xs text-slate-400 font-mono flex items-center gap-1 ml-auto md:ml-0">
                      <mat-icon class="text-xs">schedule</mat-icon>
                      {{ item.plannedDate }} at {{ item.plannedTime }}
                    </span>
                  </div>

                  <h3 class="text-base font-bold text-white">{{ item.title }}</h3>
                  <p class="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {{ item.contentPreview }}
                  </p>
                </div>

                <!-- Action Controls -->
                <div class="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  @if (item.approvalStatus === 'pending') {
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="api.approveItem(item.id, 'Kamal Das (Administrator)')"
                        class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition cursor-pointer"
                      >
                        <mat-icon class="text-sm">verified</mat-icon>
                        <span>Sign-off & Approve</span>
                      </button>
                      <button
                        type="button"
                        (click)="api.rejectItem(item.id, 'Content adjustments needed')"
                        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 border border-slate-700 text-slate-300 hover:text-rose-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <mat-icon class="text-sm">close</mat-icon>
                        <span>Reject</span>
                      </button>
                    </div>
                  } @else if (item.approvalStatus === 'approved') {
                    <div class="text-[11px] text-emerald-400 flex items-center gap-1">
                      <mat-icon class="text-xs">verified_user</mat-icon>
                      <span>Verified by {{ item.approvedBy || 'Admin' }}</span>
                    </div>
                  }

                  <button
                    type="button"
                    (click)="api.deleteCalendarItem(item.id)"
                    class="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <mat-icon class="text-xs">delete</mat-icon>
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <!-- Integration Readiness Note -->
              <div class="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Ref ID: {{ item.id }}</span>
                <span class="italic">
                  Target Gateway: {{ item.platform.toUpperCase() }} (Pending live OAuth credentials)
                </span>
              </div>
            </div>
          }
        </div>
      }

      <!-- Create Schedule Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl animate-fade-in">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-orange-400">add_task</mat-icon>
                <h3 class="text-base font-bold text-white">Schedule Social Media Plan</h3>
              </div>
              <button
                type="button"
                (click)="showCreateModal.set(false)"
                class="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="createScheduleForm" (ngSubmit)="onCreateScheduleSubmit()" class="space-y-4">
              <div class="space-y-1">
                <label for="create-schedule-title" class="block text-xs font-semibold text-slate-300">Campaign / Content Title</label>
                <input
                  id="create-schedule-title"
                  type="text"
                  formControlName="title"
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. YouTube Weekly AI Deepdive #14"
                />
              </div>

              <div class="space-y-1">
                <label for="create-schedule-platform" class="block text-xs font-semibold text-slate-300">Platform Gateway</label>
                <select
                  id="create-schedule-platform"
                  formControlName="platform"
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="youtube">YouTube (Video Upload / Premier)</option>
                  <option value="facebook">Facebook (Page Post & Updates)</option>
                  <option value="instagram">Instagram (Reels / Professional Feed)</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label for="create-schedule-date" class="block text-xs font-semibold text-slate-300">Target Date</label>
                  <input
                    id="create-schedule-date"
                    type="date"
                    formControlName="plannedDate"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <label for="create-schedule-time" class="block text-xs font-semibold text-slate-300">Time (24h)</label>
                  <input
                    id="create-schedule-time"
                    type="time"
                    formControlName="plannedTime"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label for="create-schedule-preview" class="block text-xs font-semibold text-slate-300">Content / Script Excerpt</label>
                <textarea
                  id="create-schedule-preview"
                  formControlName="contentPreview"
                  rows="3"
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 resize-none font-mono"
                  placeholder="Hook or summary to be reviewed..."
                ></textarea>
              </div>

              <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 space-y-1">
                <div class="text-amber-400 font-semibold flex items-center gap-1">
                  <mat-icon class="text-xs">security</mat-icon>
                  Mandatory Review Policy
                </div>
                <p>New calendar plans enter the queue as 'Pending Human Approval'. You can sign off on them at any time.</p>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showCreateModal.set(false)"
                  class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="createScheduleForm.invalid"
                  class="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <mat-icon class="text-sm">check</mat-icon>
                  <span>Add to Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class CalendarView {
  readonly api = inject(ShaktiApi);

  readonly filterPlatform = signal<string>('all');
  readonly filterStatus = signal<string>('all');
  readonly showCreateModal = signal<boolean>(false);

  readonly createScheduleForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    platform: new FormControl<'youtube' | 'facebook' | 'instagram'>('youtube', { nonNullable: true }),
    plannedDate: new FormControl<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plannedTime: new FormControl<string>('16:00', { nonNullable: true, validators: [Validators.required] }),
    contentPreview: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterStatus.set(target.value);
  }

  filteredItems(): CalendarItem[] {
    const p = this.filterPlatform();
    const s = this.filterStatus();

    return this.api.calendarItems().filter((item) => {
      const matchP = p === 'all' || item.platform === p;
      const matchS = s === 'all' || item.approvalStatus === s;
      return matchP && matchS;
    });
  }

  async onCreateScheduleSubmit() {
    if (this.createScheduleForm.invalid) return;
    const v = this.createScheduleForm.getRawValue();

    await this.api.addCalendarItem({
      title: v.title,
      platform: v.platform,
      plannedDate: v.plannedDate,
      plannedTime: v.plannedTime,
      contentPreview: v.contentPreview,
    });

    this.showCreateModal.set(false);
    this.createScheduleForm.reset({
      title: '',
      platform: 'youtube',
      plannedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      plannedTime: '16:00',
      contentPreview: '',
    });
  }
}
