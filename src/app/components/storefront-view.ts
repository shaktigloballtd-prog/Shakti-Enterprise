import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  ViewChild,
  effect,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { Product, Order, PaymentMode, PaymentDetails } from '../models/shakti.models';

type PaymentStep = 'CART' | 'ADDRESS' | 'PAYMENT_SELECT' | 'VERIFYING' | 'RECEIPT';
type StorefrontModalMode = 'NONE' | 'CUSTOMER_AUTH' | 'CUSTOMER_ORDERS' | 'AI_CHEF' | 'PRODUCT_DETAIL';

@Component({
  selector: 'app-storefront-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6 pb-24 md:pb-8">
      <!-- Top Store Bar with Customer Auth & Admin HQ Toggle -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0e1422] border border-white/10 shadow-xl">
        <!-- Brand & Tagline -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base text-white tracking-wide">SHAKTI Masala</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                100% Stone Ground
              </span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">Saarthi Enterprise Direct Retail & Wholesale Portal</p>
          </div>
        </div>

        <!-- Customer Identity & Admin Workspace Switch -->
        <div class="flex items-center gap-2">
          <!-- AI Chef Recipe Assistant Button -->
          <button
            type="button"
            (click)="activeModal.set('AI_CHEF')"
            class="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <mat-icon class="text-sm text-purple-400">restaurant</mat-icon>
            <span class="hidden sm:inline">Ask AI Chef</span>
          </button>

          <!-- Customer Auth / Profile Button -->
          @if (api.isCustomerLoggedIn()) {
            @let cust = api.currentCustomer();
            <button
              type="button"
              (click)="activeModal.set('CUSTOMER_ORDERS')"
              class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <div class="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                {{ cust?.name?.slice(0, 1)?.toUpperCase() }}
              </div>
              <span class="max-w-[100px] truncate">{{ cust?.name }}</span>
              <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                🪙 {{ cust?.loyaltyCoins }}
              </span>
            </button>
          } @else {
            <button
              type="button"
              (click)="activeModal.set('CUSTOMER_AUTH')"
              class="px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:text-orange-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <mat-icon class="text-sm text-orange-400">person</mat-icon>
              <span>Customer Sign In</span>
            </button>
          }

          <!-- Admin / Staff HQ Portal Switcher -->
          <button
            type="button"
            (click)="switchToAdmin.emit()"
            class="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Switch to SHAKTI AI Business & ERP HQ"
          >
            <mat-icon class="text-sm text-emerald-400">lock</mat-icon>
            <span class="hidden md:inline">Admin Portal</span>
          </button>
        </div>
      </div>

      <!-- Storefront Brand Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-[#18110b] to-[#0c0f17] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div class="relative z-10 max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <span>🌶️ Pure Traditional Spices & Essentials</span>
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Saarthi Enterprise</span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Authentic Royal Spices & Kitchenware
          </h1>
          <p class="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
            Handcrafted stone-ground spices preserved at low milling temperatures (<38°C) for maximum natural curcumin, essential volatile oils, and traditional aroma. Shipped express direct to your home.
          </p>

          <!-- Category Quick Filters -->
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              (click)="selectedCategory.set('ALL')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              [class.bg-amber-500]="selectedCategory() === 'ALL'"
              [class.text-white]="selectedCategory() === 'ALL'"
              [class.bg-slate-900/80]="selectedCategory() !== 'ALL'"
              [class.text-slate-300]="selectedCategory() !== 'ALL'"
              [class.border]="selectedCategory() !== 'ALL'"
              [class.border-slate-700]="selectedCategory() !== 'ALL'"
            >
              All Offerings
            </button>
            <button
              type="button"
              (click)="selectedSourceType.set('OWN_PRODUCT')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              [class.bg-emerald-600]="selectedSourceType() === 'OWN_PRODUCT'"
              [class.text-white]="selectedSourceType() === 'OWN_PRODUCT'"
              [class.bg-slate-900/80]="selectedSourceType() !== 'OWN_PRODUCT'"
              [class.text-slate-300]="selectedSourceType() !== 'OWN_PRODUCT'"
              [class.border]="selectedSourceType() !== 'OWN_PRODUCT'"
              [class.border-slate-700]="selectedSourceType() !== 'OWN_PRODUCT'"
            >
              <span>🌿 Pure Spices (Direct)</span>
            </button>
            <button
              type="button"
              (click)="selectedSourceType.set('DROPSHIP')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              [class.bg-blue-600]="selectedSourceType() === 'DROPSHIP'"
              [class.text-white]="selectedSourceType() === 'DROPSHIP'"
              [class.bg-slate-900/80]="selectedSourceType() !== 'DROPSHIP'"
              [class.text-slate-300]="selectedSourceType() !== 'DROPSHIP'"
              [class.border]="selectedSourceType() !== 'DROPSHIP'"
              [class.border-slate-700]="selectedSourceType() !== 'DROPSHIP'"
            >
              <span>📦 Kitchenware (Dropship)</span>
            </button>
            <button
              type="button"
              (click)="selectedSourceType.set('AFFILIATE')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              [class.bg-purple-600]="selectedSourceType() === 'AFFILIATE'"
              [class.text-white]="selectedSourceType() === 'AFFILIATE'"
              [class.bg-slate-900/80]="selectedSourceType() !== 'AFFILIATE'"
              [class.text-slate-300]="selectedSourceType() !== 'AFFILIATE'"
              [class.border]="selectedSourceType() !== 'AFFILIATE'"
              [class.border-slate-700]="selectedSourceType() !== 'AFFILIATE'"
            >
              <span>⚡ Verified Appliances (Affiliate)</span>
            </button>
          </div>
        </div>

        <div class="absolute -right-12 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Store Navigation & Search Bar -->
      <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <!-- Search -->
        <div class="flex items-center gap-2 flex-1 max-w-md bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
          <mat-icon class="text-slate-400 text-sm">search</mat-icon>
          <input
            type="text"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            placeholder="Search spices, masala blends, or cookware..."
            class="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <!-- Filter Reset & Cart Toggle Button -->
        <div class="flex items-center gap-3">
          @if (selectedSourceType() !== 'ALL' || searchQuery()) {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset Filters
            </button>
          }

          <button
            type="button"
            (click)="showCartDrawer.set(true)"
            class="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition cursor-pointer min-h-[44px]"
          >
            <mat-icon class="text-base">shopping_bag</mat-icon>
            <span>Cart ({{ totalCartItems() }})</span>
            <span class="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[11px]">
              ₹{{ totalCartPrice() | number }}
            </span>
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of filteredProducts(); track product.id) {
          <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-lg group">
            <!-- Product Image & Badges -->
            <button type="button" class="relative w-full h-48 bg-slate-900 overflow-hidden cursor-pointer text-left p-0 border-0" (click)="openProductDetail(product)">
              <img
                [src]="product.images[0]"
                [alt]="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerpolicy="no-referrer"
              />
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                @if (product.sourceType === 'OWN_PRODUCT') {
                  <span class="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold shadow">
                    🌿 Pure Spice
                  </span>
                } @else if (product.sourceType === 'DROPSHIP') {
                  <span class="px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold shadow">
                    📦 Dropship Express
                  </span>
                } @else {
                  <span class="px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-bold shadow">
                    ⚡ Verified Partner
                  </span>
                }
              </div>

              <!-- Purity Gauge Quick Tag -->
              @if (product.sourceType === 'OWN_PRODUCT') {
                <div class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] text-amber-300 font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                  <mat-icon class="text-xs text-amber-400">verified</mat-icon>
                  <span>7.5% Curcumin</span>
                </div>
              }
            </button>

            <!-- Content Body -->
            <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div class="space-y-1">
                <div class="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                  {{ product.brand }} • {{ product.category }}
                </div>
                <button type="button" class="text-sm font-bold text-white line-clamp-2 hover:text-orange-300 transition cursor-pointer text-left p-0 bg-transparent border-0" (click)="openProductDetail(product)">
                  {{ product.name }}
                </button>
                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <!-- Price & Add to Cart Action -->
              <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div>
                  <div class="text-lg font-extrabold text-white font-mono">
                    ₹{{ product.sellingPrice | number }}
                  </div>
                  <div class="text-[10px] text-slate-400">
                    Incl. {{ product.gstRate }}% GST
                  </div>
                </div>

                <button
                  type="button"
                  (click)="api.addToCart(product)"
                  class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                >
                  <mat-icon class="text-sm">add_shopping_cart</mat-icon>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Mobile Sticky Floating Cart & Navigation Bar (< 768px) -->
      <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1422]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <button
          type="button"
          (click)="selectedSourceType.set('ALL')"
          class="flex flex-col items-center text-slate-400 hover:text-white"
        >
          <mat-icon class="text-xl">storefront</mat-icon>
          <span class="text-[10px] font-semibold">Catalog</span>
        </button>

        <button
          type="button"
          (click)="activeModal.set('AI_CHEF')"
          class="flex flex-col items-center text-purple-400 hover:text-purple-300"
        >
          <mat-icon class="text-xl">restaurant</mat-icon>
          <span class="text-[10px] font-semibold">AI Chef</span>
        </button>

        @if (api.isCustomerLoggedIn()) {
          <button
            type="button"
            (click)="activeModal.set('CUSTOMER_ORDERS')"
            class="flex flex-col items-center text-amber-400 hover:text-amber-300"
          >
            <mat-icon class="text-xl">history</mat-icon>
            <span class="text-[10px] font-semibold">My Orders</span>
          </button>
        } @else {
          <button
            type="button"
            (click)="activeModal.set('CUSTOMER_AUTH')"
            class="flex flex-col items-center text-slate-400 hover:text-white"
          >
            <mat-icon class="text-xl">person</mat-icon>
            <span class="text-[10px] font-semibold">Login</span>
          </button>
        }

        <button
          type="button"
          (click)="showCartDrawer.set(true)"
          class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-xl flex items-center justify-between min-h-[44px]"
        >
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-base">shopping_bag</mat-icon>
            <span>Cart ({{ totalCartItems() }})</span>
          </div>
          <span class="font-mono">₹{{ totalCartPrice() | number }}</span>
        </button>
      </div>

      <!-- Modal 1: Product Detail & Purity Radar Gauge -->
      @if (activeModal() === 'PRODUCT_DETAIL' && selectedDetailProduct()) {
        @let prod = selectedDetailProduct()!;
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-2xl bg-[#0e1422] border border-white/10 rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                  {{ prod.brand }}
                </span>
                <h2 class="text-lg font-extrabold text-white truncate max-w-xs">{{ prod.name }}</h2>
              </div>
              <button
                type="button"
                (click)="activeModal.set('NONE')"
                class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img [src]="prod.images[0]" [alt]="prod.name" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                </div>
                <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs text-slate-300">
                  <div><strong>SKU:</strong> {{ prod.sku }}</div>
                  <div><strong>Category:</strong> {{ prod.category }}</div>
                  <div><strong>Selling Price:</strong> ₹{{ prod.sellingPrice }} ({{ prod.gstRate }}% GST)</div>
                </div>
              </div>

              <!-- Spice Purity Gauge Radar Canvas & Analysis -->
              <div class="space-y-4">
                <div class="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 text-center">
                  <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <mat-icon class="text-sm">verified</mat-icon>
                    <span>SHAKTI Purity & Aroma Canvas Gauge</span>
                  </div>

                  <!-- Canvas Element for Purity Gauge -->
                  <div class="flex justify-center">
                    <canvas #purityCanvas width="220" height="150" class="rounded-xl border border-slate-800 bg-slate-950"></canvas>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-[11px] text-left">
                    <div class="p-2 rounded-lg bg-black/40 border border-white/5">
                      <div class="text-slate-400">Curcumin Content</div>
                      <div class="font-extrabold text-emerald-400 font-mono">7.5% Certified</div>
                    </div>
                    <div class="p-2 rounded-lg bg-black/40 border border-white/5">
                      <div class="text-slate-400">Milling Temperature</div>
                      <div class="font-extrabold text-amber-400 font-mono">&lt; 38°C Cold Ground</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="api.addToCart(prod); activeModal.set('NONE')"
                  class="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <mat-icon>add_shopping_cart</mat-icon>
                  <span>Add to Cart (₹{{ prod.sellingPrice | number }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Modal 2: Customer Authentication & 6-Digit OTP Verification -->
      @if (activeModal() === 'CUSTOMER_AUTH') {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-[#0e1422] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-orange-400">person</mat-icon>
                <h2 class="text-lg font-bold text-white">Customer Account Access</h2>
              </div>
              <button type="button" (click)="activeModal.set('NONE')" class="text-slate-400 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            @if (showCustomerOtpStep()) {
              <!-- 6-Digit OTP Verification Form -->
              <div class="space-y-4 text-center">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl">
                  🔒
                </div>
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-white">Enter 6-Digit OTP Code</h3>
                  <p class="text-xs text-slate-400">Sent to your registered phone & email address.</p>
                </div>

                @if (api.testCustomerOtpCode()) {
                  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-between">
                    <span>Test OTP Code: {{ api.testCustomerOtpCode() }}</span>
                    <button
                      type="button"
                      (click)="customerOtpInput.set(api.testCustomerOtpCode() || '')"
                      class="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold"
                    >
                      Autofill
                    </button>
                  </div>
                }

                <input
                  type="text"
                  maxlength="6"
                  inputmode="numeric"
                  [value]="customerOtpInput()"
                  (input)="customerOtpInput.set($any($event.target).value)"
                  placeholder="e.g. 123456"
                  class="w-full text-center tracking-widest text-2xl font-mono py-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 focus:outline-none focus:border-orange-500"
                />

                <button
                  type="button"
                  (click)="submitCustomerOtp()"
                  [disabled]="customerOtpInput().length < 6"
                  class="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl min-h-[44px]"
                >
                  Verify OTP & Log In
                </button>
              </div>
            } @else {
              <!-- Login / Signup Mode Toggle -->
              <div class="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  (click)="customerAuthMode.set('LOGIN')"
                  class="py-2 rounded-lg transition"
                  [class.bg-orange-500]="customerAuthMode() === 'LOGIN'"
                  [class.text-white]="customerAuthMode() === 'LOGIN'"
                  [class.text-slate-400]="customerAuthMode() !== 'LOGIN'"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  (click)="customerAuthMode.set('REGISTER')"
                  class="py-2 rounded-lg transition"
                  [class.bg-orange-500]="customerAuthMode() === 'REGISTER'"
                  [class.text-white]="customerAuthMode() === 'REGISTER'"
                  [class.text-slate-400]="customerAuthMode() !== 'REGISTER'"
                >
                  Create Account
                </button>
              </div>

              @if (customerAuthMode() === 'LOGIN') {
                <form [formGroup]="customerLoginForm" class="space-y-3" (ngSubmit)="submitCustomerLogin()">
                  <div>
                    <label for="cust-email" class="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      id="cust-email"
                      type="email"
                      formControlName="email"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      placeholder="e.g. ananya.roy@example.com"
                    />
                  </div>
                  <div>
                    <label for="cust-pass" class="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                    <input
                      id="cust-pass"
                      type="password"
                      formControlName="password"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    [disabled]="customerLoginForm.invalid"
                    class="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl cursor-pointer min-h-[44px]"
                  >
                    Send OTP & Sign In
                  </button>
                </form>
              } @else {
                <form [formGroup]="customerRegisterForm" class="space-y-3" (ngSubmit)="submitCustomerRegister()">
                  <div>
                    <label for="reg-name" class="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                    <input
                      id="reg-name"
                      type="text"
                      formControlName="name"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      placeholder="Ananya Roy"
                    />
                  </div>
                  <div>
                    <label for="reg-email" class="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      id="reg-email"
                      type="email"
                      formControlName="email"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      placeholder="ananya.roy@example.com"
                    />
                  </div>
                  <div>
                    <label for="reg-phone" class="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                    <input
                      id="reg-phone"
                      type="text"
                      formControlName="phone"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      placeholder="+91 98302 11223"
                    />
                  </div>
                  <div>
                    <label for="reg-pass" class="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                    <input
                      id="reg-pass"
                      type="password"
                      formControlName="password"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    [disabled]="customerRegisterForm.invalid"
                    class="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl cursor-pointer min-h-[44px]"
                  >
                    Register & Get 50 Loyalty Coins
                  </button>
                </form>
              }
            }
          </div>
        </div>
      }

      <!-- Modal 3: Customer Orders & Loyalty Drawer -->
      @if (activeModal() === 'CUSTOMER_ORDERS') {
        @let cust = api.currentCustomer();
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-2xl bg-[#0e1422] border border-white/10 rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-amber-400">history</mat-icon>
                <h2 class="text-lg font-bold text-white">My Orders & Loyalty Account</h2>
              </div>
              <button type="button" (click)="activeModal.set('NONE')" class="text-slate-400 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <!-- Loyalty Coins Header Card -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div class="text-xs text-amber-300 font-semibold">Logged in as {{ cust?.name }}</div>
                <div class="text-xs text-slate-400">{{ cust?.email }} • {{ cust?.phone }}</div>
              </div>
              <div class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-sm">
                🪙 {{ cust?.loyaltyCoins }} Coins
              </div>
            </div>

            <!-- Customer Orders List -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">Recent Order History & Tracking</h3>
              @if (api.customerOrders().length === 0) {
                <div class="py-8 text-center text-slate-400 text-xs">
                  No previous orders found for this account.
                </div>
              } @else {
                <div class="space-y-4">
                  @for (ord of api.customerOrders(); track ord.id) {
                    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                      <div class="flex items-center justify-between font-mono">
                        <span class="font-bold text-white">{{ ord.orderNumber }}</span>
                        <div class="flex items-center gap-1.5">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                                [class.bg-emerald-500/20]="ord.paymentStatus === 'PAID'"
                                [class.text-emerald-300]="ord.paymentStatus === 'PAID'"
                                [class.bg-amber-500/20]="ord.paymentStatus !== 'PAID'"
                                [class.text-amber-300]="ord.paymentStatus !== 'PAID'">
                            {{ ord.paymentStatus }}
                          </span>
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                            {{ ord.status }}
                          </span>
                        </div>
                      </div>

                      <div class="text-slate-400 text-[11px]">
                        {{ ord.items.length }} items • Grand Total: ₹{{ ord.grandTotal | number }} • Carrier: {{ ord.carrier }} ({{ ord.trackingNumber }})
                      </div>

                      <!-- Order Tracking Timeline Visual -->
                      <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                        <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tracking Timeline</div>
                        <div class="flex items-center justify-between text-[10px] pt-1">
                          <div class="flex flex-col items-center gap-0.5">
                            <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-black font-bold">✓</span>
                            <span class="text-emerald-400 font-medium">Placed</span>
                          </div>
                          <div class="h-0.5 flex-1 mx-1" [class.bg-emerald-500]="ord.status === 'PROCESSING' || ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status === 'PAID' || ord.paymentStatus === 'COD'"></div>
                          <div class="flex flex-col items-center gap-0.5">
                            <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold" [class.bg-emerald-500]="ord.status === 'PROCESSING' || ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.text-black]="ord.status === 'PROCESSING' || ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status !== 'PROCESSING' && ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'" [class.text-slate-500]="ord.status !== 'PROCESSING' && ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'">2</span>
                            <span [class.text-emerald-400]="ord.status === 'PROCESSING' || ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.text-slate-500]="ord.status !== 'PROCESSING' && ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'">Packed</span>
                          </div>
                          <div class="h-0.5 flex-1 mx-1" [class.bg-emerald-500]="ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'"></div>
                          <div class="flex flex-col items-center gap-0.5">
                            <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold" [class.bg-emerald-500]="ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.text-black]="ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'" [class.text-slate-500]="ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'">3</span>
                            <span [class.text-emerald-400]="ord.status === 'SHIPPED' || ord.status === 'DELIVERED'" [class.text-slate-500]="ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED'">Shipped</span>
                          </div>
                          <div class="h-0.5 flex-1 mx-1" [class.bg-emerald-500]="ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status !== 'DELIVERED'"></div>
                          <div class="flex flex-col items-center gap-0.5">
                            <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold" [class.bg-emerald-500]="ord.status === 'DELIVERED'" [class.text-black]="ord.status === 'DELIVERED'" [class.bg-slate-800]="ord.status !== 'DELIVERED'" [class.text-slate-500]="ord.status !== 'DELIVERED'">4</span>
                            <span [class.text-emerald-400]="ord.status === 'DELIVERED'" [class.text-slate-500]="ord.status !== 'DELIVERED'">Delivered</span>
                          </div>
                        </div>
                      </div>

                      <!-- Action buttons for Customer Cancel / Return -->
                      <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                        @if (ord.status === 'PROCESSING' || ord.status === 'PAID' || ord.status === 'DRAFT') {
                          <button
                            type="button"
                            (click)="api.cancelCustomerOrder(ord.id, 'Customer self-service cancellation')"
                            class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        }
                        @if (ord.status === 'DELIVERED') {
                          <button
                            type="button"
                            (click)="api.requestCustomerReturn(ord.id, 'Customer submitted return request')"
                            class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold cursor-pointer"
                          >
                            Request Return
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <button
              type="button"
              (click)="api.logoutCustomer(); activeModal.set('NONE')"
              class="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs cursor-pointer"
            >
              Sign Out Customer Account
            </button>
          </div>
        </div>
      }

      <!-- Modal 4: Ask AI Chef & Culinary Spice Assistant -->
      @if (activeModal() === 'AI_CHEF') {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-[#0e1422] border border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2 text-purple-300 font-bold">
                <mat-icon class="text-purple-400">restaurant</mat-icon>
                <span>Ask SHAKTI AI Master Chef</span>
              </div>
              <button type="button" (click)="activeModal.set('NONE')" class="text-slate-400 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="space-y-2">
              <label for="ai-dish" class="block text-xs font-semibold text-slate-300">Dish / Recipe Name</label>
              <input
                id="ai-dish"
                type="text"
                [value]="aiChefDishInput()"
                (input)="aiChefDishInput.set($any($event.target).value)"
                placeholder="e.g. Kolkata Chicken Biryani / Kosha Mangsho / Paneer Butter Masala"
                class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <button
              type="button"
              (click)="getAiChefAdvice()"
              [disabled]="aiChefLoading()"
              class="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <mat-icon class="text-sm">auto_awesome</mat-icon>
              <span>{{ aiChefLoading() ? 'Analyzing Spice Ratios...' : 'Get AI Spice Ratios & Recipe Advice' }}</span>
            </button>

            @if (aiChefAdviceResult()) {
              <div class="space-y-2">
                <div class="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-purple-100 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {{ aiChefAdviceResult() }}
                </div>
                <button
                  type="button"
                  (click)="addChefBundleToCart()"
                  class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <mat-icon class="text-sm">add_shopping_cart</mat-icon>
                  <span>1-Click Add Chef's Recommended Spice Bundle to Cart</span>
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- Cart Drawer & Multi-Step Payment Gateway Drawer -->
      @if (showCartDrawer()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div class="w-full max-w-lg bg-[#0e1422] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <!-- Header & Steps Indicator -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-4">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-orange-400">shopping_bag</mat-icon>
                  <h2 class="text-lg font-bold text-white">Checkout Gateway</h2>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {{ totalCartItems() }} items
                  </span>
                </div>
                <button
                  type="button"
                  (click)="showCartDrawer.set(false)"
                  class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <mat-icon class="text-base">close</mat-icon>
                </button>
              </div>

              <!-- Step Breadcrumbs -->
              <div class="grid grid-cols-3 gap-1 text-[11px] font-bold text-center">
                <div class="py-1.5 rounded-lg" [class.bg-orange-500]="paymentStep() === 'CART'" [class.text-white]="paymentStep() === 'CART'" [class.bg-slate-900]="paymentStep() !== 'CART'" [class.text-slate-400]="paymentStep() !== 'CART'">
                  1. Cart
                </div>
                <div class="py-1.5 rounded-lg" [class.bg-orange-500]="paymentStep() === 'ADDRESS' || paymentStep() === 'PAYMENT_SELECT'" [class.text-white]="paymentStep() === 'ADDRESS' || paymentStep() === 'PAYMENT_SELECT'" [class.bg-slate-900]="paymentStep() !== 'ADDRESS' && paymentStep() !== 'PAYMENT_SELECT'" [class.text-slate-400]="paymentStep() !== 'ADDRESS' && paymentStep() !== 'PAYMENT_SELECT'">
                  2. Address & Pay
                </div>
                <div class="py-1.5 rounded-lg" [class.bg-orange-500]="paymentStep() === 'RECEIPT'" [class.text-white]="paymentStep() === 'RECEIPT'" [class.bg-slate-900]="paymentStep() !== 'RECEIPT'" [class.text-slate-400]="paymentStep() !== 'RECEIPT'">
                  3. Receipt
                </div>
              </div>

              <!-- STEP 1: CART ITEMS -->
              @if (paymentStep() === 'CART') {
                @if (api.cart().length === 0) {
                  <div class="py-16 text-center text-slate-400 space-y-2">
                    <mat-icon class="text-5xl text-slate-600">remove_shopping_cart</mat-icon>
                    <p class="text-sm font-semibold">Your shopping cart is empty.</p>
                  </div>
                } @else {
                  <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
                    @for (item of api.cart(); track item.product.id) {
                      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div class="space-y-0.5 flex-1 min-w-0">
                          <div class="text-xs font-bold text-white truncate">{{ item.product.name }}</div>
                          <div class="text-[11px] text-slate-400 font-mono">
                            ₹{{ item.product.sellingPrice }} &times; {{ item.quantity }} = ₹{{ (item.product.sellingPrice * item.quantity) | number }}
                          </div>
                        </div>

                        <!-- Quantity Controls -->
                        <div class="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            (click)="api.updateCartQty(item.product.id, item.quantity - 1)"
                            class="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span class="w-6 text-center text-xs font-mono font-bold text-white">{{ item.quantity }}</span>
                          <button
                            type="button"
                            (click)="api.updateCartQty(item.product.id, item.quantity + 1)"
                            class="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                }
              }

              <!-- STEP 2: ADDRESS & MULTI-METHOD INDIAN PAYMENT -->
              @if (paymentStep() === 'ADDRESS' || paymentStep() === 'PAYMENT_SELECT') {
                <div class="space-y-4">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Shipping & Payment Method
                  </h3>

                  <form [formGroup]="checkoutForm" class="space-y-3">
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label for="ch-name" class="block text-[11px] font-semibold text-slate-400">Name</label>
                        <input id="ch-name" type="text" formControlName="customerName" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white" />
                      </div>
                      <div>
                        <label for="ch-phone" class="block text-[11px] font-semibold text-slate-400">Phone</label>
                        <input id="ch-phone" type="text" formControlName="customerPhone" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white" />
                      </div>
                    </div>

                    <div>
                      <label for="ch-street" class="block text-[11px] font-semibold text-slate-400">Street Address</label>
                      <input id="ch-street" type="text" formControlName="street" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white" />
                    </div>

                    <!-- Payment Mode Selection -->
                    <div class="space-y-2">
                      <div class="block text-[11px] font-semibold text-slate-400">Select Payment Method</div>
                      <div class="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          (click)="selectedPaymentMode.set('UPI')"
                          class="p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer"
                          [class.border-orange-500]="selectedPaymentMode() === 'UPI'"
                          [class.bg-orange-500/10]="selectedPaymentMode() === 'UPI'"
                          [class.border-slate-700]="selectedPaymentMode() !== 'UPI'"
                        >
                          <mat-icon class="text-orange-400 text-base">qr_code_2</mat-icon>
                          <div>
                            <div class="text-xs font-bold text-white">UPI Instant</div>
                            <div class="text-[10px] text-slate-400">GPay/PhonePe/QR</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          (click)="selectedPaymentMode.set('CARD')"
                          class="p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer"
                          [class.border-orange-500]="selectedPaymentMode() === 'CARD'"
                          [class.bg-orange-500/10]="selectedPaymentMode() === 'CARD'"
                          [class.border-slate-700]="selectedPaymentMode() !== 'CARD'"
                        >
                          <mat-icon class="text-blue-400 text-base">credit_card</mat-icon>
                          <div>
                            <div class="text-xs font-bold text-white">Cards</div>
                            <div class="text-[10px] text-slate-400">RuPay/Visa/Master</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          (click)="selectedPaymentMode.set('NET_BANKING')"
                          class="p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer"
                          [class.border-orange-500]="selectedPaymentMode() === 'NET_BANKING'"
                          [class.bg-orange-500/10]="selectedPaymentMode() === 'NET_BANKING'"
                          [class.border-slate-700]="selectedPaymentMode() !== 'NET_BANKING'"
                        >
                          <mat-icon class="text-purple-400 text-base">account_balance</mat-icon>
                          <div>
                            <div class="text-xs font-bold text-white">NetBanking</div>
                            <div class="text-[10px] text-slate-400">Top Indian Banks</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          (click)="selectedPaymentMode.set('COD')"
                          class="p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer"
                          [class.border-orange-500]="selectedPaymentMode() === 'COD'"
                          [class.bg-orange-500/10]="selectedPaymentMode() === 'COD'"
                          [class.border-slate-700]="selectedPaymentMode() !== 'COD'"
                        >
                          <mat-icon class="text-emerald-400 text-base">payments</mat-icon>
                          <div>
                            <div class="text-xs font-bold text-white">COD</div>
                            <div class="text-[10px] text-slate-400">Cash on Delivery</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- UPI Dynamic Canvas QR Code Generator -->
                    @if (selectedPaymentMode() === 'UPI') {
                      <div class="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center space-y-2">
                        <div class="text-xs font-bold text-amber-300">Scan UPI QR Code with Any Banking App</div>
                        <div class="flex justify-center">
                          <canvas #upiQrCanvas width="180" height="180" class="rounded-xl border border-slate-700 bg-white p-1"></canvas>
                        </div>
                        <div class="text-[11px] text-slate-400 font-mono">
                          VPA: saarthi@okhdfcbank
                        </div>
                      </div>
                    }
                  </form>
                </div>
              }

              <!-- STEP 3: DIGITAL TAX INVOICE RECEIPT CANVAS -->
              @if (paymentStep() === 'RECEIPT' && completedOrder()) {
                <div class="space-y-3 text-center">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                    ✅
                  </div>
                  <h3 class="text-sm font-bold text-white">Payment Settlement Confirmed!</h3>

                  <!-- Tax Invoice Canvas -->
                  <div class="flex justify-center">
                    <canvas #receiptCanvas width="320" height="380" class="rounded-2xl border border-slate-700 bg-white shadow-xl"></canvas>
                  </div>

                  <button
                    type="button"
                    (click)="printReceiptCanvas()"
                    class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Print / Download Invoice
                  </button>
                </div>
              }
            </div>

            <!-- Footer Summary & Action Buttons -->
            @if (api.cart().length > 0 && paymentStep() !== 'RECEIPT') {
              <div class="pt-4 border-t border-white/10 space-y-3">
                <div class="space-y-1 text-xs">
                  <div class="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span class="font-mono text-white">₹{{ totalCartPrice() | number }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Total Amount</span>
                    <span class="font-mono text-orange-400">₹{{ totalCartPrice() | number }}</span>
                  </div>
                </div>

                @if (paymentStep() === 'CART') {
                  <button
                    type="button"
                    (click)="paymentStep.set('ADDRESS')"
                    class="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold text-sm shadow-xl min-h-[44px]"
                  >
                    Proceed to Delivery & Payment
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="submitPaymentAndOrder()"
                    class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-xl cursor-pointer min-h-[44px]"
                  >
                    Confirm & Complete Payment (₹{{ totalCartPrice() | number }})
                  </button>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class StorefrontView {
  readonly api = inject(ShaktiApi);
  readonly switchToAdmin = output<void>();

  @ViewChild('upiQrCanvas') upiQrCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('purityCanvas') purityCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('receiptCanvas') receiptCanvasRef?: ElementRef<HTMLCanvasElement>;

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('ALL');
  readonly selectedSourceType = signal<string>('ALL');
  readonly showCartDrawer = signal<boolean>(false);
  readonly paymentStep = signal<PaymentStep>('CART');
  readonly selectedPaymentMode = signal<PaymentMode>('UPI');
  readonly activeModal = signal<StorefrontModalMode>('NONE');
  readonly selectedDetailProduct = signal<Product | null>(null);
  readonly showCustomerOtpStep = signal<boolean>(false);
  readonly customerAuthMode = signal<'LOGIN' | 'REGISTER'>('LOGIN');
  readonly customerOtpInput = signal<string>('');
  readonly completedOrder = signal<Order | null>(null);

  readonly aiChefDishInput = signal<string>('Kolkata Style Biryani');
  readonly aiChefAdviceResult = signal<string>('');
  readonly aiChefLoading = signal<boolean>(false);

  readonly checkoutForm = new FormGroup({
    customerName: new FormControl('Ananya Roy', [Validators.required]),
    customerPhone: new FormControl('+91 98302 11223', [Validators.required]),
    street: new FormControl('Flat 2B, Regent Estate, Jadavpur', [Validators.required]),
    city: new FormControl('Kolkata', [Validators.required]),
    state: new FormControl('West Bengal', [Validators.required]),
    pincode: new FormControl('700032', [Validators.required]),
  });

  readonly customerLoginForm = new FormGroup({
    email: new FormControl('ananya.roy@example.com', [Validators.required, Validators.email]),
    password: new FormControl('Customer@123', [Validators.required]),
  });

  readonly customerRegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor() {
    effect(() => {
      if (this.selectedPaymentMode() === 'UPI' && this.showCartDrawer()) {
        setTimeout(() => this.drawUpiQrCode(), 100);
      }
    });

    effect(() => {
      if (this.activeModal() === 'PRODUCT_DETAIL' && this.selectedDetailProduct()) {
        setTimeout(() => this.drawPurityGauge(), 100);
      }
    });
  }

  onSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('ALL');
    this.selectedSourceType.set('ALL');
  }

  filteredProducts(): Product[] {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const st = this.selectedSourceType();

    return this.api.products().filter((p) => {
      const matchStatus = p.status === 'ACTIVE';
      const matchCat = cat === 'ALL' || p.category === cat;
      const matchSource = st === 'ALL' || p.sourceType === st;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return matchStatus && matchCat && matchSource && matchQ;
    });
  }

  totalCartItems(): number {
    return this.api.cart().reduce((sum, item) => sum + item.quantity, 0);
  }

  totalCartPrice(): number {
    return this.api.cart().reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }

  openProductDetail(product: Product) {
    this.selectedDetailProduct.set(product);
    this.activeModal.set('PRODUCT_DETAIL');
  }

  async submitCustomerLogin() {
    if (this.customerLoginForm.invalid) return;
    const val = this.customerLoginForm.getRawValue();
    const ok = await this.api.loginCustomer({ email: val.email || '', password: val.password || '' });
    if (ok) {
      this.showCustomerOtpStep.set(true);
    }
  }

  async submitCustomerRegister() {
    if (this.customerRegisterForm.invalid) return;
    const val = this.customerRegisterForm.getRawValue();
    const ok = await this.api.registerCustomer({
      name: val.name || '',
      email: val.email || '',
      phone: val.phone || '',
      password: val.password || '',
    });
    if (ok) {
      this.showCustomerOtpStep.set(true);
    }
  }

  async submitCustomerOtp() {
    const email = this.customerLoginForm.value.email || this.customerRegisterForm.value.email || 'ananya.roy@example.com';
    const code = this.customerOtpInput();
    const ok = await this.api.verifyCustomerOtp(email, code);
    if (ok) {
      this.activeModal.set('NONE');
      this.showCustomerOtpStep.set(false);
    }
  }

  async getAiChefAdvice() {
    this.aiChefLoading.set(true);
    const advice = await this.api.getAiCulinaryAdvice(this.aiChefDishInput(), 'Aromatic royal Kolkata flavor');
    this.aiChefAdviceResult.set(advice);
    this.aiChefLoading.set(false);
  }

  async submitPaymentAndOrder() {
    if (this.checkoutForm.invalid || this.api.cart().length === 0) return;
    const val = this.checkoutForm.getRawValue();

    const order = await this.api.placeOrder({
      customerName: val.customerName || 'Ananya Roy',
      customerEmail: 'ananya.roy@example.com',
      customerPhone: val.customerPhone || '+91 98302 11223',
      shippingAddress: {
        street: val.street || 'Flat 2B, Regent Estate',
        city: val.city || 'Kolkata',
        state: val.state || 'West Bengal',
        pincode: val.pincode || '700032',
      },
      items: this.api.cart().map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      paymentMethod: this.selectedPaymentMode(),
    });

    const paymentRes = await this.api.verifyPayment({
      orderId: order.id,
      method: this.selectedPaymentMode(),
      amount: order.grandTotal,
    });

    this.completedOrder.set(order);
    this.paymentStep.set('RECEIPT');

    setTimeout(() => this.drawDigitalInvoice(order, paymentRes.payment), 150);
  }

  drawUpiQrCode() {
    const canvas = this.upiQrCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const size = 180;
    const cells = 21;
    const cellSize = size / cells;

    ctx.fillStyle = '#000000';
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        // Draw Finder Patterns at corners
        const isTL = r < 7 && c < 7;
        const isTR = r < 7 && c >= cells - 7;
        const isBL = r >= cells - 7 && c < 7;

        if (isTL || isTR || isBL) {
          const lr = isBL ? r - (cells - 7) : r;
          const lc = isTR ? c - (cells - 7) : c;
          if (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4)) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        } else if ((r + c * 3) % 2 === 0) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }

    // Center Emblem Badge
    const cx = size / 2;
    const cy = size / 2;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', cx, cy);
  }

  drawPurityGauge() {
    const canvas = this.purityCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height - 20;
    const radius = 60;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0, false);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Purity gauge arc (7.5% curcumin = 95% full)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, Math.PI + Math.PI * 0.9, false);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'extrabold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('100% PURE', cx, cy - 15);
  }

  drawDigitalInvoice(order: Order, payment: PaymentDetails) {
    const canvas = this.receiptCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('SAARTHI ENTERPRISE', 20, 30);

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('GSTIN: 19AAACS1429B1Z8 • Kolkata, WB', 20, 45);
    ctx.fillText(`Order: ${order.orderNumber} • Txn: ${payment.transactionId}`, 20, 60);

    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(300, 70);
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Customer: ${order.customerName}`, 20, 90);
    ctx.fillText(`Amount Paid: ₹${order.grandTotal}`, 20, 110);
    ctx.fillText(`Payment Mode: ${payment.method}`, 20, 130);

    // Draw Barcode Pattern
    ctx.fillStyle = '#000000';
    const bx = 20;
    const by = 300;
    for (let i = 0; i < 60; i++) {
      if ((i * 7) % 3 !== 0) {
        ctx.fillRect(bx + i * 4, by, 2, 40);
      }
    }
    ctx.font = '10px monospace';
    ctx.fillText(`*${order.orderNumber}*`, 100, 355);
  }

  printReceiptCanvas() {
    const canvas = this.receiptCanvasRef?.nativeElement;
    if (!canvas) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<img src="${canvas.toDataURL()}" style="max-width:100%"/>`);
      win.print();
    }
  }

  addChefBundleToCart() {
    const prods = this.api.products();
    const gMasala = prods.find((p) => p.sku === 'SHAKTI-GM-250') || prods[0];
    const kMirch = prods.find((p) => p.sku === 'SHAKTI-KRC-500') || prods[1];
    const turmeric = prods.find((p) => p.sku === 'SHAKTI-TURM-250') || prods[2];

    if (gMasala) this.api.addToCart(gMasala, 1);
    if (kMirch) this.api.addToCart(kMirch, 1);
    if (turmeric) this.api.addToCart(turmeric, 1);

    this.activeModal.set('NONE');
    this.showCartDrawer.set(true);
    this.api.showToast("Chef's recommended spice bundle added to cart!", 'success');
  }
}
