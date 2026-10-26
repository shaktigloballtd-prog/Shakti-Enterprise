import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { ExpenseCategory, JournalLine } from '../models/shakti.models';

type ErpTab = 'OVERVIEW_PL' | 'LEDGER' | 'JOURNAL' | 'EXPENSES' | 'GOOGLE_SHEETS_ERP';

@Component({
  selector: 'app-erp-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <mat-icon class="text-xs">account_balance</mat-icon>
            <span>Indian Accounting & GST General Ledger</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Financial ERP & Compliance
          </h1>
          <p class="text-xs text-slate-400">
            Double-entry balanced bookkeeping, GST reconciliation (CGST/SGST/IGST), P&L statement, and operational expense tracking for Saarthi Enterprise.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="showExpenseModal.set(true)"
            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">receipt_long</mat-icon>
            <span>Record Expense</span>
          </button>
          <button
            type="button"
            (click)="showJournalModal.set(true)"
            class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">add_card</mat-icon>
            <span>New Journal Voucher</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0f1523] border border-white/5">
        <button
          type="button"
          (click)="activeTab.set('OVERVIEW_PL')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'OVERVIEW_PL'"
          [class.text-white]="activeTab() === 'OVERVIEW_PL'"
          [class.text-slate-400]="activeTab() !== 'OVERVIEW_PL'"
        >
          <mat-icon class="text-sm">bar_chart</mat-icon>
          <span>P&L & GST Summary</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('LEDGER')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'LEDGER'"
          [class.text-white]="activeTab() === 'LEDGER'"
          [class.text-slate-400]="activeTab() !== 'LEDGER'"
        >
          <mat-icon class="text-sm">account_balance_wallet</mat-icon>
          <span>Chart of Accounts ({{ api.chartOfAccounts().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('JOURNAL')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'JOURNAL'"
          [class.text-white]="activeTab() === 'JOURNAL'"
          [class.text-slate-400]="activeTab() !== 'JOURNAL'"
        >
          <mat-icon class="text-sm">menu_book</mat-icon>
          <span>Journal Vouchers ({{ api.journalEntries().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('EXPENSES')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'EXPENSES'"
          [class.text-white]="activeTab() === 'EXPENSES'"
          [class.text-slate-400]="activeTab() !== 'EXPENSES'"
        >
          <mat-icon class="text-sm">receipt</mat-icon>
          <span>Expense Register ({{ api.expenses().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('GOOGLE_SHEETS_ERP')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2"
          [class.bg-emerald-600]="activeTab() === 'GOOGLE_SHEETS_ERP'"
          [class.text-white]="activeTab() === 'GOOGLE_SHEETS_ERP'"
          [class.text-slate-400]="activeTab() !== 'GOOGLE_SHEETS_ERP'"
        >
          <mat-icon class="text-sm">table_chart</mat-icon>
          <span>Google Sheets ERP Sync</span>
        </button>
      </div>

      <!-- TAB 1: P&L AND GST RECONCILIATION -->
      @if (activeTab() === 'OVERVIEW_PL') {
        @let s = api.businessSummary();
        <div class="space-y-6">
          <!-- Top Financial Performance Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
              <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</div>
              <div class="text-2xl font-bold text-white font-mono">₹{{ (s?.grossSales ?? 0) | number }}</div>
              <div class="text-[10px] text-slate-500">Total customer order value</div>
            </div>

            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
              <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">COGS (Direct Costs)</div>
              <div class="text-2xl font-bold text-amber-400 font-mono">₹{{ (s?.cogs ?? 0) | number }}</div>
              <div class="text-[10px] text-slate-500">Inventory & raw materials</div>
            </div>

            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
              <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Operating Expenses</div>
              <div class="text-2xl font-bold text-rose-400 font-mono">₹{{ (s?.operatingExpenses ?? 0) | number }}</div>
              <div class="text-[10px] text-slate-500">Rent, salary, packaging & freight</div>
            </div>

            <div class="p-5 rounded-2xl bg-[#0f1523] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-[#0f1523] space-y-1 shadow-lg">
              <div class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Net Operating Profit</div>
              <div class="text-2xl font-bold text-emerald-400 font-mono">₹{{ (s?.netProfit ?? 0) | number }}</div>
              <div class="text-[10px] text-emerald-500/80">Net retained earnings</div>
            </div>
          </div>

          <!-- P&L Statement Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Profit & Loss Card -->
            <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-emerald-400">payments</mat-icon>
                  <h3 class="text-sm font-bold text-white">Profit & Loss Statement (FY 2026-27)</h3>
                </div>
                <span class="text-[11px] text-slate-500 font-mono">Accrual Basis</span>
              </div>

              <div class="space-y-2.5 text-xs font-mono">
                <div class="flex justify-between py-1 border-b border-white/5 text-slate-300">
                  <span class="font-sans">Gross Sales & Orders</span>
                  <span class="text-white font-bold">₹{{ (s?.grossSales ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5 text-rose-400">
                  <span class="font-sans">Less: Returns & Allowances</span>
                  <span>- ₹{{ (s?.discountsAndReturns ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5 text-slate-200 font-bold bg-slate-900/50 px-2 rounded">
                  <span class="font-sans">Net Revenue</span>
                  <span class="text-emerald-400">₹{{ (s?.netSales ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5 text-amber-400">
                  <span class="font-sans">Less: Cost of Goods Sold (COGS)</span>
                  <span>- ₹{{ (s?.cogs ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5 text-slate-200 font-bold bg-slate-900/50 px-2 rounded">
                  <span class="font-sans">Gross Profit</span>
                  <span class="text-emerald-400">₹{{ (s?.grossProfit ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5 text-rose-400">
                  <span class="font-sans">Less: Operating Overheads</span>
                  <span>- ₹{{ (s?.operatingExpenses ?? 0) | number }}</span>
                </div>
                <div class="flex justify-between pt-2 text-sm font-extrabold text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                  <span class="font-sans">Net Business Profit</span>
                  <span>₹{{ (s?.netProfit ?? 0) | number }}</span>
                </div>
              </div>
            </div>

            <!-- GST Compliance & Working Capital -->
            <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-400">receipt</mat-icon>
                  <h3 class="text-sm font-bold text-white">GST Tax Reconciliation</h3>
                </div>
                <span class="text-[11px] text-amber-400 font-mono font-bold">GSTIN: 19AAACS1429B1Z8</span>
              </div>

              <div class="space-y-3 text-xs">
                <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono">
                  <div class="flex justify-between text-slate-300">
                    <span class="font-sans">Output GST Collected (Customer Sales)</span>
                    <span class="text-white font-bold">₹{{ (s?.gstCollected ?? 0) | number }}</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span class="font-sans">Input Tax Credit (ITC Paid on Purchases)</span>
                    <span class="text-emerald-400">- ₹{{ (s?.inputGstPaid ?? 0) | number }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-slate-700 font-bold text-amber-400">
                    <span class="font-sans">Net GST Liability Payable to Govt</span>
                    <span>₹{{ (s?.netGstPayable ?? 0) | number }}</span>
                  </div>
                </div>

                <div class="pt-2 space-y-2">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    Working Capital & Payables
                  </div>
                  <div class="grid grid-cols-2 gap-3 font-mono">
                    <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[10px] text-slate-500 font-sans">Receivables (Unpaid)</div>
                      <div class="text-base font-bold text-white">₹{{ (s?.outstandingReceivables ?? 0) | number }}</div>
                    </div>
                    <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[10px] text-slate-500 font-sans">Supplier Payables (Due)</div>
                      <div class="text-base font-bold text-amber-400">₹{{ (s?.supplierPayables ?? 0) | number }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: CHART OF ACCOUNTS -->
      @if (activeTab() === 'LEDGER') {
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
          <div class="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
              Standard Indian Chart of Accounts
            </h3>
            <span class="text-[11px] text-slate-400 font-mono">
              Assets, Liabilities, Equity, Revenues, Expenses
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
                <tr>
                  <th class="p-3.5 pl-5">Code</th>
                  <th class="p-3.5">Account Name</th>
                  <th class="p-3.5">Category</th>
                  <th class="p-3.5">Description</th>
                  <th class="p-3.5 text-right pr-5">Current Balance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 font-mono">
                @for (acc of api.chartOfAccounts(); track acc.id) {
                  <tr class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 pl-5 font-bold text-orange-400">{{ acc.code }}</td>
                    <td class="p-3.5 font-sans font-bold text-white">{{ acc.name }}</td>
                    <td class="p-3.5 font-sans">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-emerald-500/20]="acc.category === 'ASSET'"
                        [class.text-emerald-400]="acc.category === 'ASSET'"
                        [class.bg-amber-500/20]="acc.category === 'LIABILITY'"
                        [class.text-amber-400]="acc.category === 'LIABILITY'"
                        [class.bg-blue-500/20]="acc.category === 'INCOME'"
                        [class.text-blue-400]="acc.category === 'INCOME'"
                        [class.bg-rose-500/20]="acc.category === 'EXPENSE'"
                        [class.text-rose-400]="acc.category === 'EXPENSE'"
                        [class.bg-purple-500/20]="acc.category === 'EQUITY'"
                        [class.text-purple-400]="acc.category === 'EQUITY'"
                      >
                        {{ acc.category }}
                      </span>
                    </td>
                    <td class="p-3.5 font-sans text-slate-400 text-[11px]">{{ acc.description }}</td>
                    <td class="p-3.5 text-right pr-5 font-bold text-sm" [class.text-emerald-400]="acc.balance >= 0" [class.text-rose-400]="acc.balance < 0">
                      ₹{{ acc.balance | number }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 3: JOURNAL ENTRIES -->
      @if (activeTab() === 'JOURNAL') {
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl space-y-4 p-5">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <div class="space-y-0.5">
              <h3 class="text-sm font-bold text-white">Double-Entry Journal Vouchers</h3>
              <p class="text-xs text-slate-400">Strictly balanced: Sum of all debits equals sum of all credits.</p>
            </div>
            <button
              type="button"
              (click)="showJournalModal.set(true)"
              class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
            >
              + Create Voucher
            </button>
          </div>

          <div class="space-y-3">
            @for (entry of api.journalEntries(); track entry.id) {
              <div class="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs">
                  <div class="flex items-center gap-2 font-mono">
                    <span class="font-bold text-orange-400">{{ entry.entryNumber }}</span>
                    <span class="text-slate-500">•</span>
                    <span class="text-slate-400">{{ entry.date }}</span>
                    <span class="text-slate-500">•</span>
                    <span class="text-slate-300 font-sans font-semibold">{{ entry.memo }}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    POSTED & BALANCED
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  @for (line of entry.lines; track line.accountId) {
                    <div class="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between">
                      <span class="font-sans text-slate-300 truncate max-w-[200px]">{{ line.accountName }}</span>
                      <div class="space-x-3">
                        @if (line.debit > 0) {
                          <span class="text-emerald-400 font-bold">Dr ₹{{ line.debit | number }}</span>
                        }
                        @if (line.credit > 0) {
                          <span class="text-rose-400 font-bold">Cr ₹{{ line.credit | number }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- TAB 4: EXPENSES -->
      @if (activeTab() === 'EXPENSES') {
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
          <div class="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
              Operational Expense Log
            </h3>
            <button
              type="button"
              (click)="showExpenseModal.set(true)"
              class="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer"
            >
              + Add Expense
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
                <tr>
                  <th class="p-3.5 pl-5">Date</th>
                  <th class="p-3.5">Category</th>
                  <th class="p-3.5">Payee / Vendor</th>
                  <th class="p-3.5">Mode</th>
                  <th class="p-3.5">Notes</th>
                  <th class="p-3.5 text-right pr-5">Amount (₹)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (exp of api.expenses(); track exp.id) {
                  <tr class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 pl-5 font-mono text-slate-400">{{ exp.date }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {{ exp.category }}
                      </span>
                    </td>
                    <td class="p-3.5 font-bold text-white">{{ exp.payee }}</td>
                    <td class="p-3.5 font-mono text-slate-400">{{ exp.paymentMode }}</td>
                    <td class="p-3.5 text-slate-400 text-[11px]">{{ exp.notes }}</td>
                    <td class="p-3.5 text-right pr-5 font-mono font-bold text-rose-400 text-sm">
                      ₹{{ exp.amount | number }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 5: GOOGLE SHEETS API CREDENTIALS LINK & AUTOMATED ERP SYNC -->
      @if (activeTab() === 'GOOGLE_SHEETS_ERP') {
        @let creds = api.googleSheetsCredentials();
        <div class="space-y-6">
          <!-- Live API Status & Trigger Bar -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <mat-icon class="text-xs">sync_alt</mat-icon>
                  <span>Google Sheets API v4 Live Link</span>
                </div>
                <h2 class="text-lg font-bold text-white">Google Sheets API Credentials & ERP Sync Hub</h2>
                <p class="text-xs text-slate-400">
                  Link your Google Spreadsheet API credentials or Service Account to sync external inventory stock and affiliate tracking data into SHAKTI ERP.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  (click)="api.syncGoogleSheetsNow()"
                  class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition cursor-pointer"
                >
                  <mat-icon class="text-sm">sync</mat-icon>
                  <span>Sync Google Sheets Now</span>
                </button>
              </div>
            </div>

            <!-- Status Indicator Banner -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs">
              <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div class="text-[10px] text-slate-400 font-semibold uppercase">Linked Spreadsheet ID</div>
                <div class="font-mono text-emerald-300 font-bold truncate">{{ creds.spreadsheetId || 'Not Configured' }}</div>
                @if (creds.spreadsheetUrl) {
                  <a [href]="creds.spreadsheetUrl" target="_blank" class="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline">
                    <span>Open Sheet in Browser</span>
                    <mat-icon class="text-[10px]">open_in_new</mat-icon>
                  </a>
                }
              </div>

              <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div class="text-[10px] text-slate-400 font-semibold uppercase">Live Connection Status</div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full"
                    [class.bg-emerald-400]="creds.syncStatus === 'SUCCESS' || creds.syncStatus === 'IDLE'"
                    [class.bg-amber-400]="creds.syncStatus === 'SYNCING'"
                    [class.bg-rose-500]="creds.syncStatus === 'ERROR'"
                  ></span>
                  <span class="font-bold text-white uppercase text-[11px] font-mono">{{ creds.syncStatus }}</span>
                </div>
                <div class="text-[10px] text-slate-500">Auto-sync: Every {{ creds.autoSyncIntervalMins }} mins</div>
              </div>

              <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div class="text-[10px] text-slate-400 font-semibold uppercase">Last Successful Sync</div>
                <div class="font-mono text-slate-200 font-semibold text-[11px]">
                  {{ creds.lastSyncedAt ? creds.lastSyncedAt : 'Never Synced Yet' }}
                </div>
                <div class="text-[10px] text-slate-500">Target Tab: <code class="text-amber-300">{{ creds.sheetTabName }}</code></div>
              </div>
            </div>
          </div>

          <!-- Credentials & Column Mapping Form -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl">
            <div class="flex items-center gap-2 pb-2 border-b border-white/5">
              <mat-icon class="text-emerald-400 text-sm">key</mat-icon>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">
                Google Sheets API Credentials & Mapping Configuration
              </h3>
            </div>

            <form [formGroup]="sheetsForm" (ngSubmit)="saveSheetsCredentials()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="gs-url" class="block text-xs font-semibold text-slate-300 mb-1">Google Sheet Web Link / Share URL *</label>
                  <input
                    id="gs-url"
                    type="text"
                    formControlName="spreadsheetUrl"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                  />
                  <p class="text-[10px] text-slate-500 mt-1">Paste the full browser link to your inventory and affiliate tracking Google Sheet.</p>
                </div>

                <div>
                  <label for="gs-id" class="block text-xs font-semibold text-slate-300 mb-1">Extracted Spreadsheet ID</label>
                  <input
                    id="gs-id"
                    type="text"
                    formControlName="spreadsheetId"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 font-mono"
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label for="gs-key" class="block text-xs font-semibold text-slate-300 mb-1">Google Cloud API Key (Optional)</label>
                  <input
                    id="gs-key"
                    type="password"
                    formControlName="apiKey"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
                    placeholder="AIzaSyA..."
                  />
                  <p class="text-[10px] text-slate-500 mt-1">Required if sheet is restricted to API key access.</p>
                </div>

                <div>
                  <label for="gs-tab" class="block text-xs font-semibold text-slate-300 mb-1">Target Worksheet Tab Name</label>
                  <input
                    id="gs-tab"
                    type="text"
                    formControlName="sheetTabName"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    placeholder="Inventory_Affiliates_ERP"
                  />
                </div>

                <div>
                  <label for="gs-interval" class="block text-xs font-semibold text-slate-300 mb-1">Auto-Sync Schedule</label>
                  <select
                    id="gs-interval"
                    formControlName="autoSyncIntervalMins"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option [value]="15">Every 15 Minutes</option>
                    <option [value]="30">Every 30 Minutes</option>
                    <option [value]="60">Every 1 Hour</option>
                    <option [value]="0">Manual Trigger Only</option>
                  </select>
                </div>
              </div>

              <!-- Column Mapper Card -->
              <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                <div class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <mat-icon class="text-xs text-amber-400">view_column</mat-icon>
                  <span>Google Sheet Column Letter Mapping</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
                  <div>
                    <label for="col-sku" class="block text-[10px] text-slate-400 font-semibold uppercase">SKU Col</label>
                    <input id="col-sku" type="text" formControlName="skuCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-name" class="block text-[10px] text-slate-400 font-semibold uppercase">Name Col</label>
                    <input id="col-name" type="text" formControlName="nameCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-stock" class="block text-[10px] text-slate-400 font-semibold uppercase">Stock Col</label>
                    <input id="col-stock" type="text" formControlName="stockCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-cost" class="block text-[10px] text-slate-400 font-semibold uppercase">Cost Col</label>
                    <input id="col-cost" type="text" formControlName="costCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-price" class="block text-[10px] text-slate-400 font-semibold uppercase">Price Col</label>
                    <input id="col-price" type="text" formControlName="priceCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-aff" class="block text-[10px] text-slate-400 font-semibold uppercase">Affiliate ID</label>
                    <input id="col-aff" type="text" formControlName="affiliateIdCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                  <div>
                    <label for="col-comm" class="block text-[10px] text-slate-400 font-semibold uppercase">Commission</label>
                    <input id="col-comm" type="text" formControlName="commissionCol" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 text-center uppercase font-mono font-bold" />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <mat-icon class="text-sm">save</mat-icon>
                  <span>Save Google Sheets Credentials & Mappings</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Apps Script Code Snippet Generator Card -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-3 shadow-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <mat-icon class="text-sm">code</mat-icon>
                <span>Google Apps Script Webhook Snippet (Paste into Google Sheets > Extensions > Apps Script)</span>
              </div>
              <button
                type="button"
                (click)="copyAppsScriptCode()"
                class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <mat-icon class="text-xs">content_copy</mat-icon>
                <span>Copy Apps Script</span>
              </button>
            </div>

            <pre class="p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-400/90 overflow-x-auto select-all leading-relaxed max-h-56">
// In your Google Sheet: Go to Extensions &gt; Apps Script and paste this snippet:
function syncSheetToShaktiERP() {{ '{' }}
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length &lt;= 1) return;
  
  var rows = data.slice(1);
  var payload = {{ '{' }}
    sheetName: sheet.getName(),
    rows: rows
  {{ '}' }};
  
  var options = {{ '{' }}
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  {{ '}' }};
  
  var response = UrlFetchApp.fetch('https://ais-dev-2yop7ebq6tc4sk4x2hawez-822850197075.asia-east1.run.app/api/erp/google-sheets-sync', options);
  Logger.log(response.getContentText());
{{ '}' }}
</pre>
          </div>
        </div>
      }

      <!-- New Journal Entry Modal -->
      @if (showJournalModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-400">add_card</mat-icon>
                <h2 class="text-sm font-bold text-white">Create Balanced Journal Voucher</h2>
              </div>
              <button
                type="button"
                (click)="showJournalModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="journalForm" (ngSubmit)="submitJournal()" class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="jv-date" class="block text-[11px] font-semibold text-slate-400">Voucher Date</label>
                  <input
                    id="jv-date"
                    type="date"
                    formControlName="date"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label for="jv-ref" class="block text-[11px] font-semibold text-slate-400">Reference / Invoice #</label>
                  <input
                    id="jv-ref"
                    type="text"
                    formControlName="reference"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    placeholder="e.g. INV-2026-004"
                  />
                </div>
              </div>

              <div>
                <label for="jv-memo" class="block text-[11px] font-semibold text-slate-400">Description / Memo *</label>
                <input
                  id="jv-memo"
                  type="text"
                  formControlName="memo"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="e.g. Purchase of spice packaging materials"
                />
              </div>

              <!-- Debit Account -->
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Debit Leg (Dr)</div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="jv-dr-acc" class="block text-[10px] text-slate-400">Select Debit Account</label>
                    <select
                      id="jv-dr-acc"
                      formControlName="drAccountId"
                      class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      @for (acc of api.chartOfAccounts(); track acc.id) {
                        <option [value]="acc.id">{{ acc.code }} - {{ acc.name }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label for="jv-dr-amt" class="block text-[10px] text-slate-400">Debit Amount (₹)</label>
                    <input
                      id="jv-dr-amt"
                      type="number"
                      formControlName="drAmount"
                      class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <!-- Credit Account -->
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div class="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Credit Leg (Cr)</div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="jv-cr-acc" class="block text-[10px] text-slate-400">Select Credit Account</label>
                    <select
                      id="jv-cr-acc"
                      formControlName="crAccountId"
                      class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      @for (acc of api.chartOfAccounts(); track acc.id) {
                        <option [value]="acc.id">{{ acc.code }} - {{ acc.name }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label for="jv-cr-amt" class="block text-[10px] text-slate-400">Credit Amount (₹)</label>
                    <input
                      id="jv-cr-amt"
                      type="number"
                      formControlName="crAmount"
                      class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showJournalModal.set(false)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="journalForm.invalid || journalForm.value.drAmount !== journalForm.value.crAmount"
                  class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Post Voucher (₹{{ journalForm.value.drAmount }})
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Record Expense Modal -->
      @if (showExpenseModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-orange-400">receipt_long</mat-icon>
                <h2 class="text-sm font-bold text-white">Record Operating Expense</h2>
              </div>
              <button
                type="button"
                (click)="showExpenseModal.set(false)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="expenseForm" (ngSubmit)="submitExpense()" class="space-y-3">
              <div>
                <label for="exp-cat" class="block text-[11px] font-semibold text-slate-400">Expense Category</label>
                <select
                  id="exp-cat"
                  formControlName="category"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="PACKAGING">Packaging & Boxes</option>
                  <option value="DELIVERY">Delivery & Courier Freight</option>
                  <option value="RENT">Warehouse & Store Rent</option>
                  <option value="ELECTRICITY">Electricity & Mill Power</option>
                  <option value="STAFF_SALARY">Staff Salary & Wages</option>
                  <option value="MARKETING">Digital Marketing & Ads</option>
                  <option value="SOFTWARE">Software & Cloud Services</option>
                  <option value="OTHER">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label for="exp-payee" class="block text-[11px] font-semibold text-slate-400">Payee / Vendor Name *</label>
                <input
                  id="exp-payee"
                  type="text"
                  formControlName="payee"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="e.g. Burrabazar Corrugators"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="exp-amount" class="block text-[11px] font-semibold text-slate-400">Total Amount (₹) *</label>
                  <input
                    id="exp-amount"
                    type="number"
                    formControlName="amount"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label for="exp-mode" class="block text-[11px] font-semibold text-slate-400">Payment Mode</label>
                  <select
                    id="exp-mode"
                    formControlName="paymentMode"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="BANK">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash Voucher</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="exp-notes" class="block text-[11px] font-semibold text-slate-400">Notes / Remarks</label>
                <input
                  id="exp-notes"
                  type="text"
                  formControlName="notes"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="e.g. 500 corrugated boxes for spice pouch dispatch"
                />
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showExpenseModal.set(false)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="expenseForm.invalid"
                  class="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Book in General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class ErpView {
  readonly api = inject(ShaktiApi);

  readonly activeTab = signal<ErpTab>('OVERVIEW_PL');
  readonly showJournalModal = signal<boolean>(false);
  readonly showExpenseModal = signal<boolean>(false);

  readonly journalForm = new FormGroup({
    date: new FormControl<string>(new Date().toISOString().split('T')[0], { nonNullable: true }),
    reference: new FormControl<string>('JV-MANUAL-01', { nonNullable: true }),
    memo: new FormControl<string>('Inventory revaluation adjustment', { nonNullable: true, validators: [Validators.required] }),
    drAccountId: new FormControl<string>('acc-inv', { nonNullable: true }),
    drAmount: new FormControl<number>(1000, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    crAccountId: new FormControl<string>('acc-cash', { nonNullable: true }),
    crAmount: new FormControl<number>(1000, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
  });

  readonly expenseForm = new FormGroup({
    category: new FormControl<ExpenseCategory>('PACKAGING', { nonNullable: true }),
    payee: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number>(500, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    paymentMode: new FormControl<'BANK' | 'CASH' | 'UPI'>('UPI', { nonNullable: true }),
    notes: new FormControl<string>('', { nonNullable: true }),
  });

  readonly sheetsForm = new FormGroup({
    spreadsheetUrl: new FormControl<string>('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit', { nonNullable: true }),
    spreadsheetId: new FormControl<string>('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', { nonNullable: true }),
    apiKey: new FormControl<string>('', { nonNullable: true }),
    sheetTabName: new FormControl<string>('Inventory_Affiliates_ERP', { nonNullable: true }),
    autoSyncIntervalMins: new FormControl<number>(30, { nonNullable: true }),
    skuCol: new FormControl<string>('A', { nonNullable: true }),
    nameCol: new FormControl<string>('B', { nonNullable: true }),
    stockCol: new FormControl<string>('C', { nonNullable: true }),
    costCol: new FormControl<string>('D', { nonNullable: true }),
    priceCol: new FormControl<string>('E', { nonNullable: true }),
    affiliateIdCol: new FormControl<string>('F', { nonNullable: true }),
    commissionCol: new FormControl<string>('G', { nonNullable: true }),
  });

  async saveSheetsCredentials() {
    const v = this.sheetsForm.getRawValue();
    await this.api.saveGoogleSheetsCredentials({
      spreadsheetUrl: v.spreadsheetUrl,
      spreadsheetId: v.spreadsheetId,
      apiKey: v.apiKey,
      sheetTabName: v.sheetTabName,
      autoSyncIntervalMins: v.autoSyncIntervalMins,
      columnMapping: {
        skuCol: v.skuCol,
        nameCol: v.nameCol,
        stockCol: v.stockCol,
        costCol: v.costCol,
        priceCol: v.priceCol,
        affiliateIdCol: v.affiliateIdCol,
        commissionCol: v.commissionCol,
      },
    });
  }

  async submitJournal() {
    if (this.journalForm.invalid) return;
    const v = this.journalForm.getRawValue();

    if (v.drAmount !== v.crAmount) {
      this.api.showToast('Voucher not balanced: Debits must equal Credits', 'error');
      return;
    }

    const drAccount = this.api.chartOfAccounts().find((a) => a.id === v.drAccountId);
    const crAccount = this.api.chartOfAccounts().find((a) => a.id === v.crAccountId);

    const lines: JournalLine[] = [
      {
        accountId: v.drAccountId,
        accountName: drAccount?.name || 'Debit Account',
        accountCode: drAccount?.code || '1000',
        debit: Number(v.drAmount),
        credit: 0,
      },
      {
        accountId: v.crAccountId,
        accountName: crAccount?.name || 'Credit Account',
        accountCode: crAccount?.code || '2000',
        debit: 0,
        credit: Number(v.crAmount),
      },
    ];

    await this.api.postJournalEntry({
      date: v.date,
      memo: v.memo,
      reference: v.reference,
      lines,
    });

    this.showJournalModal.set(false);
  }

  async submitExpense() {
    if (this.expenseForm.invalid) return;
    const v = this.expenseForm.getRawValue();

    await this.api.createExpense({
      category: v.category,
      payee: v.payee,
      amount: Number(v.amount),
      gstAmount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMode: v.paymentMode,
      notes: v.notes,
    });

    this.showExpenseModal.set(false);
  }

  copyAppsScriptCode(): void {
    const code = `function syncSheetToShaktiERP() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;
  var rows = data.slice(1);
  var payload = { sheetName: sheet.getName(), rows: rows };
  var options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
  UrlFetchApp.fetch('https://ais-dev-2yop7ebq6tc4sk4x2hawez-822850197075.asia-east1.run.app/api/erp/google-sheets-sync', options);
}`;
    navigator.clipboard.writeText(code);
    this.api.showToast('Apps Script code copied! Paste it in Google Sheets > Extensions > Apps Script', 'info');
  }
}
