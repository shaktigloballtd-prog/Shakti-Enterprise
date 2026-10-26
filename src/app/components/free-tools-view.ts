import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { SheetsSyncResult } from '../models/shakti.models';

type FreeToolTab = 'SHEETS_DRIVE' | 'CANVA' | 'REPLIT_GITHUB' | 'AI_QUOTA';

interface CanvaPreset {
  id: string;
  name: string;
  dimensions: string;
  platform: string;
  icon: string;
  canvaUrl: string;
  description: string;
}

@Component({
  selector: 'app-free-tools-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <mat-icon class="text-xs">savings</mat-icon>
            <span>Free-Tools-First Architecture • ₹0 Monthly Budget</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Free-Tools, Google Sheets & Workspace Hub
          </h1>
          <p class="text-xs text-slate-400">
            Saarthi Enterprise operations powered exclusively by free-tier tools: Google Sheets, Google Drive, Google Apps Script, Canva, Replit, GitHub, and Gemini AI.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="exportBackup()"
            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">download</mat-icon>
            <span>Download Drive Backup</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0f1523] border border-white/5">
        <button
          type="button"
          (click)="activeTab.set('SHEETS_DRIVE')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'SHEETS_DRIVE'"
          [class.text-white]="activeTab() === 'SHEETS_DRIVE'"
          [class.text-slate-400]="activeTab() !== 'SHEETS_DRIVE'"
        >
          <mat-icon class="text-sm">table_view</mat-icon>
          <span>Google Sheets & Drive</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('CANVA')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'CANVA'"
          [class.text-white]="activeTab() === 'CANVA'"
          [class.text-slate-400]="activeTab() !== 'CANVA'"
        >
          <mat-icon class="text-sm">palette</mat-icon>
          <span>Canva Creative Studio</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('REPLIT_GITHUB')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'REPLIT_GITHUB'"
          [class.text-white]="activeTab() === 'REPLIT_GITHUB'"
          [class.text-slate-400]="activeTab() !== 'REPLIT_GITHUB'"
        >
          <mat-icon class="text-sm">code</mat-icon>
          <span>Replit & GitHub Guide</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('AI_QUOTA')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'AI_QUOTA'"
          [class.text-white]="activeTab() === 'AI_QUOTA'"
          [class.text-slate-400]="activeTab() !== 'AI_QUOTA'"
        >
          <mat-icon class="text-sm">tune</mat-icon>
          <span>Zero-Cost Quota Guardrails</span>
        </button>
      </div>

      <!-- TAB 1: GOOGLE SHEETS & DRIVE -->
      @if (activeTab() === 'SHEETS_DRIVE') {
        <div class="space-y-6">
          <!-- Webhook Configuration & Sync Status -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Webhook URL Card -->
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 lg:col-span-2 shadow-xl">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-emerald-400">table_chart</mat-icon>
                  <h3 class="text-sm font-bold text-white">Google Apps Script Free Webhook Bridge</h3>
                </div>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono"
                  [class.bg-emerald-500/20]="api.freeToolsConfig()?.googleAppsScriptUrl"
                  [class.text-emerald-400]="api.freeToolsConfig()?.googleAppsScriptUrl"
                  [class.bg-amber-500/20]="!api.freeToolsConfig()?.googleAppsScriptUrl"
                  [class.text-amber-400]="!api.freeToolsConfig()?.googleAppsScriptUrl"
                >
                  {{ api.freeToolsConfig()?.googleAppsScriptUrl ? 'LIVE WEBHOOK LINKED' : 'MANUAL CLIPBOARD MODE' }}
                </span>
              </div>

              <form [formGroup]="configForm" (ngSubmit)="saveConfig()" class="space-y-3">
                <div>
                  <label for="gas-url" class="block text-[11px] font-semibold text-slate-400">
                    Google Apps Script Web App URL (Free Webhook)
                  </label>
                  <input
                    id="gas-url"
                    type="url"
                    formControlName="googleAppsScriptUrl"
                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    placeholder="https://script.google.com/macros/s/.../exec"
                  />
                  <span class="text-[10px] text-slate-500 block mt-1">
                    Deploy once in your personal Google Sheet (Extensions > Apps Script). Free, zero billing card needed.
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="sheet-name" class="block text-[11px] font-semibold text-slate-400">Spreadsheet Base Name</label>
                    <input
                      id="sheet-name"
                      type="text"
                      formControlName="googleSheetName"
                      class="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div class="flex items-end">
                    <button
                      type="submit"
                      class="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition"
                    >
                      Save Webhook Settings
                    </button>
                  </div>
                </div>
              </form>

              <div class="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>Last Synchronized: {{ api.freeToolsConfig()?.lastSheetsSyncTimestamp ? (api.freeToolsConfig()?.lastSheetsSyncTimestamp | date: 'medium') : 'Pending first sync' }}</span>
                <button
                  type="button"
                  (click)="showScriptModal.set(true)"
                  class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <mat-icon class="text-xs">code</mat-icon>
                  <span>View & Copy Apps Script Code (.gs)</span>
                </button>
              </div>
            </div>

            <!-- Free Storage Card -->
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-xl flex flex-col justify-between">
              <div class="space-y-1">
                <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cloud & Local Storage</span>
                <div class="text-lg font-bold text-white">Google Drive Backup</div>
                <p class="text-xs text-slate-400">15 GB free personal Drive capacity. Zero cloud database fees.</p>
              </div>

              <div class="space-y-2 text-xs font-mono">
                <div class="flex justify-between text-slate-300">
                  <span class="font-sans">Active Store Size:</span>
                  <span class="text-emerald-400 font-bold">~85 KB (Lightweight)</span>
                </div>
                <div class="flex justify-between text-slate-300">
                  <span class="font-sans">Phone / Laptop Specs:</span>
                  <span class="text-white">Compatible with 4GB RAM</span>
                </div>
                <div class="flex justify-between text-slate-300">
                  <span class="font-sans">Offline Safety:</span>
                  <span class="text-emerald-400">100% File-Backed</span>
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <button
                  type="button"
                  (click)="exportBackup()"
                  class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <mat-icon class="text-sm">file_download</mat-icon>
                  <span>Download JSON Backup</span>
                </button>
                <button
                  type="button"
                  (click)="showRestoreModal.set(true)"
                  class="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <mat-icon class="text-sm">file_upload</mat-icon>
                  <span>Restore from JSON File</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Direct Sheets Push Deck (4 Data Entities) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-bold text-white uppercase tracking-wider">
                Instant Google Sheets Synchronization
              </h2>
              <span class="text-xs text-slate-500">1-click Webhook or clipboard paste</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Orders Sync Card -->
              <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white">Customer Orders</span>
                    <mat-icon class="text-blue-400 text-base">receipt_long</mat-icon>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ api.orders().length }} orders with customer phone, address, GST and tracking.</p>
                </div>
                <div class="space-y-2 pt-2">
                  <button
                    type="button"
                    (click)="triggerSync('ORDERS')"
                    class="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <mat-icon class="text-xs">cloud_upload</mat-icon>
                    <span>Sync Orders</span>
                  </button>
                </div>
              </div>

              <!-- Inventory Sync Card -->
              <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white">Product Inventory</span>
                    <mat-icon class="text-amber-400 text-base">inventory_2</mat-icon>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ api.products().length }} SKUs with purchase cost, selling price, and stock levels.</p>
                </div>
                <div class="space-y-2 pt-2">
                  <button
                    type="button"
                    (click)="triggerSync('INVENTORY')"
                    class="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <mat-icon class="text-xs">cloud_upload</mat-icon>
                    <span>Sync Inventory</span>
                  </button>
                </div>
              </div>

              <!-- General Ledger Sync Card -->
              <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white">General Ledger</span>
                    <mat-icon class="text-emerald-400 text-base">account_balance</mat-icon>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ api.chartOfAccounts().length }} accounts with Indian accounting balances & debits.</p>
                </div>
                <div class="space-y-2 pt-2">
                  <button
                    type="button"
                    (click)="triggerSync('LEDGER')"
                    class="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <mat-icon class="text-xs">cloud_upload</mat-icon>
                    <span>Sync Ledger</span>
                  </button>
                </div>
              </div>

              <!-- P&L and GST Card -->
              <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-lg flex flex-col justify-between">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white">P&L & GST Summary</span>
                    <mat-icon class="text-purple-400 text-base">analytics</mat-icon>
                  </div>
                  <p class="text-[11px] text-slate-400">Gross Sales, COGS, Net Profit, Output GST, and ITC reconciliation.</p>
                </div>
                <div class="space-y-2 pt-2">
                  <button
                    type="button"
                    (click)="triggerSync('PL')"
                    class="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <mat-icon class="text-xs">cloud_upload</mat-icon>
                    <span>Sync P&L Summary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Last Sync Result & Copy Box -->
          @if (lastSyncResult()) {
            @let r = lastSyncResult();
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-emerald-500/20 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <mat-icon class="text-base">check_circle</mat-icon>
                  <span>{{ r?.message }} ({{ r?.syncedRecords }} rows prepared)</span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="copyTsv(r?.tsvContent)"
                    class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <mat-icon class="text-xs">content_copy</mat-icon>
                    <span>Copy TSV to Paste in Sheets</span>
                  </button>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-40 overflow-y-auto whitespace-pre">
                {{ r?.tsvContent }}
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 2: CANVA CREATIVE STUDIO -->
      @if (activeTab() === 'CANVA') {
        <div class="space-y-6">
          <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#161226] to-[#0f1523] border border-purple-500/20 shadow-xl space-y-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold">
              <mat-icon class="text-xs">palette</mat-icon>
              <span>100% Free Creative Workflow</span>
            </div>
            <h2 class="text-xl font-bold text-white">Canva Social Design & Packaging Studio</h2>
            <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Design eye-catching YouTube thumbnails, Instagram carousels, and festive spice packaging for free. One-click launches the free Canva design canvas with exact optimal pixel dimensions and pre-formatted marketing copy.
            </p>
          </div>

          <!-- Design Launchers Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (preset of canvaPresets; track preset.id) {
              <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-purple-500/30 transition">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">{{ preset.platform }}</span>
                    <span class="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[10px] font-mono text-slate-300">{{ preset.dimensions }}</span>
                  </div>
                  <h3 class="text-base font-bold text-white">{{ preset.name }}</h3>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ preset.description }}</p>
                </div>

                <div class="pt-3 border-t border-white/5 space-y-2">
                  <button
                    type="button"
                    (click)="openCanva(preset)"
                    class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <mat-icon class="text-sm">open_in_new</mat-icon>
                    <span>Launch in Canva (Free)</span>
                  </button>
                  <button
                    type="button"
                    (click)="copyCanvaCopy(preset)"
                    class="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <mat-icon class="text-xs">content_copy</mat-icon>
                    <span>Copy Text Kit for Design</span>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Color Palette Kit -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saarthi Enterprise Spice Color Codes for Canva
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#EAB308] shrink-0 border border-black/20"></div>
                <div>
                  <div class="font-bold text-white">#EAB308</div>
                  <div class="text-[10px] text-slate-400 font-sans">Turmeric Gold</div>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#B45309] shrink-0 border border-black/20"></div>
                <div>
                  <div class="font-bold text-white">#B45309</div>
                  <div class="text-[10px] text-slate-400 font-sans">Garam Masala</div>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#DC2626] shrink-0 border border-black/20"></div>
                <div>
                  <div class="font-bold text-white">#DC2626</div>
                  <div class="text-[10px] text-slate-400 font-sans">Burrabazar Red</div>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#15803D] shrink-0 border border-black/20"></div>
                <div>
                  <div class="font-bold text-white">#15803D</div>
                  <div class="text-[10px] text-slate-400 font-sans">Cardamom Green</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: REPLIT & GITHUB BEGINNER SETUP -->
      @if (activeTab() === 'REPLIT_GITHUB') {
        <div class="space-y-6">
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-xl">
            <div class="flex items-center gap-2">
              <mat-icon class="text-cyan-400">devices</mat-icon>
              <h2 class="text-base font-bold text-white">Beginner Hardware & Platform Guide (4GB RAM Laptop / Android Phone)</h2>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              This application has been engineered with zero heavy dependencies, running within lightweight NodeJS and Angularzoneless runtime. It runs smoothly on affordable devices and Replit free workspaces without memory thrashing.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Replit Free Tier Card -->
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white">Replit Free Core Tier</h3>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">100% FREE</span>
              </div>
              <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>Allocates 0.5 vCPU and up to 1GB RAM — more than sufficient for SHAKTI server and SQLite/JSON storage.</li>
                <li>Never requires entering a credit card or billing information for workspace coding.</li>
                <li>Runs directly in Android Google Chrome or low-spec laptop browsers with zero local installs.</li>
                <li>Use <code class="text-cyan-300">npm run dev</code> to boot the development preview on port 3000.</li>
              </ul>
            </div>

            <!-- GitHub Backup Card -->
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-xl">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white">GitHub Free Version Control</h3>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">UNLIMITED REPOS</span>
              </div>
              <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>Create a free repository at <code class="text-cyan-300">github.com/new</code> (e.g. <code class="text-white">saarthi-enterprise-shakti</code>).</li>
                <li>Secrets (like <code class="text-amber-400">GEMINI_API_KEY</code>) are placed strictly in <code class="text-white">.env</code> and <code class="text-white">.gitignore</code>, never published publicly.</li>
                <li>Store JSON snapshots in a private GitHub branch or Google Drive folder for safe business records.</li>
              </ul>
            </div>
          </div>
        </div>
      }

      <!-- TAB 4: ZERO-COST QUOTA GUARDRAILS -->
      @if (activeTab() === 'AI_QUOTA') {
        <div class="space-y-6">
          <!-- Gemini Free Quota Monitor -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl">
            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <div class="space-y-0.5">
                <h3 class="text-sm font-bold text-white">Google AI Studio Gemini Free Quota Monitor</h3>
                <p class="text-xs text-slate-400">Zero billing account required. Tracks daily request consumption.</p>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                NO CREDIT CARD REQUIRED
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-[11px] text-slate-400 uppercase font-semibold">Requests Used Today</div>
                <div class="text-2xl font-bold text-white font-mono">{{ api.freeToolsConfig()?.geminiRequestsToday || 0 }}</div>
                <div class="text-[10px] text-slate-500">Live API calls logged</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-[11px] text-slate-400 uppercase font-semibold">Free Tier Daily Limit</div>
                <div class="text-2xl font-bold text-emerald-400 font-mono">1,500 Requests</div>
                <div class="text-[10px] text-slate-500">Free daily quota from Google</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-[11px] text-slate-400 uppercase font-semibold">Offline Fallback Engine</div>
                <div class="text-2xl font-bold text-cyan-400 font-mono">Active</div>
                <div class="text-[10px] text-cyan-300/80">Never locks or fails if quota ends</div>
              </div>
            </div>

            <!-- Transparency Guarantee Banner -->
            <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 space-y-1.5">
              <div class="font-bold flex items-center gap-1.5">
                <mat-icon class="text-sm">verified</mat-icon>
                <span>Zero Surprise Charges Guarantee</span>
              </div>
              <p class="text-slate-300 leading-relaxed text-[11px]">
                The SHAKTI platform does not use paid third-party automations (such as Zapier, Make, paid Redis, or paid cloud databases). Everything persists to your local JSON store and connects freely to Google Sheets via your own Google Apps Script. If an external quota is exhausted or disconnected, the application continues to run seamlessly using offline deterministic templates.
              </p>
            </div>
          </div>
        </div>
      }

      <!-- Apps Script Code Modal -->
      @if (showScriptModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-2xl bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-400">code</mat-icon>
                <h2 class="text-sm font-bold text-white">Google Apps Script Snippet (100% Free)</h2>
              </div>
              <button
                type="button"
                (click)="showScriptModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <p class="text-xs text-slate-400">
              Copy and paste this snippet into your Google Sheet (Extensions > Apps Script), then click Deploy as Web App:
            </p>

            <textarea
              rows="12"
              readonly
              [value]="appsScriptSnippet()"
              class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-mono focus:outline-none overflow-y-auto"
            ></textarea>

            <div class="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                (click)="showScriptModal.set(false)"
                class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                (click)="copyAppsScript()"
                class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
              >
                <mat-icon class="text-xs">content_copy</mat-icon>
                <span>Copy Script Code</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Restore Backup Modal -->
      @if (showRestoreModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 class="text-sm font-bold text-white">Restore Snapshot from JSON</h2>
              <button
                type="button"
                (click)="showRestoreModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <div class="space-y-3">
              <p class="text-xs text-slate-400">
                Paste your exported <code class="text-cyan-300">saarthi-backup.json</code> contents below to restore products, orders, and ledger:
              </p>
              <textarea
                rows="6"
                [value]="restorePayload()"
                (input)="restorePayload.set($any($event.target).value)"
                class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                placeholder='{"exportedAt":"...", "data":{...}}'
              ></textarea>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showRestoreModal.set(false)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="executeRestore()"
                  class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Verify & Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FreeToolsView {
  readonly api = inject(ShaktiApi);

  readonly activeTab = signal<FreeToolTab>('SHEETS_DRIVE');
  readonly showScriptModal = signal<boolean>(false);
  readonly showRestoreModal = signal<boolean>(false);
  readonly lastSyncResult = signal<SheetsSyncResult | null>(null);
  readonly restorePayload = signal<string>('');

  readonly canvaPresets: CanvaPreset[] = [
    {
      id: 'yt-thumb',
      name: 'YouTube Video Thumbnail',
      dimensions: '1280 × 720 px',
      platform: 'YouTube',
      icon: 'video_library',
      canvaUrl: 'https://www.canva.com/create/youtube-thumbnails/',
      description: 'High-contrast food & spice thumbnail with bold typography for maximum mobile CTR.',
    },
    {
      id: 'ig-square',
      name: 'Instagram Square Carousel',
      dimensions: '1080 × 1080 px',
      platform: 'Instagram',
      icon: 'photo_camera',
      canvaUrl: 'https://www.canva.com/create/instagram-posts/',
      description: 'Multi-slide recipe and health benefits carousel highlighting authentic stone-ground spices.',
    },
    {
      id: 'ig-reel',
      name: 'Reel / Shorts Vertical Cover',
      dimensions: '1080 × 1920 px',
      platform: 'Reels / Shorts',
      icon: 'smartphone',
      canvaUrl: 'https://www.canva.com/create/instagram-reels/',
      description: 'Full-bleed 9:16 vertical cover for cooking hacks, Bengali recipes, and quick masala tips.',
    },
    {
      id: 'fb-banner',
      name: 'Facebook Feed & Group Banner',
      dimensions: '1200 × 630 px',
      platform: 'Facebook',
      icon: 'feed',
      canvaUrl: 'https://www.canva.com/create/facebook-posts/',
      description: 'Community-oriented spice discussion post and customer announcement graphic.',
    },
    {
      id: 'label-pack',
      name: 'Packaging & Pouch Label Mockup',
      dimensions: '1500 × 1500 px',
      platform: 'Print & Store',
      icon: 'inventory_2',
      canvaUrl: 'https://www.canva.com/create/labels/',
      description: 'Moisture-barrier pouch branding with FSSAI badge, net weight, and Burrabazar address.',
    },
  ];

  readonly configForm = new FormGroup({
    googleAppsScriptUrl: new FormControl<string>('', { nonNullable: true }),
    googleSheetName: new FormControl<string>('Saarthi_Enterprise_Master', { nonNullable: true }),
  });

  readonly appsScriptSnippet = signal<string>(`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.sheetName || 'Saarthi_Data';
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    
    if (data.rows && data.rows.length > 0) {
      if (data.action === 'APPEND_OR_REPLACE') sheet.clearContents();
      sheet.getRange(1, 1, data.rows.length, data.rows[0].length).setValues(data.rows);
      sheet.getRange(1, 1, 1, data.rows[0].length).setFontWeight("bold").setBackground("#f3f4f6");
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", rows: data.rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`);

  constructor() {
    const cfg = this.api.freeToolsConfig();
    if (cfg) {
      this.configForm.patchValue({
        googleAppsScriptUrl: cfg.googleAppsScriptUrl || '',
        googleSheetName: cfg.googleSheetName || 'Saarthi_Enterprise_Master',
      });
    }
  }

  async saveConfig() {
    const v = this.configForm.getRawValue();
    await this.api.updateFreeToolsConfig({
      googleAppsScriptUrl: v.googleAppsScriptUrl.trim(),
      googleSheetName: v.googleSheetName.trim(),
    });
  }

  async triggerSync(target: 'ORDERS' | 'INVENTORY' | 'LEDGER' | 'PL') {
    const result = await this.api.syncToGoogleSheets(target);
    this.lastSyncResult.set(result);
  }

  copyTsv(tsv?: string) {
    if (!tsv) return;
    navigator.clipboard.writeText(tsv);
    this.api.showToast('Copied TSV table to clipboard! Paste directly into Google Sheets (Ctrl+V / Cmd+V).', 'success');
  }

  exportBackup() {
    this.api.downloadBackupSnapshot();
  }

  async executeRestore() {
    const raw = this.restorePayload().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      await this.api.restoreBackupSnapshot(parsed);
      this.showRestoreModal.set(false);
    } catch {
      this.api.showToast('Invalid JSON file format. Could not parse.', 'error');
    }
  }

  openCanva(preset: CanvaPreset) {
    if (typeof window !== 'undefined') {
      window.open(preset.canvaUrl, '_blank');
    }
  }

  copyCanvaCopy(preset: CanvaPreset) {
    const text = `HEADLINE: Authentic Stone-Ground Spices — Saarthi Enterprise
SUBHEADLINE: 100% Pure Aroma Sealed Direct From Kolkata Burrabazar
BULLETS:
• Low RPM Cold-Ground Spices
• Zero Fillers & Artificial Colors
• Express Delhivery Tracking
CALL TO ACTION: Order Fresh Spice Pouches Online Today!`;

    navigator.clipboard.writeText(text);
    this.api.showToast(`Copied text kit for ${preset.name}! Paste into your Canva text fields.`, 'info');
  }

  copyAppsScript() {
    navigator.clipboard.writeText(this.appsScriptSnippet());
    this.api.showToast('Copied Google Apps Script code to clipboard!', 'success');
  }
}
