import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

@Component({
  selector: 'app-pos-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <mat-icon class="text-xs">point_of_sale</mat-icon>
            <span>External GitHub Integration Gateway</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Shakti Masala POS Integration Hub
          </h1>
          <p class="text-xs text-slate-400">
            Secure bidirectional synchronization between Saarthi Enterprise Cloud and your standalone Shakti Masala physical POS terminal.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            (click)="triggerSync()"
            [disabled]="isSyncing()"
            class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm" [class.animate-spin]="isSyncing()">sync</mat-icon>
            <span>{{ isSyncing() ? 'Synchronizing...' : 'Trigger Sync Handshake' }}</span>
          </button>
        </div>
      </div>

      <!-- Integration Status & Architecture Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Live Endpoint Card -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 lg:col-span-2 shadow-xl">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-cyan-400">api</mat-icon>
              <h3 class="text-sm font-bold text-white">Cloud Integration Endpoint & Security</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
              READY FOR WEBHOOKS
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px] mb-1">Webhook Target URL (HTTPS):</span>
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300">
                <span class="truncate">https://ais-dev-2yop7ebq6tc4sk4x2hawez-822850197075.asia-east1.run.app/api/pos/sync</span>
                <button
                  type="button"
                  (click)="copyEndpoint()"
                  class="ml-2 text-slate-400 hover:text-white"
                  title="Copy Endpoint"
                >
                  <mat-icon class="text-sm">content_copy</mat-icon>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span class="text-slate-400 block text-[11px] mb-1">API Key (Injected via Secrets):</span>
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-300 text-[11px]">
                  {{ api.posConfig()?.apiKeyMasked || 'shakti_pos_live_99...a1' }}
                </div>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px] mb-1">Idempotency Guard:</span>
                <div class="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-300 text-[11px]">
                  Header: X-Shakti-POS-Idempotency
                </div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-200 space-y-1">
              <div class="font-bold">Verified POS State</div>
              <p class="text-slate-400">
                The physical Shakti Masala POS repository resides externally on GitHub. This production integration gateway provides schema-validated endpoints, duplicate-preventing idempotency tokens, and CSV fallbacks for retail counter operations.
              </p>
            </div>
          </div>
        </div>

        <!-- POS Summary Statistics -->
        <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between">
          <div class="space-y-1">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Burrabazar Physical Counter</h3>
            <div class="text-xl font-bold text-white">Retail POS Status</div>
            <p class="text-xs text-slate-400">Synced with master inventory</p>
          </div>

          <div class="space-y-2 text-xs font-mono">
            <div class="flex justify-between text-slate-300">
              <span class="font-sans">Sync Frequency:</span>
              <span class="text-cyan-400 font-bold">Real-time / Instant</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span class="font-sans">Entities Covered:</span>
              <span class="text-white">Inventory & Sales</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span class="font-sans">Last Successful Sync:</span>
              <span class="text-slate-400 font-sans text-[11px]">Just now</span>
            </div>
          </div>

          <button
            type="button"
            (click)="showCsvModal.set(true)"
            class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">upload_file</mat-icon>
            <span>Offline Counter CSV Import</span>
          </button>
        </div>
      </div>

      <!-- POS Sync Audit Trail -->
      <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
        <div class="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
            POS Handshake & Webhook Sync Log
          </h3>
          <span class="text-[11px] text-slate-400 font-mono">
            Audit Retention: 90 Days
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th class="p-3.5 pl-5">Timestamp</th>
                <th class="p-3.5">Action Event</th>
                <th class="p-3.5">Synced Records</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 pr-5">Execution Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-mono">
              @for (log of api.posSyncLogs(); track log.id) {
                <tr class="hover:bg-slate-900/40 transition">
                  <td class="p-3.5 pl-5 text-slate-400">{{ log.timestamp | date: 'medium' }}</td>
                  <td class="p-3.5 font-sans">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="p-3.5 text-cyan-400 font-bold">{{ log.recordsProcessed }} items</td>
                  <td class="p-3.5 font-sans">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="p-3.5 pr-5 font-sans text-slate-400 text-[11px]">{{ log.details }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Offline CSV Import Modal -->
      @if (showCsvModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-cyan-400">upload_file</mat-icon>
                <h2 class="text-sm font-bold text-white">Import Offline Retail Counter CSV</h2>
              </div>
              <button
                type="button"
                (click)="showCsvModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <div class="space-y-3">
              <p class="text-xs text-slate-400">
                Paste CSV text from your Burrabazar desktop POS (format: <code class="text-cyan-300">sku,name,stockQuantity,sellingPrice</code>):
              </p>
              <textarea
                rows="5"
                [value]="csvData()"
                (input)="csvData.set($any($event.target).value)"
                class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                placeholder="SHAKTI-HAL-100,Shakti Haldi Powder 100g,120,45"
              ></textarea>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showCsvModal.set(false)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="processCsvImport()"
                  class="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Parse & Synchronize
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class PosView {
  readonly api = inject(ShaktiApi);

  readonly isSyncing = signal<boolean>(false);
  readonly showCsvModal = signal<boolean>(false);
  readonly csvData = signal<string>(
    'SHAKTI-HAL-100,Shakti Haldi Powder 100g,150,45\nSHAKTI-MIR-100,Shakti Lal Mirch Powder 100g,120,55',
  );

  async triggerSync() {
    this.isSyncing.set(true);
    try {
      await this.api.triggerPosSync();
    } finally {
      this.isSyncing.set(false);
    }
  }

  copyEndpoint() {
    navigator.clipboard.writeText(
      'https://ais-dev-2yop7ebq6tc4sk4x2hawez-822850197075.asia-east1.run.app/api/pos/sync',
    );
    this.api.showToast('POS Webhook URL copied to clipboard', 'info');
  }

  async processCsvImport() {
    const raw = this.csvData().trim();
    if (!raw) return;

    const lines = raw.split('\n');
    const records = lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((line) => {
        const [sku, name, stock, price] = line.split(',');
        return {
          sku: sku?.trim() || '',
          name: name?.trim() || '',
          stockQuantity: Number(stock) || 0,
          sellingPrice: Number(price) || 0,
        };
      })
      .filter((r) => r.sku && r.name);

    if (records.length === 0) {
      this.api.showToast('Invalid CSV format. Please review.', 'error');
      return;
    }

    await this.api.importPosCsv(records);
    this.showCsvModal.set(false);
  }
}
