import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { Order, OrderStatus } from '../models/shakti.models';

@Component({
  selector: 'app-orders-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <mat-icon class="text-xs">local_shipping</mat-icon>
            <span>Fulfillment & Dispatch Hub</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Orders, Shipping & Returns
          </h1>
          <p class="text-xs text-slate-400">
            Track customer orders, update tracking numbers, generate dispatch invoices, and manage verified refunds.
          </p>
        </div>

        <button
          type="button"
          (click)="exportOrdersCsv()"
          class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <mat-icon class="text-sm">file_download</mat-icon>
          <span>Export Order Report</span>
        </button>
      </div>

      <!-- Metrics Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Booked</div>
          <div class="text-xl font-bold text-white font-mono">{{ api.orders().length }}</div>
          <div class="text-[10px] text-slate-500">All-time lifetime orders</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Processing</div>
          <div class="text-xl font-bold text-amber-400 font-mono">{{ countByStatus('PROCESSING') + countByStatus('PAID') }}</div>
          <div class="text-[10px] text-amber-500/80">Awaiting dispatch</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Transit</div>
          <div class="text-xl font-bold text-blue-400 font-mono">{{ countByStatus('SHIPPED') }}</div>
          <div class="text-[10px] text-blue-400/80">With courier partner</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Refunded</div>
          <div class="text-xl font-bold text-purple-400 font-mono">{{ countByStatus('REFUNDED') }}</div>
          <div class="text-[10px] text-slate-500">Processed in ledger</div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 flex flex-wrap items-center justify-between gap-3">
        <!-- Status Filters -->
        <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            (click)="selectedFilter.set('ALL')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-orange-500]="selectedFilter() === 'ALL'"
            [class.text-white]="selectedFilter() === 'ALL'"
            [class.text-slate-400]="selectedFilter() !== 'ALL'"
          >
            All ({{ api.orders().length }})
          </button>
          <button
            type="button"
            (click)="selectedFilter.set('PAID')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-emerald-600]="selectedFilter() === 'PAID'"
            [class.text-white]="selectedFilter() === 'PAID'"
            [class.text-slate-400]="selectedFilter() !== 'PAID'"
          >
            Paid
          </button>
          <button
            type="button"
            (click)="selectedFilter.set('PROCESSING')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-amber-600]="selectedFilter() === 'PROCESSING'"
            [class.text-white]="selectedFilter() === 'PROCESSING'"
            [class.text-slate-400]="selectedFilter() !== 'PROCESSING'"
          >
            Processing
          </button>
          <button
            type="button"
            (click)="selectedFilter.set('SHIPPED')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-blue-600]="selectedFilter() === 'SHIPPED'"
            [class.text-white]="selectedFilter() === 'SHIPPED'"
            [class.text-slate-400]="selectedFilter() !== 'SHIPPED'"
          >
            Shipped
          </button>
          <button
            type="button"
            (click)="selectedFilter.set('REFUNDED')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-purple-600]="selectedFilter() === 'REFUNDED'"
            [class.text-white]="selectedFilter() === 'REFUNDED'"
            [class.text-slate-400]="selectedFilter() !== 'REFUNDED'"
          >
            Refunded
          </button>
        </div>

        <!-- Search Input -->
        <div class="flex items-center gap-2 flex-1 max-w-sm bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
          <mat-icon class="text-slate-400 text-sm">search</mat-icon>
          <input
            type="text"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            placeholder="Search order #, customer, city..."
            class="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- Orders List / Table -->
      <div class="space-y-4">
        @if (filteredOrders().length === 0) {
          <div class="p-12 text-center text-slate-500 rounded-2xl bg-[#0f1523] border border-white/5">
            <mat-icon class="text-4xl text-slate-600 mb-1">local_shipping</mat-icon>
            <p class="font-medium text-slate-400">No orders match current criteria.</p>
          </div>
        } @else {
          @for (order of filteredOrders(); track order.id) {
            <div class="rounded-2xl bg-[#0f1523] border border-white/5 p-5 shadow-xl space-y-4 hover:border-slate-700 transition">
              <!-- Top Row: Order Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="text-sm font-extrabold text-white font-mono">{{ order.orderNumber }}</span>
                  <span class="text-slate-500">•</span>
                  <span class="text-xs text-slate-400">{{ order.createdAt | date: 'medium' }}</span>

                  <!-- Fulfilment Status Badge -->
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    [class.bg-emerald-950]="order.status === 'PAID' || order.status === 'DELIVERED'"
                    [class.text-emerald-400]="order.status === 'PAID' || order.status === 'DELIVERED'"
                    [class.border-emerald-500/30]="order.status === 'PAID' || order.status === 'DELIVERED'"
                    [class.bg-amber-950]="order.status === 'PROCESSING'"
                    [class.text-amber-400]="order.status === 'PROCESSING'"
                    [class.bg-blue-950]="order.status === 'SHIPPED'"
                    [class.text-blue-400]="order.status === 'SHIPPED'"
                    [class.bg-purple-950]="order.status === 'REFUNDED'"
                    [class.text-purple-400]="order.status === 'REFUNDED'"
                  >
                    Fulfillment: {{ order.status }}
                  </span>

                  <!-- Payment Status Badge -->
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                    [class.bg-emerald-500/10]="order.paymentStatus === 'PAID'"
                    [class.text-emerald-400]="order.paymentStatus === 'PAID'"
                    [class.bg-amber-500/10]="order.paymentStatus === 'PENDING' || order.paymentStatus === 'COD'"
                    [class.text-amber-400]="order.paymentStatus === 'PENDING' || order.paymentStatus === 'COD'"
                    [class.bg-rose-500/10]="order.paymentStatus === 'REFUNDED'"
                    [class.text-rose-400]="order.paymentStatus === 'REFUNDED'"
                  >
                    Payment: {{ order.paymentStatus }} ({{ order.paymentMethod }})
                  </span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="openStatusModal(order)"
                    class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <mat-icon class="text-xs">edit</mat-icon>
                    <span>Update Status & Tracking</span>
                  </button>

                  @if (order.status !== 'REFUNDED' && order.paymentStatus === 'PAID') {
                    <button
                      type="button"
                      (click)="openRefundModal(order)"
                      class="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <mat-icon class="text-xs">assignment_return</mat-icon>
                      <span>Process Refund</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Middle: Items & Customer Details -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Customer & Destination -->
                <div class="space-y-1">
                  <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer & Destination</div>
                  <div class="text-xs font-bold text-white">{{ order.customerName }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{{ order.customerPhone }}</div>
                  <div class="text-[11px] text-slate-400 leading-snug">
                    {{ order.shippingAddress.street }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} - {{ order.shippingAddress.pincode }}
                  </div>
                </div>

                <!-- Items Ordered -->
                <div class="space-y-1.5 md:col-span-1">
                  <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Purchased Items</div>
                  <div class="space-y-1 max-h-28 overflow-y-auto pr-1">
                    @for (item of order.items; track item.productId) {
                      <div class="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
                        <span class="truncate max-w-[160px] text-slate-200">{{ item.productName }} &times; {{ item.quantity }}</span>
                        <span class="font-mono text-white shrink-0">₹{{ item.subtotal | number }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Financial & Shipping Tracking -->
                <div class="space-y-1 md:text-right font-mono">
                  <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">Financial & Logistics</div>
                  <div class="text-base font-extrabold text-orange-400">₹{{ order.grandTotal | number }}</div>
                  <div class="text-[10px] text-slate-400">Tax included: ₹{{ order.taxTotal | number }}</div>
                  @if (order.trackingNumber) {
                    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px]">
                      <mat-icon class="text-xs">local_shipping</mat-icon>
                      <span>{{ order.carrier || 'Delhivery' }}: {{ order.trackingNumber }}</span>
                    </div>
                  } @else {
                    <div class="text-[10px] text-amber-400 font-sans">Pending Carrier Pickup</div>
                  }
                </div>
              </div>

              <!-- Refund notes if refunded -->
              @if (order.status === 'REFUNDED') {
                <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-sm">receipt_long</mat-icon>
                    <span>Refund of ₹{{ order.refundAmount || order.grandTotal }} completed. Ledger voucher generated.</span>
                  </div>
                  <span class="text-[10px] font-mono text-purple-400">{{ order.returnReason || 'Customer return' }}</span>
                </div>
              }
            </div>
          }
        }
      </div>

      <!-- Update Status & Tracking Modal -->
      @if (activeOrderForEdit()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-blue-400">local_shipping</mat-icon>
                <h2 class="text-sm font-bold text-white">Update {{ activeOrderForEdit()?.orderNumber }}</h2>
              </div>
              <button
                type="button"
                (click)="activeOrderForEdit.set(null)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="statusForm" (ngSubmit)="saveStatusUpdate()" class="space-y-3">
              <div>
                <label for="ord-stat" class="block text-[11px] font-semibold text-slate-400">Fulfillment Status</label>
                <select
                  id="ord-stat"
                  formControlName="status"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="PAID">Paid (Awaiting Processing)</option>
                  <option value="PROCESSING">Processing & Packed</option>
                  <option value="SHIPPED">Shipped / In Transit</option>
                  <option value="DELIVERED">Delivered to Customer</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label for="ord-carrier" class="block text-[11px] font-semibold text-slate-400">Carrier / Courier Partner</label>
                <input
                  id="ord-carrier"
                  type="text"
                  formControlName="carrier"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="e.g. Delhivery, BlueDart, DTDC"
                />
              </div>

              <div>
                <label for="ord-track" class="block text-[11px] font-semibold text-slate-400">Tracking / AWB Number</label>
                <input
                  id="ord-track"
                  type="text"
                  formControlName="trackingNumber"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  placeholder="e.g. DEL-8899201"
                />
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="activeOrderForEdit.set(null)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Dispatch Details
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Process Refund Modal -->
      @if (activeOrderForRefund()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-rose-400">assignment_return</mat-icon>
                <h2 class="text-sm font-bold text-white">Process Refund for {{ activeOrderForRefund()?.orderNumber }}</h2>
              </div>
              <button
                type="button"
                (click)="activeOrderForRefund.set(null)"
                class="text-slate-400 hover:text-white"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <div class="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <div class="font-bold">Accounting Automated Action</div>
              <p class="text-[11px] text-slate-400">
                Processing this refund will automatically restore inventory and post a balanced double-entry reversal voucher in the Saarthi general ledger.
              </p>
            </div>

            <form [formGroup]="refundForm" (ngSubmit)="submitRefund()" class="space-y-3">
              <div>
                <label for="ref-amount" class="block text-[11px] font-semibold text-slate-400">Refund Amount (₹)</label>
                <input
                  id="ref-amount"
                  type="number"
                  formControlName="amount"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label for="ref-reason" class="block text-[11px] font-semibold text-slate-400">Return / Refund Reason *</label>
                <textarea
                  id="ref-reason"
                  rows="2"
                  formControlName="reason"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="e.g. Package damaged in courier transit or customer requested cancellation"
                ></textarea>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="activeOrderForRefund.set(null)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="refundForm.invalid"
                  class="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm & Reverse In Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class OrdersView {
  readonly api = inject(ShaktiApi);

  readonly searchQuery = signal<string>('');
  readonly selectedFilter = signal<string>('ALL');
  readonly activeOrderForEdit = signal<Order | null>(null);
  readonly activeOrderForRefund = signal<Order | null>(null);

  readonly statusForm = new FormGroup({
    status: new FormControl<OrderStatus>('PROCESSING', { nonNullable: true }),
    carrier: new FormControl<string>('Delhivery', { nonNullable: true }),
    trackingNumber: new FormControl<string>('', { nonNullable: true }),
  });

  readonly refundForm = new FormGroup({
    amount: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    reason: new FormControl<string>('Customer returned goods in sealed condition', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSearchInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  filteredOrders(): Order[] {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();

    return this.api.orders().filter((o) => {
      const matchFilter = filter === 'ALL' || o.status === filter;
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }

  countByStatus(status: OrderStatus): number {
    return this.api.orders().filter((o) => o.status === status).length;
  }

  openStatusModal(order: Order) {
    this.activeOrderForEdit.set(order);
    this.statusForm.setValue({
      status: order.status,
      carrier: order.carrier || 'Delhivery',
      trackingNumber: order.trackingNumber || '',
    });
  }

  openRefundModal(order: Order) {
    this.activeOrderForRefund.set(order);
    this.refundForm.setValue({
      amount: order.grandTotal,
      reason: 'Customer return accepted at warehouse',
    });
  }

  async saveStatusUpdate() {
    const order = this.activeOrderForEdit();
    if (!order) return;
    const v = this.statusForm.getRawValue();

    await this.api.updateOrderStatus(order.id, {
      status: v.status,
      carrier: v.carrier,
      trackingNumber: v.trackingNumber,
    });

    this.activeOrderForEdit.set(null);
  }

  async submitRefund() {
    const order = this.activeOrderForRefund();
    if (!order || this.refundForm.invalid) return;
    const v = this.refundForm.getRawValue();

    await this.api.refundOrder(order.id, v.reason, Number(v.amount));
    this.activeOrderForRefund.set(null);
  }

  exportOrdersCsv() {
    const rows = [
      ['Order Number', 'Date', 'Customer', 'City', 'Grand Total', 'Status', 'Payment', 'Carrier', 'Tracking'].join(','),
      ...this.api.orders().map((o) =>
        [
          `"${o.orderNumber}"`,
          `"${o.createdAt}"`,
          `"${o.customerName.replace(/"/g, '""')}"`,
          `"${o.shippingAddress.city}"`,
          o.grandTotal,
          `"${o.status}"`,
          `"${o.paymentStatus}"`,
          `"${o.carrier || ''}"`,
          `"${o.trackingNumber || ''}"`,
        ].join(','),
      ),
    ];

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.api.showToast('Orders exported to CSV', 'success');
  }
}
