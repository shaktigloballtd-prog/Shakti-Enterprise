import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Draft,
  CalendarItem,
  ActivityLog,
  SystemHealth,
  AnalyticsSummary,
  SecuritySettings,
  PlatformConfig,
  ContentType,
  PlatformType,
  LanguageType,
  ToneType,
  LengthType,
  Product,
  Supplier,
  Order,
  DropshipRecord,
  AffiliateCampaign,
  Account,
  JournalEntry,
  Expense,
  BusinessFinancialSummary,
  PosConfig,
  PosSyncLog,
  BusinessProfile,
  FreeToolsConfig,
  SheetsSyncResult,
  UserAccount,
  AuthResponse,
  CustomerAccount,
  CustomerAuthResponse,
  PaymentMode,
  PaymentDetails,
  MarketIntelligenceProduct,
  MarketIntelligenceReport,
  MemberTask,
  GoogleSheetsCredentials,
} from '../models/shakti.models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShaktiApi {
  private readonly http = inject(HttpClient);

  // Business Profile
  readonly businessProfile = signal<BusinessProfile>({
    name: 'Saarthi Enterprise',
    brand: 'SHAKTI',
    tagline: 'Pure Traditional Spices & Modern E-Commerce Logistics',
    email: 'contact@saarthienterprise.in',
    phone: '+91 98301 23456',
    gstin: '19AAACS1429B1Z8',
    pan: 'AAACS1429B',
    currency: 'INR',
    currencySymbol: '₹',
    state: 'West Bengal',
    city: 'Kolkata',
    address: '14/2 Netaji Subhash Road, Burrabazar, Kolkata - 700001',
    financialYear: '2026-2027',
  });

  // Business & E-Commerce Signals
  readonly products = signal<Product[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly dropshipOrders = signal<DropshipRecord[]>([]);
  readonly affiliateCampaigns = signal<AffiliateCampaign[]>([]);
  readonly chartOfAccounts = signal<Account[]>([]);
  readonly journalEntries = signal<JournalEntry[]>([]);
  readonly expenses = signal<Expense[]>([]);
  readonly businessSummary = signal<BusinessFinancialSummary | null>(null);
  readonly posConfig = signal<PosConfig | null>(null);
  readonly posSyncLogs = signal<PosSyncLog[]>([]);
  readonly freeToolsConfig = signal<FreeToolsConfig | null>(null);
  readonly googleSheetsCredentials = signal<GoogleSheetsCredentials>({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    apiKey: '',
    sheetTabName: 'Inventory_Affiliates_ERP',
    autoSyncIntervalMins: 30,
    syncStatus: 'IDLE',
    columnMapping: {
      skuCol: 'A',
      nameCol: 'B',
      stockCol: 'C',
      costCol: 'D',
      priceCol: 'E',
      affiliateIdCol: 'F',
      commissionCol: 'G',
    },
  });

  // Customer Shopping Cart Signal
  readonly cart = signal<CartItem[]>([]);

  // Preserved Social Media State Signals
  readonly drafts = signal<Draft[]>([]);
  readonly calendarItems = signal<CalendarItem[]>([]);
  readonly activityLogs = signal<ActivityLog[]>([]);
  readonly systemHealth = signal<SystemHealth | null>(null);
  readonly analytics = signal<AnalyticsSummary | null>(null);
  readonly platformConfigs = signal<Record<string, PlatformConfig>>({});
  readonly securitySettings = signal<SecuritySettings>({
    requireHumanApproval: true,
    autoScheduleEnabled: false,
    rateLimitSafeguard: true,
    logAuditRetentionDays: 90,
    multiLanguageFilter: true,
  });

  readonly isGenerating = signal<boolean>(false);
  readonly toast = signal<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Authentication & Identity Verification Signals
  readonly currentUser = signal<UserAccount | null>(null);
  readonly authToken = signal<string | null>(null);
  readonly authLoading = signal<boolean>(false);
  readonly authError = signal<string | null>(null);
  readonly testVerificationCode = signal<string | null>(null);
  readonly testResetToken = signal<string | null>(null);
  readonly testStaffOtpCode = signal<string | null>(null);
  readonly testCustomerOtpCode = signal<string | null>(null);
  readonly teamMembers = signal<UserAccount[]>([]);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Customer Account & Storefront Order Tracking Signals
  readonly currentCustomer = signal<CustomerAccount | null>(null);
  readonly customerToken = signal<string | null>(null);
  readonly customerOrders = signal<Order[]>([]);
  readonly customerAuthLoading = signal<boolean>(false);
  readonly customerAuthError = signal<string | null>(null);
  readonly isCustomerLoggedIn = computed(() => !!this.currentCustomer());

  // Market Intelligence Signals
  readonly marketIntelligence = signal<MarketIntelligenceReport | null>(null);

  // Member Tasks Signal
  readonly memberTasks = signal<MemberTask[]>([]);

  constructor() {
    this.checkAuthSession();
    this.checkCustomerSession();
    this.refreshAll();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast.set({ message, type });
    setTimeout(() => {
      if (this.toast()?.message === message) {
        this.toast.set(null);
      }
    }, 4500);
  }

  async refreshAll(): Promise<void> {
    try {
      await Promise.allSettled([
        this.fetchHealth(),
        this.fetchBusinessProfile(),
        this.fetchProducts(),
        this.fetchOrders(),
        this.fetchDropship(),
        this.fetchAffiliate(),
        this.fetchErpSummary(),
        this.fetchLedger(),
        this.fetchExpenses(),
        this.fetchPosStatus(),
        this.fetchDrafts(),
        this.fetchCalendar(),
        this.fetchActivity(),
        this.fetchPlatforms(),
        this.fetchAnalytics(),
        this.fetchSecuritySettings(),
        this.fetchFreeToolsStatus(),
        this.fetchMarketIntelligence(),
        this.fetchTasks(),
      ]);
    } catch (err) {
      console.error('Error refreshing state:', err);
    }
  }

  async fetchBusinessProfile(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<BusinessProfile>('/api/business/profile'));
      if (data) this.businessProfile.set(data);
    } catch (err) {
      console.warn('Could not fetch business profile:', err);
    }
  }

  async fetchHealth(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<SystemHealth>('/api/health'));
      this.systemHealth.set(data);
    } catch (err) {
      console.warn('Could not fetch health:', err);
    }
  }

  // ==========================================
  // PRODUCT MANAGEMENT METHODS
  // ==========================================
  async fetchProducts(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Product[]>('/api/products'));
      this.products.set(data);
    } catch (err) {
      console.warn('Could not fetch products:', err);
    }
  }

  async createProduct(p: Partial<Product>): Promise<Product> {
    try {
      const saved = await firstValueFrom(this.http.post<Product>('/api/products', p));
      this.products.update((prev) => [saved, ...prev]);
      this.fetchActivity();
      this.showToast(`Product "${saved.name}" added to inventory!`, 'success');
      return saved;
    } catch (err: unknown) {
      this.showToast('Error creating product. Please verify SKU and price.', 'error');
      throw err;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const updated = await firstValueFrom(this.http.put<Product>(`/api/products/${id}`, updates));
      this.products.update((prev) => prev.map((p) => (p.id === id ? updated : p)));
      this.fetchActivity();
      this.showToast(`Updated "${updated.name}"!`, 'success');
      return updated;
    } catch (err: unknown) {
      this.showToast('Error updating product', 'error');
      throw err;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`/api/products/${id}`));
      this.products.update((prev) => prev.filter((p) => p.id !== id));
      this.fetchActivity();
      this.showToast('Product removed from inventory', 'info');
    } catch (err: unknown) {
      this.showToast('Error deleting product', 'error');
      throw err;
    }
  }

  // ==========================================
  // ORDERS & STOREFRONT CHECKOUT METHODS
  // ==========================================
  async fetchOrders(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Order[]>('/api/orders'));
      this.orders.set(data);
    } catch (err) {
      console.warn('Could not fetch orders:', err);
    }
  }

  async placeOrder(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { street: string; city: string; state: string; pincode: string };
    items: { productId: string; quantity: number }[];
    paymentMethod: PaymentMode;
  }): Promise<Order> {
    try {
      const created = await firstValueFrom(this.http.post<Order>('/api/orders', orderData));
      this.orders.update((prev) => [created, ...prev]);
      this.fetchProducts(); // Refresh stock
      this.fetchErpSummary();
      this.fetchLedger();
      this.fetchActivity();
      this.clearCart();
      this.showToast(`Order ${created.orderNumber} successfully booked!`, 'success');
      return created;
    } catch (err: unknown) {
      this.showToast('Failed to place order. Please review items.', 'error');
      throw err;
    }
  }

  async updateOrderStatus(
    id: string,
    updates: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
      carrier?: string;
    },
  ): Promise<Order> {
    try {
      const updated = await firstValueFrom(this.http.put<Order>(`/api/orders/${id}/status`, updates));
      this.orders.update((prev) => prev.map((o) => (o.id === id ? updated : o)));
      this.fetchErpSummary();
      this.fetchActivity();
      this.showToast(`Order ${updated.orderNumber} status: ${updated.status}`, 'success');
      return updated;
    } catch (err: unknown) {
      this.showToast('Error updating order status', 'error');
      throw err;
    }
  }

  async refundOrder(id: string, reason: string, amount?: number): Promise<Order> {
    try {
      const refunded = await firstValueFrom(
        this.http.post<Order>(`/api/orders/${id}/refund`, { reason, amount }),
      );
      this.orders.update((prev) => prev.map((o) => (o.id === id ? refunded : o)));
      this.fetchProducts(); // Stock restored
      this.fetchErpSummary();
      this.fetchLedger();
      this.fetchActivity();
      this.showToast(`Refund processed for ${refunded.orderNumber}`, 'info');
      return refunded;
    } catch (err: unknown) {
      this.showToast('Error processing refund', 'error');
      throw err;
    }
  }

  // ==========================================
  // SHOPPING CART (STOREFRONT)
  // ==========================================
  addToCart(product: Product, quantity = 1) {
    if (product.sourceType === 'AFFILIATE') {
      // Trigger affiliate click tracking
      this.recordAffiliateClick(product.id);
      if (typeof window !== 'undefined' && product.affiliateUrl) {
        window.open(product.affiliateUrl, '_blank');
      }
      return;
    }

    this.cart.update((current) => {
      const idx = current.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const next = [...current];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...current, { product, quantity }];
    });
    this.showToast(`Added ${product.name} to shopping cart`, 'success');
  }

  updateCartQty(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart.update((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  removeFromCart(productId: string) {
    this.cart.update((current) => current.filter((item) => item.product.id !== productId));
    this.showToast('Item removed from cart', 'info');
  }

  clearCart() {
    this.cart.set([]);
  }

  // ==========================================
  // DROPSHIPPING & AFFILIATE METHODS
  // ==========================================
  async fetchDropship(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ orders: DropshipRecord[]; suppliers: Supplier[] }>('/api/dropship'),
      );
      this.dropshipOrders.set(data.orders);
      this.suppliers.set(data.suppliers);
    } catch (err) {
      console.warn('Could not fetch dropship data:', err);
    }
  }

  async updateDropship(id: string, updates: Partial<DropshipRecord>): Promise<DropshipRecord> {
    try {
      const updated = await firstValueFrom(
        this.http.put<DropshipRecord>(`/api/dropship/${id}`, updates),
      );
      this.dropshipOrders.update((prev) => prev.map((d) => (d.id === id ? updated : d)));
      this.showToast(`Dropship order ${updated.supplierOrderRef} updated`, 'success');
      return updated;
    } catch (err: unknown) {
      this.showToast('Error updating dropship order', 'error');
      throw err;
    }
  }

  async fetchAffiliate(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<AffiliateCampaign[]>('/api/affiliate'));
      this.affiliateCampaigns.set(data);
    } catch (err) {
      console.warn('Could not fetch affiliate data:', err);
    }
  }

  async recordAffiliateClick(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`/api/affiliate/click/${id}`, {}));
      this.fetchAffiliate();
    } catch {
      // Background click recording
    }
  }

  // ==========================================
  // FINANCIAL ERP & ACCOUNTING METHODS
  // ==========================================
  async fetchErpSummary(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<BusinessFinancialSummary>('/api/erp/summary'),
      );
      this.businessSummary.set(data);
    } catch (err) {
      console.warn('Could not fetch ERP summary:', err);
    }
  }

  async fetchLedger(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ accounts: Account[]; journalEntries: JournalEntry[] }>('/api/erp/ledger'),
      );
      this.chartOfAccounts.set(data.accounts);
      this.journalEntries.set(data.journalEntries);
    } catch (err) {
      console.warn('Could not fetch ledger:', err);
    }
  }

  async postJournalEntry(entry: {
    date: string;
    memo: string;
    reference: string;
    lines: { accountId: string; accountName: string; debit: number; credit: number }[];
  }): Promise<JournalEntry> {
    try {
      const saved = await firstValueFrom(this.http.post<JournalEntry>('/api/erp/journal', entry));
      this.journalEntries.update((prev) => [saved, ...prev]);
      this.fetchLedger();
      this.fetchErpSummary();
      this.fetchActivity();
      this.showToast(`Balanced entry ${saved.entryNumber} posted!`, 'success');
      return saved;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      this.showToast(errorObj?.error?.error || 'Failed to post entry. Total debits must equal credits.', 'error');
      throw err;
    }
  }

  async fetchExpenses(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Expense[]>('/api/erp/expenses'));
      this.expenses.set(data);
    } catch (err) {
      console.warn('Could not fetch expenses:', err);
    }
  }

  async createExpense(exp: {
    category: string;
    payee: string;
    amount: number;
    gstAmount: number;
    date: string;
    paymentMode: 'BANK' | 'CASH' | 'UPI';
    notes: string;
  }): Promise<Expense> {
    try {
      const saved = await firstValueFrom(this.http.post<Expense>('/api/erp/expenses', exp));
      this.expenses.update((prev) => [saved, ...prev]);
      this.fetchLedger();
      this.fetchErpSummary();
      this.fetchActivity();
      this.showToast(`Expense of ₹${saved.amount} booked under ${saved.category}!`, 'success');
      return saved;
    } catch (err: unknown) {
      this.showToast('Error booking expense', 'error');
      throw err;
    }
  }

  // ==========================================
  // SHAKTI MASALA POS INTEGRATION METHODS
  // ==========================================
  async fetchPosStatus(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ config: PosConfig; logs: PosSyncLog[] }>('/api/pos/status'),
      );
      this.posConfig.set(data.config);
      this.posSyncLogs.set(data.logs);
    } catch (err) {
      console.warn('Could not fetch POS status:', err);
    }
  }

  async triggerPosSync(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post('/api/pos/sync', {}, {
          headers: { 'X-Shakti-POS-Idempotency': `SYNC-${Date.now()}` },
        }),
      );
      this.fetchPosStatus();
      this.fetchProducts();
      this.fetchActivity();
      this.showToast('Shakti Masala POS sync handshake completed!', 'success');
    } catch (err: unknown) {
      this.showToast('POS sync handshake failed', 'error');
      throw err;
    }
  }

  async importPosCsv(records: { sku: string; name: string; stockQuantity: number; sellingPrice: number }[]): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; importedCount: number }>('/api/pos/import-csv', { records }),
      );
      this.fetchProducts();
      this.fetchPosStatus();
      this.fetchActivity();
      this.showToast(`Imported ${res.importedCount} products from POS CSV!`, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to import POS CSV', 'error');
      throw err;
    }
  }

  // ==========================================
  // FREE-TOOLS-FIRST ARCHITECTURE METHODS
  // ==========================================
  async fetchFreeToolsStatus(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ config: FreeToolsConfig; freeQuotas: Record<string, unknown> }>('/api/free-tools/status'),
      );
      if (data?.config) {
        this.freeToolsConfig.set(data.config);
      }
    } catch (err) {
      console.warn('Could not fetch free tools status:', err);
    }
  }

  async updateFreeToolsConfig(config: Partial<FreeToolsConfig>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.put<{ success: boolean; config: FreeToolsConfig }>('/api/free-tools/config', config),
      );
      this.freeToolsConfig.set(res.config);
      this.showToast('Free tools settings updated', 'success');
    } catch (err: unknown) {
      this.showToast('Error updating free tools configuration', 'error');
      throw err;
    }
  }

  async syncToGoogleSheets(target: 'ORDERS' | 'INVENTORY' | 'LEDGER' | 'PL'): Promise<SheetsSyncResult> {
    try {
      const res = await firstValueFrom(
        this.http.post<SheetsSyncResult>('/api/free-tools/sheets-sync', { target }),
      );
      this.fetchFreeToolsStatus();
      this.fetchActivity();
      this.showToast(res.message, res.mode === 'WEBHOOK' ? 'success' : 'info');
      return res;
    } catch (err: unknown) {
      this.showToast('Failed to sync to Google Sheets', 'error');
      throw err;
    }
  }

  async fetchAppsScriptCode(): Promise<string> {
    try {
      return await firstValueFrom(
        this.http.get('/api/free-tools/apps-script-code', { responseType: 'text' }),
      );
    } catch {
      return '// Could not load Apps Script code snippet';
    }
  }

  async downloadBackupSnapshot(): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.http.get('/api/free-tools/backup-export', { responseType: 'blob' }),
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saarthi-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.fetchFreeToolsStatus();
      this.showToast('Enterprise JSON snapshot downloaded for Google Drive / GitHub backup!', 'success');
    } catch {
      this.showToast('Failed to export backup snapshot', 'error');
    }
  }

  async restoreBackupSnapshot(snapshot: unknown): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string }>('/api/free-tools/backup-restore', { snapshot }),
      );
      await this.refreshAll();
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Invalid backup JSON snapshot', 'error');
      throw err;
    }
  }

  // ==========================================
  // SHAKTI BUSINESS ADVISOR (GEMINI 3.8 FLASH)
  // ==========================================
  async askBusinessAdvisor(prompt: string): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ reply: string; timestamp: string }>('/api/ai/business-advisor', { prompt }),
      );
      return res.reply;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Business Advisor could not process prompt.';
      this.showToast(msg, 'error');
      throw err;
    }
  }

  // ==========================================
  // PRESERVED SOCIAL MEDIA & DRAFTS METHODS
  // ==========================================
  async fetchDrafts(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Draft[]>('/api/drafts'));
      this.drafts.set(data);
    } catch (err) {
      console.warn('Could not fetch drafts:', err);
    }
  }

  async fetchCalendar(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<CalendarItem[]>('/api/calendar'));
      this.calendarItems.set(data);
    } catch (err) {
      console.warn('Could not fetch calendar:', err);
    }
  }

  async fetchActivity(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<ActivityLog[]>('/api/activity'));
      this.activityLogs.set(data);
    } catch (err) {
      console.warn('Could not fetch activity:', err);
    }
  }

  async fetchPlatforms(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ platforms: Record<string, PlatformConfig>; security: SecuritySettings }>(
          '/api/platforms/status',
        ),
      );
      if (data?.platforms) {
        this.platformConfigs.set(data.platforms);
      }
    } catch (err) {
      console.warn('Could not fetch platform configs:', err);
    }
  }

  async fetchAnalytics(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<AnalyticsSummary>('/api/analytics'));
      this.analytics.set(data);
    } catch (err) {
      console.warn('Could not fetch analytics:', err);
    }
  }

  async fetchSecuritySettings(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<SecuritySettings>('/api/security/settings'));
      if (data) {
        this.securitySettings.set(data);
      }
    } catch (err) {
      console.warn('Could not fetch security settings:', err);
    }
  }

  async generateContent(payload: {
    topic: string;
    type: ContentType;
    platform: PlatformType;
    language: LanguageType;
    tone: ToneType;
    length: LengthType;
    additionalContext?: string;
    linkedProductId?: string;
  }) {
    this.isGenerating.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<{
          success: boolean;
          content: string;
          topic: string;
          type: ContentType;
          platform: PlatformType;
          language: LanguageType;
          tone: string;
          length: string;
          hashtags: string[];
          viralScore: number;
        }>('/api/ai/generate', payload),
      );
      this.fetchActivity();
      this.showToast('AI content successfully generated with Gemini 3.8 Flash!', 'success');
      return res;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Failed to generate content. Please check API settings.';
      this.showToast(msg, 'error');
      throw err;
    } finally {
      this.isGenerating.set(false);
    }
  }

  async askManager(prompt: string) {
    try {
      const res = await firstValueFrom(
        this.http.post<{ reply: string; timestamp: string }>('/api/ai/manager', { prompt }),
      );
      return res.reply;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'AI Manager could not process the prompt.';
      this.showToast(msg, 'error');
      throw err;
    }
  }

  async saveDraft(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>): Promise<Draft> {
    try {
      const saved = await firstValueFrom(this.http.post<Draft>('/api/drafts', draft));
      this.drafts.update((prev) => [saved, ...prev]);
      this.fetchActivity();
      this.showToast(`Draft "${saved.title}" saved to studio!`, 'success');
      return saved;
    } catch (err: unknown) {
      this.showToast('Error saving draft', 'error');
      throw err;
    }
  }

  async updateDraft(id: string, updates: Partial<Draft>): Promise<Draft> {
    try {
      const updated = await firstValueFrom(this.http.put<Draft>(`/api/drafts/${id}`, updates));
      this.drafts.update((prev) => prev.map((d) => (d.id === id ? updated : d)));
      this.fetchActivity();
      this.showToast('Draft updated successfully', 'success');
      return updated;
    } catch (err: unknown) {
      this.showToast('Error updating draft', 'error');
      throw err;
    }
  }

  async deleteDraft(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`/api/drafts/${id}`));
      this.drafts.update((prev) => prev.filter((d) => d.id !== id));
      this.fetchActivity();
      this.showToast('Draft removed', 'info');
    } catch (err: unknown) {
      this.showToast('Error deleting draft', 'error');
      throw err;
    }
  }

  async addCalendarItem(item: {
    title: string;
    draftId?: string;
    platform: 'youtube' | 'facebook' | 'instagram';
    plannedDate: string;
    plannedTime: string;
    contentPreview: string;
  }): Promise<CalendarItem> {
    try {
      const created = await firstValueFrom(this.http.post<CalendarItem>('/api/calendar', item));
      this.calendarItems.update((prev) => [...prev, created]);
      this.fetchActivity();
      this.showToast('Scheduled on calendar (Pending Human Approval)', 'info');
      return created;
    } catch (err: unknown) {
      this.showToast('Error scheduling calendar item', 'error');
      throw err;
    }
  }

  async approveItem(id: string, actor = 'Human Reviewer'): Promise<CalendarItem> {
    try {
      const approved = await firstValueFrom(
        this.http.post<CalendarItem>(`/api/calendar/${id}/approve`, { actor }),
      );
      this.calendarItems.update((prev) => prev.map((c) => (c.id === id ? approved : c)));
      this.fetchActivity();
      this.showToast(`Approved "${approved.title}" for publishing`, 'success');
      return approved;
    } catch (err: unknown) {
      this.showToast('Error approving content item', 'error');
      throw err;
    }
  }

  async rejectItem(id: string, reason: string): Promise<CalendarItem> {
    try {
      const rejected = await firstValueFrom(
        this.http.post<CalendarItem>(`/api/calendar/${id}/reject`, { reason }),
      );
      this.calendarItems.update((prev) => prev.map((c) => (c.id === id ? rejected : c)));
      this.fetchActivity();
      this.showToast('Item rejected and returned to draft stage', 'info');
      return rejected;
    } catch (err: unknown) {
      this.showToast('Error rejecting content item', 'error');
      throw err;
    }
  }

  async deleteCalendarItem(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`/api/calendar/${id}`));
      this.calendarItems.update((prev) => prev.filter((c) => c.id !== id));
      this.fetchActivity();
      this.showToast('Item removed from calendar', 'info');
    } catch (err: unknown) {
      this.showToast('Error removing item from calendar', 'error');
      throw err;
    }
  }

  async saveSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.http.put<SecuritySettings>('/api/security/settings', settings),
      );
      this.securitySettings.set(updated);
      this.fetchActivity();
      this.showToast('Security policy and safeguards updated', 'success');
    } catch (err: unknown) {
      this.showToast('Error updating security settings', 'error');
      throw err;
    }
  }

  async disconnectPlatform(platform: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`/api/platforms/${platform}/disconnect`, {}));
      this.fetchPlatforms();
      this.fetchActivity();
      this.showToast(`Safely revoked and disconnected ${platform.toUpperCase()}`, 'info');
    } catch (err: unknown) {
      this.showToast(`Failed to disconnect ${platform}`, 'error');
      throw err;
    }
  }

  // ==========================================
  // AUTHENTICATION & IDENTITY VERIFICATION METHODS
  // ==========================================
  async checkAuthSession(): Promise<void> {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('shakti_session_token');
    if (!token) return;

    this.authToken.set(token);
    try {
      const res = await firstValueFrom(
        this.http.get<AuthResponse>('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      if (res.success && res.user) {
        this.currentUser.set(res.user);
        if (res.testVerificationCode) {
          this.testVerificationCode.set(res.testVerificationCode);
        }
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  async login(credentials: { email: string; password: string; rememberMe?: boolean }): Promise<boolean> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/login', credentials),
      );
      if (res.success && res.user && res.token) {
        this.currentUser.set(res.user);
        this.authToken.set(res.token);
        if (res.testVerificationCode) {
          this.testVerificationCode.set(res.testVerificationCode);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_session_token', res.token);
        }
        this.showToast(`Welcome back, ${res.user.name}!`, 'success');
        this.refreshAll();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Authentication failed. Please check credentials.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async register(payload: { email: string; password: string; name?: string }): Promise<boolean> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/register', payload),
      );
      if (res.success && res.user && res.token) {
        this.currentUser.set(res.user);
        this.authToken.set(res.token);
        if (res.testVerificationCode) {
          this.testVerificationCode.set(res.testVerificationCode);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_session_token', res.token);
        }
        this.showToast('Account created! Please verify your email.', 'success');
        this.refreshAll();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Registration failed.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async setupFirstAdmin(payload: { email?: string; password: string; name?: string }): Promise<boolean> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/setup-first-admin', payload),
      );
      if (res.success && res.user && res.token) {
        this.currentUser.set(res.user);
        this.authToken.set(res.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_session_token', res.token);
        }
        this.showToast('Master Administrator configured successfully!', 'success');
        this.refreshAll();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'First admin setup failed.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    const token = this.authToken();
    if (token) {
      try {
        await firstValueFrom(this.http.post('/api/auth/logout', { token }));
      } catch {
        // Ignore network error on logout
      }
    }
    this.currentUser.set(null);
    this.authToken.set(null);
    this.authError.set(null);
    this.testVerificationCode.set(null);
    this.testResetToken.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shakti_session_token');
    }
    this.showToast('Logged out safely. Private pages protected.', 'info');
  }

  async verifyEmail(token: string): Promise<boolean> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/verify-email', { token }),
      );
      if (res.success && res.user) {
        this.currentUser.set(res.user);
        this.testVerificationCode.set(null);
        this.showToast('Email verified successfully! Full access granted.', 'success');
        return true;
      }
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Email verification failed.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async resendVerification(email?: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/resend-verification', {
          email: email || this.currentUser()?.email,
        }),
      );
      if (res.testVerificationCode) {
        this.testVerificationCode.set(res.testVerificationCode);
      }
      this.showToast(res.message || 'Verification token sent.', 'info');
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      this.showToast(errorObj?.error?.error || 'Could not resend verification.', 'error');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/forgot-password', { email }),
      );
      if (res.resetTokenForTesting) {
        this.testResetToken.set(res.resetTokenForTesting);
      }
      this.showToast(res.message || 'Password reset link sent.', 'info');
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      this.showToast(errorObj?.error?.error || 'Request failed.', 'error');
    } finally {
      this.authLoading.set(false);
    }
  }

  async resetPassword(payload: { token: string; newPassword: string }): Promise<boolean> {
    this.authLoading.set(true);
    this.authError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/reset-password', payload),
      );
      this.testResetToken.set(null);
      this.showToast(res.message || 'Password reset successfully. Please log in.', 'success');
      return true;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Password reset failed.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async sendStaffOtp(email: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; testOtpCode?: string }>('/api/auth/send-otp', { email }),
      );
      if (res.testOtpCode) {
        this.testStaffOtpCode.set(res.testOtpCode);
      }
      this.showToast(res.message, 'info');
      return true;
    } catch {
      this.showToast('Failed to send OTP code.', 'error');
      return false;
    }
  }

  async verifyStaffOtp(email: string, otpCode: string): Promise<boolean> {
    this.authLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/verify-otp', { email, otpCode }),
      );
      if (res.success && res.user) {
        this.currentUser.set(res.user);
        this.testStaffOtpCode.set(null);
        this.showToast('OTP verified! Welcome to SHAKTI AI workspace.', 'success');
        return true;
      }
      this.authError.set(res.error || 'OTP verification failed.');
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Invalid or expired OTP code.';
      this.authError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.authLoading.set(false);
    }
  }

  async fetchTeam(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ team: UserAccount[] }>('/api/auth/team'),
      );
      if (res && res.team) {
        this.teamMembers.set(res.team);
      }
    } catch (err) {
      console.warn('Could not fetch team:', err);
    }
  }

  async assignRoleModules(userId: string, role: string, assignedModules: string[], status = 'ACTIVE'): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; user: UserAccount }>('/api/auth/team/assign', {
          userId,
          role,
          assignedModules,
          status,
        }),
      );
      this.fetchTeam();
      this.showToast(res.message, 'success');
      return true;
    } catch {
      this.showToast('Failed to update role/task delegation.', 'error');
      return false;
    }
  }

  async getAiCulinaryAdvice(dishName: string, desiredTasteProfile: string): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; advice: string }>('/api/ai/culinary-advisor', {
          dishName,
          desiredTasteProfile,
        }),
      );
      return res.advice;
    } catch {
      return `[SHAKTI CHEF AI] Recommended Spice Ratio for ${dishName}:
• Lakadong Turmeric (7.5% Curcumin): 1 tsp
• Pure Kashmiri Mirch: 1.5 tbsp
• Royal Garam Masala: 1/2 tsp at finish
• Temper whole spices in warm oil for 30s to unlock stone-ground essential volatile oils.`;
    }
  }

  // ==========================================
  // MARKET INTELLIGENCE AGENT METHODS
  // ==========================================
  async fetchMarketIntelligence(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<MarketIntelligenceReport>('/api/market-intelligence'),
      );
      if (data) {
        this.marketIntelligence.set(data);
      }
    } catch (err) {
      console.warn('Could not fetch market intelligence:', err);
    }
  }

  async runMarketResearch(category?: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<MarketIntelligenceReport>('/api/market-intelligence/run-research', { category }),
      );
      this.marketIntelligence.set(res);
      this.fetchActivity();
      this.showToast('Market scan and review intelligence analysis refreshed!', 'success');
    } catch {
      this.showToast('Failed to run market research', 'error');
    }
  }

  async approveMarketDraft(productId: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; product: MarketIntelligenceProduct; draftId: string }>(
          `/api/market-intelligence/approve/${productId}`,
          {},
        ),
      );
      this.fetchMarketIntelligence();
      this.fetchDrafts();
      this.fetchCalendar();
      this.fetchActivity();
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to approve market draft', 'error');
      throw err;
    }
  }

  async rejectMarketDraft(productId: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`/api/market-intelligence/reject/${productId}`, {}));
      this.fetchMarketIntelligence();
      this.showToast('Opportunity archived as rejected.', 'info');
    } catch {
      this.showToast('Failed to reject opportunity', 'error');
    }
  }

  async downloadMarketCsv(): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.http.get('/api/market-intelligence/export-csv', { responseType: 'blob' }),
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shakti_market_intelligence_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.showToast('Market intelligence CSV report downloaded!', 'success');
    } catch {
      this.showToast('Failed to download CSV', 'error');
    }
  }

  async syncMarketToSheets(): Promise<SheetsSyncResult> {
    try {
      const res = await firstValueFrom(
        this.http.post<SheetsSyncResult>('/api/market-intelligence/sync-sheets', {}),
      );
      this.showToast(res.message, res.mode === 'WEBHOOK' ? 'success' : 'info');
      return res;
    } catch {
      this.showToast('Failed to sync market data to Sheets', 'error');
      throw new Error('Sync failed');
    }
  }

  // ==========================================
  // STOREFRONT CUSTOMER ACCOUNT & PAYMENT
  // ==========================================
  async checkCustomerSession(): Promise<void> {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('shakti_customer_token');
    if (!token) return;

    this.customerToken.set(token);
    try {
      const res = await firstValueFrom(
        this.http.get<{ success: boolean; customer: CustomerAccount }>('/api/customer/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      if (res && res.customer) {
        this.currentCustomer.set(res.customer);
        this.fetchCustomerOrders();
      }
    } catch {
      localStorage.removeItem('shakti_customer_token');
      this.customerToken.set(null);
      this.currentCustomer.set(null);
    }
  }

  async verifyCustomerOtp(email: string, otpCode: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<CustomerAuthResponse>('/api/customer/verify-otp', { email, otpCode }),
      );
      if (res.success) {
        if (res.customer) this.currentCustomer.set(res.customer);
        this.showToast('Customer OTP verified successfully!', 'success');
        return true;
      }
      return false;
    } catch {
      this.showToast('Invalid customer OTP code', 'error');
      return false;
    }
  }

  async loginCustomer(credentials: { email: string; password: string }): Promise<boolean> {
    this.customerAuthLoading.set(true);
    this.customerAuthError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<CustomerAuthResponse>('/api/customer/login', credentials),
      );
      if (res.success && res.customer && res.token) {
        this.currentCustomer.set(res.customer);
        this.customerToken.set(res.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_customer_token', res.token);
        }
        this.fetchCustomerOrders();
        this.showToast(res.message || `Welcome back, ${res.customer.name}!`, 'success');
        return true;
      }
      this.customerAuthError.set(res.error || 'Login failed.');
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Customer login failed. Check email or password.';
      this.customerAuthError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.customerAuthLoading.set(false);
    }
  }

  async registerCustomer(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: { street: string; city: string; state: string; pincode: string };
  }): Promise<boolean> {
    this.customerAuthLoading.set(true);
    this.customerAuthError.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<CustomerAuthResponse>('/api/customer/register', payload),
      );
      if (res.success && res.customer && res.token) {
        this.currentCustomer.set(res.customer);
        this.customerToken.set(res.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shakti_customer_token', res.token);
        }
        this.fetchCustomerOrders();
        this.showToast(res.message || 'Account created! 50 Shakti loyalty coins awarded.', 'success');
        return true;
      }
      this.customerAuthError.set(res.error || 'Registration failed.');
      return false;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      const msg = errorObj?.error?.error || 'Registration failed.';
      this.customerAuthError.set(msg);
      this.showToast(msg, 'error');
      return false;
    } finally {
      this.customerAuthLoading.set(false);
    }
  }

  async logoutCustomer(): Promise<void> {
    const token = this.customerToken();
    if (token) {
      try {
        await firstValueFrom(this.http.post('/api/customer/logout', { token }));
      } catch {
        // silent
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shakti_customer_token');
    }
    this.currentCustomer.set(null);
    this.customerToken.set(null);
    this.customerOrders.set([]);
    this.showToast('You have been signed out of your customer account.', 'info');
  }

  async fetchCustomerOrders(): Promise<void> {
    const token = this.customerToken();
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const email = this.currentCustomer()?.email;
      const url = email ? `/api/customer/orders?email=${encodeURIComponent(email)}` : '/api/customer/orders';
      const orders = await firstValueFrom(this.http.get<Order[]>(url, { headers }));
      if (Array.isArray(orders)) {
        this.customerOrders.set(orders);
      }
    } catch (err) {
      console.warn('Could not fetch customer orders:', err);
    }
  }

  async verifyPayment(payload: {
    orderId: string;
    method: PaymentMode;
    upiVpa?: string;
    upiApp?: 'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM' | 'CRED' | 'OTHER';
    cardLast4?: string;
    cardBrand?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'MAESTRO';
    bankName?: string;
    amount?: number;
  }): Promise<{ success: boolean; message: string; transactionId: string; order: Order; payment: PaymentDetails }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; transactionId: string; order: Order; payment: PaymentDetails }>(
          '/api/customer/payment-verify',
          payload,
        ),
      );
      this.fetchOrders();
      this.fetchCustomerOrders();
      this.fetchErpSummary();
      this.showToast(res.message, 'success');
      return res;
    } catch (err: unknown) {
      this.showToast('Payment verification failed', 'error');
      throw err;
    }
  }

  async cancelCustomerOrder(orderId: string, reason: string): Promise<Order> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; order: Order }>(
          `/api/customer/orders/${orderId}/cancel`,
          { reason },
        ),
      );
      this.fetchOrders();
      this.fetchCustomerOrders();
      this.fetchProducts();
      this.fetchErpSummary();
      this.showToast(res.message, 'info');
      return res.order;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      this.showToast(errorObj?.error?.error || 'Cancellation failed', 'error');
      throw err;
    }
  }

  async requestCustomerReturn(orderId: string, reason: string): Promise<Order> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; order: Order }>(
          `/api/customer/orders/${orderId}/request-return`,
          { reason },
        ),
      );
      this.fetchOrders();
      this.fetchCustomerOrders();
      this.showToast(res.message, 'info');
      return res.order;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string } };
      this.showToast(errorObj?.error?.error || 'Return request failed', 'error');
      throw err;
    }
  }

  async logoutAllStaffDevices(): Promise<void> {
    const token = this.authToken();
    try {
      await firstValueFrom(
        this.http.post('/api/auth/logout-all-devices', {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      );
      this.showToast('Successfully logged out of all active staff sessions across all devices!', 'info');
      this.logout();
    } catch {
      this.logout();
    }
  }

  async logoutAllCustomerDevices(): Promise<void> {
    const token = this.customerToken();
    try {
      await firstValueFrom(
        this.http.post('/api/customer/logout-all-devices', {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      );
      this.showToast('Logged out of all customer sessions across all devices.', 'info');
      this.logoutCustomer();
    } catch {
      this.logoutCustomer();
    }
  }

  // ==========================================
  // MEMBER TASK BOARD & AI PROPOSAL METHODS
  // ==========================================
  async fetchTasks(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<MemberTask[]>('/api/tasks'));
      if (Array.isArray(data)) {
        this.memberTasks.set(data);
      }
    } catch (err) {
      console.warn('Could not fetch tasks:', err);
    }
  }

  async createTask(task: Partial<MemberTask>): Promise<MemberTask> {
    try {
      const created = await firstValueFrom(this.http.post<MemberTask>('/api/tasks', task));
      this.memberTasks.update((prev) => [created, ...prev]);
      this.fetchActivity();
      this.showToast(`Task "${created.title}" assigned to ${created.assignedToUserName}!`, 'success');
      return created;
    } catch (err: unknown) {
      this.showToast('Failed to assign task', 'error');
      throw err;
    }
  }

  async updateTask(id: string, updates: Partial<MemberTask>): Promise<MemberTask> {
    try {
      const updated = await firstValueFrom(this.http.put<MemberTask>(`/api/tasks/${id}`, updates));
      this.memberTasks.update((prev) => prev.map((t) => (t.id === id ? updated : t)));
      this.showToast(`Task "${updated.title}" updated`, 'success');
      return updated;
    } catch (err: unknown) {
      this.showToast('Error updating task', 'error');
      throw err;
    }
  }

  async executeTaskAiProposal(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; task: MemberTask }>(
          `/api/tasks/${id}/execute-ai-proposal`,
          {},
        ),
      );
      this.fetchTasks();
      this.fetchProducts();
      this.fetchDrafts();
      this.fetchActivity();
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to execute AI proposal', 'error');
      throw err;
    }
  }

  // ==========================================
  // GOOGLE SHEETS ERP & MARKETPLACE FEED METHODS
  // ==========================================
  async syncGoogleSheetsErp(rows?: unknown[]): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; syncedRecords: number }>(
          '/api/erp/google-sheets-sync',
          { sheetName: 'GoogleSheets_ERP', rows: rows || [] },
        ),
      );
      this.fetchProducts();
      this.fetchActivity();
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to sync with Google Sheets ERP', 'error');
      throw err;
    }
  }

  downloadMarketplaceFeed(platform: string): void {
    const url = `/api/marketplace-feed/${platform}`;
    window.open(url, '_blank');
    this.showToast(`Downloading ${platform.toUpperCase()} catalog CSV feed...`, 'info');
  }

  async fetchGoogleSheetsCredentials(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<GoogleSheetsCredentials>('/api/erp/google-sheets-credentials'));
      if (data) {
        this.googleSheetsCredentials.set(data);
      }
    } catch (err) {
      console.warn('Could not fetch Google Sheets credentials:', err);
    }
  }

  async saveGoogleSheetsCredentials(updates: Partial<GoogleSheetsCredentials>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; credentials: GoogleSheetsCredentials }>(
          '/api/erp/google-sheets-credentials',
          updates,
        ),
      );
      if (res.credentials) {
        this.googleSheetsCredentials.set(res.credentials);
      }
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to save Google Sheets credentials', 'error');
      throw err;
    }
  }

  async syncGoogleSheetsNow(accessToken?: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{
          success: boolean;
          message: string;
          syncResultCount: number;
          affiliateSyncCount: number;
          lastSyncedAt: string;
        }>('/api/erp/google-sheets-sync-now', { accessToken }),
      );
      this.fetchGoogleSheetsCredentials();
      this.fetchProducts();
      this.fetchActivity();
      this.showToast(res.message, 'success');
    } catch (err: unknown) {
      this.showToast('Failed to sync Google Sheets ERP', 'error');
      throw err;
    }
  }
}

