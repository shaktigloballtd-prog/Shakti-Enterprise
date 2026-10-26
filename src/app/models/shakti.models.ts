export type PlatformType = 'youtube' | 'facebook' | 'instagram' | 'all';

export type ContentType =
  | 'video_ideas'
  | 'youtube_script'
  | 'title_description'
  | 'facebook_post'
  | 'instagram_caption'
  | 'short_video_script';

export type LanguageType = 'english' | 'bengali' | 'hindi' | 'bilingual';

export type ToneType =
  | 'professional'
  | 'casual'
  | 'inspiring'
  | 'high_energy'
  | 'educational'
  | 'storytelling';

export type LengthType = 'short' | 'medium' | 'long';

// ==========================================
// SOCIAL MEDIA AI TYPES (PRESERVED)
// ==========================================
export interface Draft {
  id: string;
  title: string;
  type: ContentType;
  platform: PlatformType;
  language: LanguageType;
  tone: string;
  content: string;
  tags: string[];
  metadata: {
    hook?: string;
    estimatedDuration?: string;
    hashtags?: string[];
    viralScore?: number;
    format?: string;
    linkedProductId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CalendarItem {
  id: string;
  title: string;
  draftId?: string;
  platform: 'youtube' | 'facebook' | 'instagram';
  plannedDate: string;
  plannedTime: string;
  contentStatus: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'failed';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  contentPreview: string;
  publicationResult?: {
    success: boolean;
    message: string;
    timestamp?: string;
    platformId?: string;
  };
}

export interface PlatformConfig {
  connected: boolean;
  status: 'ready' | 'setup_required' | 'disconnected' | 'error';
  accountName?: string;
  channelId?: string;
  pageName?: string;
  pageId?: string;
  isProfessional?: boolean;
  scopes?: string[];
  permissions?: string[];
  lastSync?: string;
  error?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  module:
    | 'ai_studio'
    | 'calendar'
    | 'security'
    | 'youtube'
    | 'facebook'
    | 'instagram'
    | 'system'
    | 'ecommerce'
    | 'inventory'
    | 'dropship'
    | 'affiliate'
    | 'accounting'
    | 'pos_integration';
  status: 'success' | 'warning' | 'info' | 'error';
  details: string;
  timestamp: string;
}

export interface SystemHealth {
  status: string;
  version: string;
  model: string;
  geminiApiKeyConfigured: boolean;
  platforms: {
    youtube: string;
    facebook: string;
    instagram: string;
  };
  database: {
    driver: string;
    draftsCount: number;
    calendarCount: number;
    logsCount: number;
    productsCount?: number;
    ordersCount?: number;
    journalCount?: number;
  };
  security: {
    requireHumanApproval: boolean;
    noBrowserTokens: boolean;
    serverSideSecrets: boolean;
  };
  timestamp: string;
}

export interface AnalyticsSummary {
  summary: {
    totalImpressions: number;
    totalReach: number;
    totalEngagements: number;
    avgEngagementRate: string;
    totalFollowers: number;
  };
  byPlatform: {
    youtube: {
      configured: boolean;
      status: string;
      subscribers: number | null;
      views: number | null;
      watchHours: number | null;
      notes: string;
    };
    facebook: {
      configured: boolean;
      status: string;
      pageLikes: number | null;
      reach: number | null;
      engagements: number | null;
      notes: string;
    };
    instagram: {
      configured: boolean;
      status: string;
      followers: number | null;
      reelPlays: number | null;
      saves: number | null;
      notes: string;
    };
  };
  performanceHistory: { date: string; views: number; engagement: number }[];
  snapshots: {
    id: string;
    date: string;
    title: string;
    highlights: string;
  }[];
}

export interface SecuritySettings {
  requireHumanApproval: boolean;
  autoScheduleEnabled: boolean;
  rateLimitSafeguard: boolean;
  logAuditRetentionDays: number;
  multiLanguageFilter: boolean;
}

// ==========================================
// E-COMMERCE & PRODUCT MANAGEMENT TYPES
// ==========================================
export type ProductSourceType = 'OWN_PRODUCT' | 'DROPSHIP' | 'AFFILIATE';
export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'DISCONTINUED';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  sourceType: ProductSourceType;
  purchaseCost: number;
  sellingPrice: number;
  gstRate: number; // e.g., 5, 12, 18, 0
  packagingCost: number;
  shippingCost: number;
  otherCosts: number;
  stockQuantity: number;
  reservedStock: number;
  availableStock: number;
  supplierId?: string;
  supplierName?: string;
  affiliateUrl?: string;
  commissionRate?: number;
  weightKg?: number;
  dimensions?: string;
  status: ProductStatus;
  salesChannel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin?: string;
  city: string;
  rating: number;
  productsSupplied: number;
  leadTimeDays: number;
  status: 'ACTIVE' | 'ON_HOLD';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  gstin?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  sourceType: ProductSourceType;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  subtotal: number;
  supplierId?: string;
}

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'ONLINE' | 'UPI' | 'NET_BANKING' | 'COD';
  trackingNumber?: string;
  carrier?: string;
  supplierOrderRef?: string;
  returnReason?: string;
  refundAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// DROPSHIPPING MODULE TYPES
// ==========================================
export interface DropshipRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  supplierId: string;
  supplierName: string;
  supplierCost: number;
  customerPrice: number;
  estimatedMargin: number;
  supplierOrderRef: string;
  supplierStatus: 'PENDING_REVIEW' | 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string;
  carrier?: string;
  supplierPaid: boolean;
  notes?: string;
  createdAt: string;
}

// ==========================================
// AFFILIATE MARKETING MODULE TYPES
// ==========================================
export interface AffiliateCampaign {
  id: string;
  productId: string;
  productName: string;
  network: string;
  affiliateUrl: string;
  commissionRate: number;
  commissionType: 'PERCENTAGE' | 'FIXED';
  clicks: number;
  conversions: number;
  estimatedEarnings: number;
  confirmedEarnings: number;
  status: 'ACTIVE' | 'PAUSED';
  disclosure: string;
  campaignSource: string;
  createdAt: string;
}

// ==========================================
// FINANCIAL ERP & ACCOUNTING TYPES
// ==========================================
export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  balance: number;
  description: string;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  memo: string;
  reference: string;
  lines: JournalLine[];
  status: 'POSTED' | 'DRAFT';
  total: number;
  createdAt: string;
}

export type ExpenseCategory =
  | 'RENT'
  | 'ELECTRICITY'
  | 'STAFF_SALARY'
  | 'MARKETING'
  | 'PACKAGING'
  | 'DELIVERY'
  | 'SOFTWARE'
  | 'BANK_FEES'
  | 'TRAVEL'
  | 'REPAIRS'
  | 'OTHER';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  payee: string;
  amount: number;
  gstAmount: number;
  date: string;
  paymentMode: 'BANK' | 'CASH' | 'UPI';
  notes: string;
  receiptUrl?: string;
}

export interface BusinessFinancialSummary {
  grossSales: number;
  discountsAndReturns: number;
  netSales: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  cashReceived: number;
  outstandingReceivables: number;
  supplierPayables: number;
  gstCollected: number;
  inputGstPaid: number;
  netGstPayable: number;
}

// ==========================================
// SHAKTI MASALA POS INTEGRATION TYPES
// ==========================================
export interface PosConfig {
  configured: boolean;
  status: 'DISCONNECTED' | 'READY_FOR_WEBHOOK' | 'SYNCED' | 'ERROR';
  endpoint: string;
  apiKeyMasked: string;
  lastSyncTimestamp?: string;
  syncFrequency: string;
  supportedEntities: string[];
  fieldMappingDocumentation: string;
  errorMessage?: string;
}

export interface PosSyncLog {
  id: string;
  timestamp: string;
  action: 'PRODUCT_PUSH' | 'INVOICE_PULL' | 'INVENTORY_SYNC' | 'MANUAL_IMPORT';
  recordsProcessed: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  details: string;
}

// ==========================================
// SAARTHI ENTERPRISE MASTER PROFILE
// ==========================================
export interface BusinessProfile {
  name: string;
  brand: string;
  tagline: string;
  email: string;
  phone: string;
  gstin: string;
  pan: string;
  currency: string;
  currencySymbol: string;
  state: string;
  city: string;
  address: string;
  financialYear: string;
}

// ==========================================
// FREE-TOOLS-FIRST ARCHITECTURE TYPES
// ==========================================
export interface FreeToolsConfig {
  googleAppsScriptUrl?: string;
  googleSheetName?: string;
  autoSyncOrders: boolean;
  canvaDefaultPreset: string;
  geminiRequestsToday: number;
  geminiFreeLimitDaily: number;
  lastBackupTimestamp?: string;
  lastSheetsSyncTimestamp?: string;
}

export interface GoogleSheetsCredentials {
  spreadsheetId: string;
  spreadsheetUrl?: string;
  apiKey?: string;
  sheetTabName: string;
  autoSyncIntervalMins: number;
  lastSyncedAt?: string;
  syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
  lastErrorMessage?: string;
  columnMapping: {
    skuCol: string;
    nameCol: string;
    stockCol: string;
    costCol: string;
    priceCol: string;
    affiliateIdCol: string;
    commissionCol: string;
  };
}

export interface SheetsSyncResult {
  success: boolean;
  mode: 'WEBHOOK' | 'MANUAL_TSV';
  syncedRecords: number;
  targetSheet: string;
  timestamp: string;
  tsvContent?: string;
  message: string;
}

export interface BackupSnapshot {
  exportedAt: string;
  appVersion: string;
  business: string;
  stats: {
    products: number;
    orders: number;
    dropshipOrders: number;
    affiliateCampaigns: number;
    journalEntries: number;
    expenses: number;
    drafts: number;
  };
  data: unknown;
}

// ==========================================
// AUTHENTICATION & IDENTITY VERIFICATION
// ==========================================
export interface MemberTask {
  id: string;
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToUserName: string;
  ledgerModule: 'inventory' | 'orders' | 'erp' | 'social_media' | 'dropship' | 'analytics';
  targetGoal?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  aiProposal?: {
    type: 'REORDER_STOCK' | 'SOCIAL_DRAFT' | 'RECONCILE_PAYMENT';
    payload: Record<string, unknown>;
    executed: boolean;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type StaffRole =
  | 'admin'
  | 'inventory_manager'
  | 'accountant'
  | 'social_marketer'
  | 'dropship_coordinator'
  | 'store_manager'
  | 'staff';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: StaffRole;
  assignedModules: string[];
  isEmailVerified: boolean;
  isOtpVerified?: boolean;
  testOtpCode?: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  createdAt: string;
  lastLogin?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: string;
  verificationToken?: string;
  verificationTokenExpires?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserAccount;
  token?: string;
  message?: string;
  error?: string;
  verificationSent?: boolean;
  testVerificationCode?: string;
  testOtpCode?: string;
  resetTokenForTesting?: string;
}

// ==========================================
// STOREFRONT CUSTOMER ACCOUNT & PAYMENT
// ==========================================
export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isOtpVerified?: boolean;
  testOtpCode?: string;
  savedAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  loyaltyCoins: number;
  totalOrdersCount: number;
  createdAt: string;
  lastLogin?: string;
}

export interface CustomerAuthResponse {
  success: boolean;
  customer?: CustomerAccount;
  token?: string;
  message?: string;
  error?: string;
  testOtpCode?: string;
}

export type PaymentMode = 'UPI' | 'ONLINE' | 'CARD' | 'NET_BANKING' | 'COD';

export interface PaymentDetails {
  method: PaymentMode;
  transactionId: string;
  upiVpa?: string;
  upiApp?: 'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM' | 'CRED' | 'OTHER';
  cardLast4?: string;
  cardBrand?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'MAESTRO';
  bankName?: string;
  paidAmount: number;
  paymentTimestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

// ==========================================
// MARKET INTELLIGENCE AGENT TYPES
// ==========================================
export type MarketCategory =
  | 'fashion_sarees_kurtis'
  | 'food_spices_masala'
  | 'household_tools_accessories'
  | 'dropshipping_trending'
  | 'affiliate_appliances'
  | 'regional_bengal';

export interface ResearchSource {
  id: string;
  name: string;
  sourceUrl: string;
  researchDate: string;
  observedFacts: string;
  limitations: string;
  status: 'ACCESSIBLE' | 'UNAVAILABLE' | 'RATE_LIMITED';
}

export interface ReviewInsight {
  id: string;
  category:
    | 'POSITIVE_FEATURES'
    | 'QUALITY_PACKAGING_COMPLAINTS'
    | 'PRICE_VALUE_OBJECTIONS'
    | 'DELIVERY_RETURNS'
    | 'UNMET_NEEDS';
  summary: string;
  evidenceQuote: string;
  sourceUrl: string;
  frequency: 'HIGH' | 'MEDIUM' | 'LOW';
  sentimentScore: number; // 1 to 5
}

export interface ProductScoreBreakdown {
  demandEvidence: number; // Max 25
  customerFeedback: number; // Max 20
  competitionDiff: number; // Max 15
  profitMargin: number; // Max 20
  supplierReliability: number; // Max 10
  operationalRisk: number; // Max 10
  totalScore: number; // Max 100
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  unknownFactors: string[];
  rankingRationale: string;
}

export interface UnitEconomics {
  supplierCost: number;
  sellingPrice: number;
  gstRate: number; // e.g. 5, 12, 18
  gstAmount: number;
  packagingShippingCost: number;
  platformFee: number;
  adOrAffiliateCommission: number;
  expectedReturnRatePercent: number; // e.g. 6%
  expectedDamageLoss: number;
  contributionProfitPerUnit: number;
  contributionMarginPercent: number;
  costAssumptions: string[];
}

export interface MarketingDraft {
  headline: string;
  hook: string;
  bodyEnglish: string;
  bodyBengali: string;
  bodyHindi: string;
  targetAudience: string;
  painPointAddressed: string;
  sevenDayOrganicPlan: {
    day: number;
    platform: string;
    focus: string;
    draftAction: string;
  }[];
}

export interface MarketIntelligenceProduct {
  id: string;
  title: string;
  category: MarketCategory;
  categoryLabel: string;
  targetRegion: string;
  scores: ProductScoreBreakdown;
  unitEconomics: UnitEconomics;
  reviewInsights: ReviewInsight[];
  sources: ResearchSource[];
  marketingDraft: MarketingDraft;
  recommendation: 'TEST_ORGANIC' | 'SCALE_CATALOG' | 'IMPROVE_PRODUCT' | 'DISCONTINUE_AVOID';
  actualPerformance?: {
    sales: number;
    actualProfit: number;
    roiPercent: number;
  };
  approvalStatus: 'NEEDS_APPROVAL' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  approvedBy?: string;
  lastUpdated: string;
}

export interface MarketIntelligenceReport {
  lastUpdated: string;
  status: 'FRESH' | 'UPDATING' | 'OFFLINE_READY';
  totalOpportunities: number;
  averageMarginPercent: number;
  products: MarketIntelligenceProduct[];
}

