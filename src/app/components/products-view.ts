import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { Product, ProductSourceType, ProductStatus } from '../models/shakti.models';

@Component({
  selector: 'app-products-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header & Action Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <mat-icon class="text-xs">inventory_2</mat-icon>
            <span>Product Master & Stock Registry</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Inventory & Catalog Management
          </h1>
          <p class="text-xs text-slate-400">
            Saarthi Enterprise catalog covering own stone-ground spices, dropship kitchenware, and affiliate culinary appliances.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            (click)="exportCsv()"
            class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">file_download</mat-icon>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            (click)="showAddModal.set(true)"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm">add_circle</mat-icon>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total SKUs</div>
          <div class="text-xl font-bold text-white font-mono">{{ api.products().length }}</div>
          <div class="text-[10px] text-slate-500">Active catalog items</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Own Spices</div>
          <div class="text-xl font-bold text-emerald-400 font-mono">{{ countBySource('OWN_PRODUCT') }}</div>
          <div class="text-[10px] text-slate-500">Directly manufactured</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dropship Items</div>
          <div class="text-xl font-bold text-blue-400 font-mono">{{ countBySource('DROPSHIP') }}</div>
          <div class="text-[10px] text-slate-500">Fulfilled by partners</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Low Stock (&lt; 25)</div>
          <div class="text-xl font-bold text-amber-400 font-mono">{{ lowStockCount() }}</div>
          <div class="text-[10px] text-amber-500/80">Needs restock soon</div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 flex flex-wrap items-center justify-between gap-3">
        <!-- Source Type Filter Tabs -->
        <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            (click)="selectedSource.set('ALL')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            [class.bg-orange-500]="selectedSource() === 'ALL'"
            [class.text-white]="selectedSource() === 'ALL'"
            [class.text-slate-400]="selectedSource() !== 'ALL'"
          >
            All Sources ({{ api.products().length }})
          </button>
          <button
            type="button"
            (click)="selectedSource.set('OWN_PRODUCT')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            [class.bg-emerald-600]="selectedSource() === 'OWN_PRODUCT'"
            [class.text-white]="selectedSource() === 'OWN_PRODUCT'"
            [class.text-slate-400]="selectedSource() !== 'OWN_PRODUCT'"
          >
            <span>🌿 Own Spices</span>
          </button>
          <button
            type="button"
            (click)="selectedSource.set('DROPSHIP')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            [class.bg-blue-600]="selectedSource() === 'DROPSHIP'"
            [class.text-white]="selectedSource() === 'DROPSHIP'"
            [class.text-slate-400]="selectedSource() !== 'DROPSHIP'"
          >
            <span>📦 Dropship</span>
          </button>
          <button
            type="button"
            (click)="selectedSource.set('AFFILIATE')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            [class.bg-purple-600]="selectedSource() === 'AFFILIATE'"
            [class.text-white]="selectedSource() === 'AFFILIATE'"
            [class.text-slate-400]="selectedSource() !== 'AFFILIATE'"
          >
            <span>⚡ Affiliate</span>
          </button>
        </div>

        <!-- Search Input -->
        <div class="flex items-center gap-2 flex-1 max-w-sm bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
          <mat-icon class="text-slate-400 text-sm">search</mat-icon>
          <input
            type="text"
            [value]="searchTerm()"
            (input)="onSearch($event)"
            placeholder="Search by SKU, product name, or category..."
            class="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- Products Data Table -->
      <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th class="p-3.5 pl-5">Product & SKU</th>
                <th class="p-3.5">Category & Model</th>
                <th class="p-3.5">Cost & Sell (₹)</th>
                <th class="p-3.5">GST Rate</th>
                <th class="p-3.5">Gross Margin</th>
                <th class="p-3.5">Stock Level</th>
                <th class="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @if (filteredProducts().length === 0) {
                <tr>
                  <td colspan="7" class="p-12 text-center text-slate-500">
                    <mat-icon class="text-4xl text-slate-600 mb-1">inventory_2</mat-icon>
                    <p class="font-medium text-slate-400">No products match the filter.</p>
                  </td>
                </tr>
              } @else {
                @for (product of filteredProducts(); track product.id) {
                  <tr class="hover:bg-slate-900/40 transition">
                    <!-- Product Info -->
                    <td class="p-3.5 pl-5">
                      <div class="flex items-center gap-3">
                        <img
                          [src]="product.images[0]"
                          [alt]="product.name"
                          class="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/10"
                          referrerpolicy="no-referrer"
                        />
                        <div class="space-y-0.5 min-w-0">
                          <div class="font-bold text-white truncate max-w-xs">{{ product.name }}</div>
                          <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>{{ product.sku }}</span>
                            <span>•</span>
                            <span
                              class="font-semibold uppercase tracking-wider"
                              [class.text-emerald-400]="product.sourceType === 'OWN_PRODUCT'"
                              [class.text-blue-400]="product.sourceType === 'DROPSHIP'"
                              [class.text-purple-400]="product.sourceType === 'AFFILIATE'"
                            >
                              {{ product.sourceType === 'OWN_PRODUCT' ? 'Own Spice' : (product.sourceType === 'DROPSHIP' ? 'Dropship' : 'Affiliate') }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Category & Supplier -->
                    <td class="p-3.5">
                      <div class="space-y-0.5">
                        <div class="font-medium text-slate-200">{{ product.category }}</div>
                        <div class="text-[10px] text-slate-500">
                          {{ product.supplierName || 'Saarthi In-House' }}
                        </div>
                      </div>
                    </td>

                    <!-- Pricing -->
                    <td class="p-3.5 font-mono">
                      <div class="space-y-0.5">
                        <div class="font-bold text-white">₹{{ product.sellingPrice | number }}</div>
                        <div class="text-[10px] text-slate-400">Cost: ₹{{ product.purchaseCost | number }}</div>
                      </div>
                    </td>

                    <!-- GST -->
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-amber-400 font-semibold">
                        {{ product.gstRate }}%
                      </span>
                    </td>

                    <!-- Margin -->
                    <td class="p-3.5 font-mono">
                      @if (product.sourceType === 'AFFILIATE') {
                        <span class="text-purple-400 font-semibold">{{ product.commissionRate }}% Ref</span>
                      } @else {
                        <div class="space-y-0.5">
                          <div class="font-semibold text-emerald-400">
                            ₹{{ (product.sellingPrice - product.purchaseCost - product.packagingCost - product.shippingCost) | number }}
                          </div>
                          <div class="text-[10px] text-slate-500">
                            {{ calculateMarginPct(product) }}%
                          </div>
                        </div>
                      }
                    </td>

                    <!-- Stock Level -->
                    <td class="p-3.5 font-mono">
                      @if (product.sourceType === 'AFFILIATE') {
                        <span class="text-purple-400 text-[11px]">Partner Managed</span>
                      } @else {
                        <div class="flex items-center gap-2">
                          <span
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [class.bg-emerald-500/20]="product.availableStock >= 25"
                            [class.text-emerald-400]="product.availableStock >= 25"
                            [class.bg-amber-500/20]="product.availableStock < 25 && product.availableStock > 0"
                            [class.text-amber-400]="product.availableStock < 25 && product.availableStock > 0"
                            [class.bg-rose-500/20]="product.availableStock === 0"
                            [class.text-rose-400]="product.availableStock === 0"
                          >
                            {{ product.availableStock }} units
                          </span>
                          @if (product.availableStock < 25) {
                            <mat-icon class="text-amber-400 text-sm" title="Low stock threshold breached">warning</mat-icon>
                          }
                        </div>
                      }
                    </td>

                    <!-- Actions -->
                    <td class="p-3.5 text-right pr-5">
                      <div class="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          (click)="onPromote(product)"
                          title="Generate Social Campaign with AI"
                          class="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition cursor-pointer"
                        >
                          <mat-icon class="text-sm">auto_awesome</mat-icon>
                        </button>
                        <button
                          type="button"
                          (click)="openEditModal(product)"
                          title="Edit Product"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        >
                          <mat-icon class="text-sm">edit</mat-icon>
                        </button>
                        <button
                          type="button"
                          (click)="confirmDelete(product)"
                          title="Delete Product"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        >
                          <mat-icon class="text-sm">delete</mat-icon>
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

      <!-- Add / Edit Product Modal -->
      @if (showAddModal() || editingProduct()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-2xl bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
              <div class="flex items-center gap-2">
                <mat-icon class="text-orange-400">inventory_2</mat-icon>
                <h2 class="text-base font-bold text-white">
                  {{ editingProduct() ? 'Edit Product: ' + editingProduct()?.name : 'Add New Product to Saarthi Catalog' }}
                </h2>
              </div>
              <button
                type="button"
                (click)="closeModal()"
                class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="p-5 space-y-4 overflow-y-auto flex-1">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label for="prod-sku" class="block text-[11px] font-semibold text-slate-400">SKU Code *</label>
                  <input
                    id="prod-sku"
                    type="text"
                    formControlName="sku"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white uppercase font-mono"
                    placeholder="SHAKTI-GAR-100"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label for="prod-name" class="block text-[11px] font-semibold text-slate-400">Product Title *</label>
                  <input
                    id="prod-name"
                    type="text"
                    formControlName="name"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    placeholder="e.g. Royal Garam Masala Blend 100g"
                  />
                </div>
              </div>

              <div>
                <label for="prod-desc" class="block text-[11px] font-semibold text-slate-400">Description</label>
                <textarea
                  id="prod-desc"
                  rows="2"
                  formControlName="description"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="Aromatic stone-ground blend with cardamom, cloves, and mace..."
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label for="prod-source" class="block text-[11px] font-semibold text-slate-400">Fulfillment Model</label>
                  <select
                    id="prod-source"
                    formControlName="sourceType"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="OWN_PRODUCT">Own Product (Direct Spices)</option>
                    <option value="DROPSHIP">Dropshipping (Supplier PO)</option>
                    <option value="AFFILIATE">Affiliate (Referral Link)</option>
                  </select>
                </div>
                <div>
                  <label for="prod-cat" class="block text-[11px] font-semibold text-slate-400">Category</label>
                  <input
                    id="prod-cat"
                    type="text"
                    formControlName="category"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    placeholder="Whole Spices / Cookware"
                  />
                </div>
                <div>
                  <label for="prod-status" class="block text-[11px] font-semibold text-slate-400">Status</label>
                  <select
                    id="prod-status"
                    formControlName="status"
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="ACTIVE">Active in Store</option>
                    <option value="DRAFT">Draft</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>
              </div>

              <!-- Pricing & Tax Fields -->
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div class="text-xs font-bold text-amber-400 uppercase tracking-wider">Pricing, Costs & GST Rates</div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label for="prod-sell" class="block text-[11px] font-semibold text-slate-400">Selling Price (₹) *</label>
                    <input
                      id="prod-sell"
                      type="number"
                      formControlName="sellingPrice"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label for="prod-cost" class="block text-[11px] font-semibold text-slate-400">Purchase Cost (₹)</label>
                    <input
                      id="prod-cost"
                      type="number"
                      formControlName="purchaseCost"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label for="prod-gst" class="block text-[11px] font-semibold text-slate-400">GST Rate (%)</label>
                    <select
                      id="prod-gst"
                      formControlName="gstRate"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    >
                      <option [value]="0">0% (Nil / Exempt)</option>
                      <option [value]="5">5% (Spices / Staples)</option>
                      <option [value]="12">12% (Processed items)</option>
                      <option [value]="18">18% (Kitchen Appliances)</option>
                    </select>
                  </div>
                  <div>
                    <label for="prod-stock" class="block text-[11px] font-semibold text-slate-400">Stock Quantity</label>
                    <input
                      id="prod-stock"
                      type="number"
                      formControlName="stockQuantity"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label for="prod-pack" class="block text-[11px] font-semibold text-slate-400">Packaging (₹)</label>
                    <input
                      id="prod-pack"
                      type="number"
                      formControlName="packagingCost"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label for="prod-ship" class="block text-[11px] font-semibold text-slate-400">Shipping (₹)</label>
                    <input
                      id="prod-ship"
                      type="number"
                      formControlName="shippingCost"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label for="prod-supp" class="block text-[11px] font-semibold text-slate-400">Supplier Name</label>
                    <input
                      id="prod-supp"
                      type="text"
                      formControlName="supplierName"
                      class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      placeholder="e.g. Bengal Spice Mandi"
                    />
                  </div>
                </div>
              </div>

              <!-- Affiliate Fields if Affiliate -->
              @if (productForm.value.sourceType === 'AFFILIATE') {
                <div class="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-3">
                  <div class="text-xs font-bold text-purple-400 uppercase tracking-wider">Affiliate & Partner Settings</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="prod-aff-url" class="block text-[11px] font-semibold text-slate-400">Affiliate Link *</label>
                      <input
                        id="prod-aff-url"
                        type="url"
                        formControlName="affiliateUrl"
                        class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        placeholder="https://amazon.in/dp/...?tag=saarthi-21"
                      />
                    </div>
                    <div>
                      <label for="prod-comm" class="block text-[11px] font-semibold text-slate-400">Commission Rate (%)</label>
                      <input
                        id="prod-comm"
                        type="number"
                        formControlName="commissionRate"
                        class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              }

              <!-- Image URL -->
              <div>
                <label for="prod-img" class="block text-[11px] font-semibold text-slate-400">Image URL</label>
                <input
                  id="prod-img"
                  type="url"
                  formControlName="imageUrl"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div class="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="productForm.invalid"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Save Product Record
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProductsView {
  readonly api = inject(ShaktiApi);
  readonly promoteProduct = output<Product>();

  readonly searchTerm = signal<string>('');
  readonly selectedSource = signal<string>('ALL');
  readonly showAddModal = signal<boolean>(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly productForm = new FormGroup({
    sku: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true }),
    category: new FormControl<string>('Stone Ground Spices', { nonNullable: true }),
    sourceType: new FormControl<ProductSourceType>('OWN_PRODUCT', { nonNullable: true }),
    status: new FormControl<ProductStatus>('ACTIVE', { nonNullable: true }),
    sellingPrice: new FormControl<number>(120, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    purchaseCost: new FormControl<number>(65, { nonNullable: true, validators: [Validators.min(0)] }),
    gstRate: new FormControl<number>(5, { nonNullable: true }),
    packagingCost: new FormControl<number>(5, { nonNullable: true }),
    shippingCost: new FormControl<number>(15, { nonNullable: true }),
    stockQuantity: new FormControl<number>(50, { nonNullable: true, validators: [Validators.min(0)] }),
    supplierName: new FormControl<string>('Saarthi In-House Mill', { nonNullable: true }),
    affiliateUrl: new FormControl<string>('', { nonNullable: true }),
    commissionRate: new FormControl<number>(8, { nonNullable: true }),
    imageUrl: new FormControl<string>('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', { nonNullable: true }),
  });

  onSearch(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.searchTerm.set(val);
  }

  filteredProducts(): Product[] {
    const term = this.searchTerm().toLowerCase().trim();
    const source = this.selectedSource();

    return this.api.products().filter((p) => {
      const matchSource = source === 'ALL' || p.sourceType === source;
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      return matchSource && matchSearch;
    });
  }

  countBySource(source: ProductSourceType): number {
    return this.api.products().filter((p) => p.sourceType === source).length;
  }

  lowStockCount(): number {
    return this.api.products().filter((p) => p.sourceType !== 'AFFILIATE' && p.availableStock < 25).length;
  }

  calculateMarginPct(p: Product): string {
    const netMargin = p.sellingPrice - p.purchaseCost - p.packagingCost - p.shippingCost;
    if (p.sellingPrice <= 0) return '0.0';
    return ((netMargin / p.sellingPrice) * 100).toFixed(1);
  }

  onPromote(product: Product) {
    this.promoteProduct.emit(product);
  }

  openEditModal(p: Product) {
    this.editingProduct.set(p);
    this.productForm.setValue({
      sku: p.sku,
      name: p.name,
      description: p.description,
      category: p.category,
      sourceType: p.sourceType,
      status: p.status,
      sellingPrice: p.sellingPrice,
      purchaseCost: p.purchaseCost,
      gstRate: p.gstRate,
      packagingCost: p.packagingCost,
      shippingCost: p.shippingCost,
      stockQuantity: p.availableStock,
      supplierName: p.supplierName || '',
      affiliateUrl: p.affiliateUrl || '',
      commissionRate: p.commissionRate || 8,
      imageUrl: p.images[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    });
  }

  closeModal() {
    this.showAddModal.set(false);
    this.editingProduct.set(null);
    this.productForm.reset({
      sku: '',
      name: '',
      description: '',
      category: 'Stone Ground Spices',
      sourceType: 'OWN_PRODUCT',
      status: 'ACTIVE',
      sellingPrice: 120,
      purchaseCost: 65,
      gstRate: 5,
      packagingCost: 5,
      shippingCost: 15,
      stockQuantity: 50,
      supplierName: 'Saarthi In-House Mill',
      affiliateUrl: '',
      commissionRate: 8,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    });
  }

  async saveProduct() {
    if (this.productForm.invalid) return;
    const v = this.productForm.getRawValue();

    const productPayload: Partial<Product> = {
      sku: v.sku.toUpperCase(),
      name: v.name,
      description: v.description,
      category: v.category,
      brand: 'SHAKTI',
      sourceType: v.sourceType,
      status: v.status,
      sellingPrice: Number(v.sellingPrice),
      purchaseCost: Number(v.purchaseCost),
      gstRate: Number(v.gstRate),
      packagingCost: Number(v.packagingCost),
      shippingCost: Number(v.shippingCost),
      stockQuantity: Number(v.stockQuantity),
      availableStock: Number(v.stockQuantity),
      reservedStock: 0,
      supplierName: v.supplierName,
      affiliateUrl: v.affiliateUrl,
      commissionRate: Number(v.commissionRate),
      images: [v.imageUrl],
    };

    const currentEditing = this.editingProduct();
    if (currentEditing) {
      await this.api.updateProduct(currentEditing.id, productPayload);
    } else {
      await this.api.createProduct(productPayload);
    }
    this.closeModal();
  }

  async confirmDelete(p: Product) {
    if (confirm(`Remove "${p.name}" (${p.sku}) from catalog?`)) {
      await this.api.deleteProduct(p.id);
    }
  }

  exportCsv() {
    const rows = [
      ['SKU', 'Name', 'Category', 'Source', 'Selling Price', 'Cost', 'GST %', 'Stock', 'Supplier'].join(','),
      ...this.api.products().map((p) =>
        [
          `"${p.sku}"`,
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.category}"`,
          `"${p.sourceType}"`,
          p.sellingPrice,
          p.purchaseCost,
          p.gstRate,
          p.availableStock,
          `"${p.supplierName || ''}"`,
        ].join(','),
      ),
    ];

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.api.showToast('Inventory exported to CSV', 'success');
  }
}
