import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (api.toast(); as t) {
      <div
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 max-w-md animate-fade-in"
        [class.bg-emerald-950]="t.type === 'success'"
        [class.border-emerald-700]="t.type === 'success'"
        [class.text-emerald-200]="t.type === 'success'"
        [class.bg-rose-950]="t.type === 'error'"
        [class.border-rose-700]="t.type === 'error'"
        [class.text-rose-200]="t.type === 'error'"
        [class.bg-slate-900]="t.type === 'info'"
        [class.border-slate-700]="t.type === 'info'"
        [class.text-slate-200]="t.type === 'info'"
      >
        <mat-icon class="text-xl">
          @if (t.type === 'success') {
            check_circle
          } @else if (t.type === 'error') {
            error
          } @else {
            info
          }
        </mat-icon>
        <p class="text-sm font-medium flex-1">{{ t.message }}</p>
        <button
          type="button"
          (click)="api.toast.set(null)"
          class="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
          aria-label="Dismiss notification"
        >
          <mat-icon class="text-sm">close</mat-icon>
        </button>
      </div>
    }
  `,
})
export class Toast {
  readonly api = inject(ShaktiApi);
}
