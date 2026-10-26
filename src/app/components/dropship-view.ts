import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { DropshipRecord } from '../models/shakti.models';

@Component({
  selector: 'app-dropship-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <mat-icon class="text-xs">swap_horiz</mat-icon>
            <span>B2B Supplier Logistics & Orders</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Dropshipping Fulfillment Hub
          </h1>
          <p class="text-xs text-slate-400">
            Map Saarthi customer orders directly to third-party manufacturers, monitor supplier margins, and route shipping slips.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="selectedViewTab.set('ORDERS')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            [class.bg-blue-600]="selectedViewTab() === 'ORDERS'"
            [class.text-white]="selectedViewTab() === 'ORDERS'"
            [class.bg-slate-800]="selectedViewTab() !== 'ORDERS'"
            [class.text-slate-300]="selectedViewTab() !== 'ORDERS'"
          >
            Dropship POs ({{ api.dropshipOrders().length }})
          </button>
          <button
            type="button"
            (click)="selectedViewTab.set('SUPPLIERS')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            [class.bg-blue-600]="selectedViewTab() === 'SUPPLIERS'"
            [class.text-white]="selectedViewTab() === 'SUPPLIERS'"
            [class.bg-slate-800]="selectedViewTab() !== 'SUPPLIERS'"
            [class.text-slate-300]="selectedViewTab() !== 'SUPPLIERS'"
          >
            Supplier Directory ({{ api.suppliers().length }})
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Dropship POs</div>
          <div class="text-xl font-bold text-white font-mono">{{ api.dropshipOrders().length }}</div>
          <div class="text-[10px] text-slate-500">Automated supplier routing</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Customer Value</div>
          <div class="text-xl font-bold text-emerald-400 font-mono">₹{{ totalCustomerRevenue() | number }}</div>
          <div class="text-[10px] text-slate-500">Gross customer charges</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Supplier Cost (Payable)</div>
          <div class="text-xl font-bold text-amber-400 font-mono">₹{{ totalSupplierCost() | number }}</div>
          <div class="text-[10px] text-slate-500">Owed to vendors</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Retained Margin</div>
          <div class="text-xl font-bold text-blue-400 font-mono">₹{{ totalMargin() | number }}</div>
          <div class="text-[10px] text-blue-400/80">Average ~32% margin</div>
        </div>
      </div>

      <!-- View: Dropship POs -->
      @if (selectedViewTab() === 'ORDERS') {
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
          <div class="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
              Customer Order to Supplier Purchase Order Routing
            </h3>
            <span class="text-[11px] text-slate-400 font-mono">
              Zero-inventory cross-docking
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
                <tr>
                  <th class="p-3.5 pl-5">Customer Order & PO Ref</th>
                  <th class="p-3.5">Item & Qty</th>
                  <th class="p-3.5">Assigned Supplier</th>
                  <th class="p-3.5">Supplier Cost</th>
                  <th class="p-3.5">Customer Price</th>
                  <th class="p-3.5">Net Margin</th>
                  <th class="p-3.5">Supplier Status</th>
                  <th class="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 font-mono">
                @if (api.dropshipOrders().length === 0) {
                  <tr>
                    <td colspan="8" class="p-12 text-center text-slate-500 font-sans">
                      <mat-icon class="text-4xl text-slate-600 mb-1">swap_horiz</mat-icon>
                      <p class="font-medium text-slate-400">No dropship orders recorded yet.</p>
                      <p class="text-xs text-slate-500">When customers purchase kitchenware or partner items, POs appear here automatically.</p>
                    </td>
                  </tr>
                } @else {
                  @for (record of api.dropshipOrders(); track record.id) {
                    <tr class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 pl-5 font-sans">
                        <div class="space-y-0.5">
                          <div class="font-bold text-white font-mono">{{ record.orderNumber }}</div>
                          <div class="text-[10px] text-blue-400 font-mono">PO: {{ record.supplierOrderRef }}</div>
                        </div>
                      </td>

                      <td class="p-3.5 font-sans">
                        <div class="space-y-0.5">
                          <div class="font-semibold text-slate-200">{{ record.productName }}</div>
                          <div class="text-[10px] text-slate-500 font-mono">Qty: {{ record.quantity }}</div>
                        </div>
                      </td>

                      <td class="p-3.5 font-sans text-slate-300 font-medium">
                        {{ record.supplierName }}
                      </td>

                      <td class="p-3.5 text-amber-400 font-semibold">
                        ₹{{ record.supplierCost | number }}
                      </td>

                      <td class="p-3.5 text-white font-semibold">
                        ₹{{ record.customerPrice | number }}
                      </td>

                      <td class="p-3.5 text-emerald-400 font-bold">
                        ₹{{ record.estimatedMargin | number }}
                      </td>

                      <td class="p-3.5 font-sans">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          [class.bg-blue-500/20]="record.supplierStatus === 'PROCESSING' || record.supplierStatus === 'SHIPPED'"
                          [class.text-blue-400]="record.supplierStatus === 'PROCESSING' || record.supplierStatus === 'SHIPPED'"
                          [class.bg-emerald-500/20]="record.supplierStatus === 'DELIVERED'"
                          [class.text-emerald-400]="record.supplierStatus === 'DELIVERED'"
                          [class.bg-amber-500/20]="record.supplierStatus === 'PLACED' || record.supplierStatus === 'PENDING_REVIEW'"
                          [class.text-amber-400]="record.supplierStatus === 'PLACED' || record.supplierStatus === 'PENDING_REVIEW'"
                        >
                          {{ record.supplierStatus }}
                        </span>
                      </td>

                      <td class="p-3.5 text-right pr-5 font-sans">
                        <div class="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            (click)="toggleSupplierPaid(record)"
                            class="px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                            [class.bg-emerald-500/20]="record.supplierPaid"
                            [class.text-emerald-400]="record.supplierPaid"
                            [class.bg-slate-800]="!record.supplierPaid"
                            [class.text-slate-400]="!record.supplierPaid"
                            title="Toggle Supplier Payment Status"
                          >
                            {{ record.supplierPaid ? 'Supplier Paid' : 'Mark Paid' }}
                          </button>
                          <button
                            type="button"
                            (click)="openEditModal(record)"
                            class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            title="Edit Supplier PO"
                          >
                            <mat-icon class="text-sm">edit</mat-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <!-- View: Supplier Directory -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          @for (supplier of api.suppliers(); track supplier.id) {
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-base font-bold text-white">{{ supplier.name }}</h3>
                  <p class="text-xs text-slate-400">{{ supplier.contactPerson }} ({{ supplier.city }})</p>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  ★ {{ supplier.rating }}
                </span>
              </div>

              <div class="space-y-1.5 text-xs text-slate-300">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">Phone:</span>
                  <span class="font-mono">{{ supplier.phone }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">GSTIN:</span>
                  <span class="font-mono text-amber-400">{{ supplier.gstin || 'Unregistered' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">Lead Time:</span>
                  <span>{{ supplier.leadTimeDays }} business days</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-500">Supplied SKUs:</span>
                  <span class="font-bold">{{ supplier.productsSupplied }} items</span>
                </div>
              </div>

              <div class="pt-3 border-t border-white/5 flex items-center justify-between">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Status: {{ supplier.status }}
                </span>
                <span class="text-[10px] text-blue-400">Verified Partner</span>
              </div>
            </div>
          }
        </div>
      }

      <!-- Edit Dropship Modal -->
      @if (activeRecord()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 class="text-sm font-bold text-white">Update Dropship Order {{ activeRecord()?.supplierOrderRef }}</h3>
              <button
                type="button"
                (click)="activeRecord.set(null)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="dropshipForm" (ngSubmit)="saveRecordUpdate()" class="space-y-3">
              <div>
                <label for="ds-status" class="block text-[11px] font-semibold text-slate-400">Supplier Status</label>
                <select
                  id="ds-status"
                  formControlName="supplierStatus"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="PLACED">Placed with Factory</option>
                  <option value="PROCESSING">Manufacturing / Packing</option>
                  <option value="SHIPPED">Dispatched by Supplier</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <div>
                <label for="ds-track" class="block text-[11px] font-semibold text-slate-400">Supplier Tracking / AWB</label>
                <input
                  id="ds-track"
                  type="text"
                  formControlName="trackingNumber"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  placeholder="e.g. BLUEDART-992144"
                />
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="activeRecord.set(null)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class DropshipView {
  readonly api = inject(ShaktiApi);

  readonly selectedViewTab = signal<'ORDERS' | 'SUPPLIERS'>('ORDERS');
  readonly activeRecord = signal<DropshipRecord | null>(null);

  readonly dropshipForm = new FormGroup({
    supplierStatus: new FormControl<string>('PROCESSING', { nonNullable: true }),
    trackingNumber: new FormControl<string>('', { nonNullable: true }),
  });

  totalCustomerRevenue(): number {
    return this.api.dropshipOrders().reduce((sum, r) => sum + r.customerPrice, 0);
  }

  totalSupplierCost(): number {
    return this.api.dropshipOrders().reduce((sum, r) => sum + r.supplierCost, 0);
  }

  totalMargin(): number {
    return this.api.dropshipOrders().reduce((sum, r) => sum + r.estimatedMargin, 0);
  }

  async toggleSupplierPaid(record: DropshipRecord) {
    await this.api.updateDropship(record.id, {
      supplierPaid: !record.supplierPaid,
    });
  }

  openEditModal(record: DropshipRecord) {
    this.activeRecord.set(record);
    this.dropshipForm.setValue({
      supplierStatus: record.supplierStatus,
      trackingNumber: record.trackingNumber || '',
    });
  }

  async saveRecordUpdate() {
    const record = this.activeRecord();
    if (!record) return;
    const v = this.dropshipForm.getRawValue();

    await this.api.updateDropship(record.id, {
      supplierStatus: v.supplierStatus as DropshipRecord['supplierStatus'],
      trackingNumber: v.trackingNumber,
    });

    this.activeRecord.set(null);
  }
}
