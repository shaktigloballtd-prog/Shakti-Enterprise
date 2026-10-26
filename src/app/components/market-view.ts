import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { MarketIntelligenceProduct } from '../models/shakti.models';

@Component({
  selector: 'app-market-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header & Action Ribbon -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <mat-icon class="text-xs">insights</mat-icon>
            <span>Autonomous Research & Opportunity Scoring Engine</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Market Intelligence & Product Ranking Agent
          </h1>
          <p class="text-xs text-slate-400">
            Ground-truth demand scanning across Indian small business verticals (Spices, Sarees/Fashion, Kitchenware, Dropshipping, Affiliate).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            (click)="triggerScan()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition cursor-pointer"
          >
            <mat-icon class="text-sm">refresh</mat-icon>
            <span>Scan Market Now</span>
          </button>

          <button
            type="button"
            (click)="syncToSheets()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer"
          >
            <mat-icon class="text-sm">table_chart</mat-icon>
            <span>Sync to Google Sheets</span>
          </button>

          <button
            type="button"
            (click)="exportCsv()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <mat-icon class="text-sm">download</mat-icon>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      @let rep = api.marketIntelligence();
      @if (rep) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shortlisted Products</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-white font-mono">{{ rep.products.length }}</span>
              <span class="text-xs text-emerald-400 font-medium">Verified Active</span>
            </div>
            <p class="text-[11px] text-slate-500">Across 5 Indian retail verticals</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg. Contribution Margin</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-emerald-400 font-mono">{{ rep.averageMarginPercent }}%</span>
              <span class="text-xs text-emerald-300 font-medium">After GST & Logistics</span>
            </div>
            <p class="text-[11px] text-slate-500">Net contribution profit basis</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Top Ranked Score</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-amber-400 font-mono">95 / 100</span>
              <span class="text-xs text-amber-300 font-medium">High Confidence</span>
            </div>
            <p class="text-[11px] text-slate-500">Bengali Panch Phoron 5-Spice</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 space-y-1 shadow-lg">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-black text-orange-400 font-mono">{{ pendingCount() }}</span>
              <span class="text-xs text-slate-400">Awaiting Human Sign-off</span>
            </div>
            <p class="text-[11px] text-slate-500">Explicit approval safeguard</p>
          </div>
        </div>
      }

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 p-1.5 bg-[#0f1523] rounded-2xl border border-white/5">
        <button
          type="button"
          (click)="selectedCategory.set('ALL')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'ALL'"
          [class.text-white]="selectedCategory() === 'ALL'"
          [class.text-slate-400]="selectedCategory() !== 'ALL'"
          [class.hover:text-slate-200]="selectedCategory() !== 'ALL'"
        >
          All Categories ({{ rep?.products?.length || 0 }})
        </button>

        <button
          type="button"
          (click)="selectedCategory.set('food_spices_masala')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'food_spices_masala'"
          [class.text-white]="selectedCategory() === 'food_spices_masala'"
          [class.text-slate-400]="selectedCategory() !== 'food_spices_masala'"
          [class.hover:text-slate-200]="selectedCategory() !== 'food_spices_masala'"
        >
          Spices & Shakti Masala
        </button>

        <button
          type="button"
          (click)="selectedCategory.set('fashion_sarees_kurtis')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'fashion_sarees_kurtis'"
          [class.text-white]="selectedCategory() === 'fashion_sarees_kurtis'"
          [class.text-slate-400]="selectedCategory() !== 'fashion_sarees_kurtis'"
          [class.hover:text-slate-200]="selectedCategory() !== 'fashion_sarees_kurtis'"
        >
          Fashion, Sarees & Ornaments
        </button>

        <button
          type="button"
          (click)="selectedCategory.set('household_tools_accessories')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'household_tools_accessories'"
          [class.text-white]="selectedCategory() === 'household_tools_accessories'"
          [class.text-slate-400]="selectedCategory() !== 'household_tools_accessories'"
          [class.hover:text-slate-200]="selectedCategory() !== 'household_tools_accessories'"
        >
          Household Tools & Accessories
        </button>

        <button
          type="button"
          (click)="selectedCategory.set('dropshipping_trending')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'dropshipping_trending'"
          [class.text-white]="selectedCategory() === 'dropshipping_trending'"
          [class.text-slate-400]="selectedCategory() !== 'dropshipping_trending'"
          [class.hover:text-slate-200]="selectedCategory() !== 'dropshipping_trending'"
        >
          Dropshipping Opportunities
        </button>

        <button
          type="button"
          (click)="selectedCategory.set('affiliate_appliances')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
          [class.bg-orange-500]="selectedCategory() === 'affiliate_appliances'"
          [class.text-white]="selectedCategory() === 'affiliate_appliances'"
          [class.text-slate-400]="selectedCategory() !== 'affiliate_appliances'"
          [class.hover:text-slate-200]="selectedCategory() !== 'affiliate_appliances'"
        >
          Affiliate Products & Appliances
        </button>
      </div>

      <!-- Opportunities List -->
      <div class="space-y-6">
        @for (prod of filteredProducts(); track prod.id) {
          <div class="rounded-3xl bg-[#0f1523] border border-white/5 p-6 sm:p-7 shadow-xl space-y-6 hover:border-slate-700/60 transition">
            <!-- Card Header: Title, Category, Score & Status -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/5">
              <div class="space-y-1.5 max-w-3xl">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px] border border-white/5">
                    {{ prod.categoryLabel }}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-medium text-[11px] border border-blue-500/20">
                    📍 {{ prod.targetRegion }}
                  </span>
                  @if (prod.approvalStatus === 'APPROVED') {
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[11px] border border-emerald-500/30 flex items-center gap-1">
                      <mat-icon class="text-xs">check_circle</mat-icon>
                      <span>Approved by {{ prod.approvedBy }}</span>
                    </span>
                  } @else {
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold text-[11px] border border-amber-500/30 flex items-center gap-1">
                      <mat-icon class="text-xs">pending</mat-icon>
                      <span>Awaiting Human Approval</span>
                    </span>
                  }
                </div>

                <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {{ prod.title }}
                </h2>
                <p class="text-xs text-slate-400 leading-relaxed">
                  {{ prod.scores.rankingRationale }}
                </p>
              </div>

              <!-- Product Total Score Display -->
              <div class="flex items-center gap-4 shrink-0 bg-slate-900/80 p-3.5 rounded-2xl border border-white/5">
                <div class="text-center">
                  <div class="text-3xl font-black font-mono"
                    [class.text-emerald-400]="prod.scores.totalScore >= 90"
                    [class.text-amber-400]="prod.scores.totalScore >= 80 && prod.scores.totalScore < 90"
                    [class.text-orange-400]="prod.scores.totalScore < 80"
                  >
                    {{ prod.scores.totalScore }}
                  </div>
                  <div class="text-[10px] uppercase font-bold text-slate-400">Score / 100</div>
                </div>

                <div class="h-10 w-px bg-slate-800"></div>

                <div class="text-right space-y-0.5">
                  <div class="text-[11px] font-bold text-white">
                    @switch (prod.recommendation) {
                      @case ('SCALE_CATALOG') { <span class="text-emerald-400">Scale Catalog</span> }
                      @case ('TEST_ORGANIC') { <span class="text-amber-400">Test Organic</span> }
                      @case ('IMPROVE_PRODUCT') { <span class="text-blue-400">Improve Specs</span> }
                      @case ('DISCONTINUE_AVOID') { <span class="text-rose-400">Avoid</span> }
                    }
                  </div>
                  <div class="text-[10px] text-slate-400">Confidence: {{ prod.scores.confidenceLevel }}</div>
                  <div class="text-[10px] text-slate-500">Margin: {{ prod.unitEconomics.contributionMarginPercent }}%</div>
                </div>
              </div>
            </div>

            <!-- 1. Transparent 6-Factor Product Ranking Breakdown -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-300">
                <span class="flex items-center gap-1.5">
                  <mat-icon class="text-sm text-orange-400">format_list_numbered</mat-icon>
                  <span>100-Point Scoring Breakdown (6 Transparent Criteria)</span>
                </span>
                <span class="text-slate-500 text-[11px] font-normal">No hidden weights</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Demand Evidence</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-white">{{ prod.scores.demandEvidence }}</span>
                    <span class="text-[10px] text-slate-500">/ 25</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-orange-500 h-full rounded-full" [style.width.%]="(prod.scores.demandEvidence / 25) * 100"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Customer Feedback</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-white">{{ prod.scores.customerFeedback }}</span>
                    <span class="text-[10px] text-slate-500">/ 20</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full" [style.width.%]="(prod.scores.customerFeedback / 20) * 100"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Competition & Diff.</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-white">{{ prod.scores.competitionDiff }}</span>
                    <span class="text-[10px] text-slate-500">/ 15</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full" [style.width.%]="(prod.scores.competitionDiff / 15) * 100"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Contribution Margin</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-emerald-400">{{ prod.scores.profitMargin }}</span>
                    <span class="text-[10px] text-slate-500">/ 20</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full" [style.width.%]="(prod.scores.profitMargin / 20) * 100"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Supplier Reliability</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-white">{{ prod.scores.supplierReliability }}</span>
                    <span class="text-[10px] text-slate-500">/ 10</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-cyan-500 h-full rounded-full" [style.width.%]="(prod.scores.supplierReliability / 10) * 100"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span class="text-[10px] text-slate-400 block">Operational Risk</span>
                  <div class="flex items-baseline justify-between font-mono">
                    <span class="text-base font-bold text-white">{{ prod.scores.operationalRisk }}</span>
                    <span class="text-[10px] text-slate-500">/ 10</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div class="bg-purple-500 h-full rounded-full" [style.width.%]="(prod.scores.operationalRisk / 10) * 100"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Transparent Financial Calculations (Unit Economics) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-300">
                <span class="flex items-center gap-1.5">
                  <mat-icon class="text-sm text-emerald-400">account_balance_wallet</mat-icon>
                  <span>Unit Economics & True Contribution Profit (No Hidden Fees)</span>
                </span>
                <span class="text-[11px] text-emerald-400 font-mono font-semibold">
                  Profit: ₹{{ prod.unitEconomics.contributionProfitPerUnit }} / unit ({{ prod.unitEconomics.contributionMarginPercent }}%)
                </span>
              </div>

              <div class="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/40">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400 bg-black/20">
                      <th class="p-3 font-semibold">Cost Component</th>
                      <th class="p-3 font-semibold">Amount (INR)</th>
                      <th class="p-3 font-semibold">Accounting Treatment</th>
                      <th class="p-3 font-semibold">Verification & Source Basis</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td class="p-3 font-medium text-white">Customer Selling Price</td>
                      <td class="p-3 font-mono font-bold text-white">₹{{ prod.unitEconomics.sellingPrice }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Gross Invoiced Revenue</td>
                      <td class="p-3 text-[11px] text-slate-400">Competitor benchmark & customer willingness-to-pay</td>
                    </tr>
                    <tr>
                      <td class="p-3 font-medium text-slate-300">Supplier / Procurement Cost</td>
                      <td class="p-3 font-mono text-rose-400">- ₹{{ prod.unitEconomics.supplierCost }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Cost of Goods Sold (COGS)</td>
                      <td class="p-3 text-[11px] text-slate-400">Burrabazar/Howrah/Nadia verified wholesale rate</td>
                    </tr>
                    <tr>
                      <td class="p-3 font-medium text-slate-300">GST Output Tax ({{ prod.unitEconomics.gstRate }}%)</td>
                      <td class="p-3 font-mono text-amber-300">₹{{ prod.unitEconomics.gstAmount }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Govt Liability (NOT Profit)</td>
                      <td class="p-3 text-[11px] text-slate-400">Remitted to tax authorities; offset by Input Tax Credit (ITC)</td>
                    </tr>
                    <tr>
                      <td class="p-3 font-medium text-slate-300">Packaging, Fragile Buffer & Shipping</td>
                      <td class="p-3 font-mono text-rose-400">- ₹{{ prod.unitEconomics.packagingShippingCost }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Fulfillment Expense</td>
                      <td class="p-3 text-[11px] text-slate-400">Delhivery/BlueDart volumetric slab + airtight induction seal</td>
                    </tr>
                    <tr>
                      <td class="p-3 font-medium text-slate-300">Gateway Fee (2%) & Ad/Promo Buffer</td>
                      <td class="p-3 font-mono text-rose-400">- ₹{{ prod.unitEconomics.platformFee + prod.unitEconomics.adOrAffiliateCommission }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Selling & Acquisition Cost</td>
                      <td class="p-3 text-[11px] text-slate-400">Organic marketing focus keeps blended ad cost low</td>
                    </tr>
                    <tr>
                      <td class="p-3 font-medium text-slate-300">Returns & Damage Loss Provision</td>
                      <td class="p-3 font-mono text-rose-400">- ₹{{ prod.unitEconomics.expectedDamageLoss }}</td>
                      <td class="p-3 text-[11px] text-slate-400">Risk Reserve</td>
                      <td class="p-3 text-[11px] text-slate-400">Based on {{ prod.unitEconomics.expectedReturnRatePercent }}% expected return rate</td>
                    </tr>
                    <tr class="bg-emerald-500/10 font-bold">
                      <td class="p-3 text-emerald-300 font-bold">Net Contribution Profit Per Unit</td>
                      <td class="p-3 font-mono text-emerald-300 font-bold">₹{{ prod.unitEconomics.contributionProfitPerUnit }}</td>
                      <td class="p-3 text-emerald-300 font-bold">{{ prod.unitEconomics.contributionMarginPercent }}% Margin</td>
                      <td class="p-3 text-[11px] text-emerald-400 font-semibold">Net free cash flow generated per single sale</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 3. Customer Review Intelligence (5 Classification Buckets) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-300">
                <span class="flex items-center gap-1.5">
                  <mat-icon class="text-sm text-cyan-400">forum</mat-icon>
                  <span>Customer Review Intelligence (5 Classification Buckets)</span>
                </span>
                <span class="text-slate-500 text-[11px]">Categorized from marketplace buyer reviews</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                @for (rev of prod.reviewInsights; track rev.id) {
                  <div class="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                        [class.bg-emerald-500/15]="rev.category === 'POSITIVE_FEATURES'"
                        [class.text-emerald-400]="rev.category === 'POSITIVE_FEATURES'"
                        [class.bg-rose-500/15]="rev.category === 'QUALITY_PACKAGING_COMPLAINTS'"
                        [class.text-rose-400]="rev.category === 'QUALITY_PACKAGING_COMPLAINTS'"
                        [class.bg-amber-500/15]="rev.category === 'PRICE_VALUE_OBJECTIONS'"
                        [class.text-amber-300]="rev.category === 'PRICE_VALUE_OBJECTIONS'"
                        [class.bg-blue-500/15]="rev.category === 'DELIVERY_RETURNS'"
                        [class.text-blue-300]="rev.category === 'DELIVERY_RETURNS'"
                        [class.bg-purple-500/15]="rev.category === 'UNMET_NEEDS'"
                        [class.text-purple-300]="rev.category === 'UNMET_NEEDS'"
                      >
                        {{ rev.category.replace(/_/g, ' ') }}
                      </span>
                      <span class="text-[10px] text-slate-500 font-mono">{{ rev.frequency }} Frequency</span>
                    </div>

                    <div class="text-xs font-semibold text-slate-200">{{ rev.summary }}</div>
                    <blockquote class="text-[11px] text-slate-400 italic bg-black/30 p-2 rounded-xl border border-white/5">
                      "{{ rev.evidenceQuote }}"
                    </blockquote>

                    <div class="text-[10px] text-slate-500 truncate">
                      Source: <a [href]="rev.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:underline">{{ rev.sourceUrl }}</a>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- 4. Research Sources & Limitations Log -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-300">
                <span class="flex items-center gap-1.5">
                  <mat-icon class="text-sm text-purple-400">find_in_page</mat-icon>
                  <span>Research Sources, Observations & Known Limitations</span>
                </span>
                <span class="text-slate-500 text-[11px]">Strict verification standard (no invented data)</span>
              </div>

              <div class="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/40">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400 bg-black/20">
                      <th class="p-3 font-semibold">Source</th>
                      <th class="p-3 font-semibold">Observed Facts</th>
                      <th class="p-3 font-semibold">Known Limitations</th>
                      <th class="p-3 font-semibold">Date & Link</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5 text-slate-300">
                    @for (src of prod.sources; track src.id) {
                      <tr>
                        <td class="p-3 font-semibold text-white whitespace-nowrap">{{ src.name }}</td>
                        <td class="p-3 text-[11px] text-slate-300">{{ src.observedFacts }}</td>
                        <td class="p-3 text-[11px] text-amber-300/80">{{ src.limitations }}</td>
                        <td class="p-3 text-[11px] whitespace-nowrap">
                          <span class="text-slate-400 block">{{ src.researchDate }}</span>
                          <a [href]="src.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:underline font-mono text-[10px]">
                            Visit Source ↗
                          </a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 5. Multilingual Marketing Draft & 7-Day Organic Experiment -->
            <div class="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="flex items-center gap-2 text-xs font-bold text-white">
                  <mat-icon class="text-base text-amber-400">translate</mat-icon>
                  <span>Multilingual Marketing Drafts (Bengali, Hindi, English) & 7-Day Organic Plan</span>
                </span>
                <div class="flex items-center gap-1.5 text-[11px]">
                  <span class="text-slate-400">Target Audience:</span>
                  <span class="text-amber-300 font-semibold">{{ prod.marketingDraft.targetAudience }}</span>
                </div>
              </div>

              <!-- Draft Copy Box -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-orange-400 uppercase tracking-wider">English Copy</span>
                    <button
                      type="button"
                      (click)="copyText(prod.marketingDraft.bodyEnglish)"
                      class="text-[10px] text-slate-400 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                  <div class="text-xs font-bold text-white">{{ prod.marketingDraft.hook }}</div>
                  <p class="text-xs text-slate-300 leading-relaxed">{{ prod.marketingDraft.bodyEnglish }}</p>
                </div>

                <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">বাংলা (Bengali)</span>
                    <button
                      type="button"
                      (click)="copyText(prod.marketingDraft.bodyBengali)"
                      class="text-[10px] text-slate-400 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                  <p class="text-xs text-slate-200 leading-relaxed font-sans">{{ prod.marketingDraft.bodyBengali }}</p>
                </div>

                <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">हिन्दी (Hindi)</span>
                    <button
                      type="button"
                      (click)="copyText(prod.marketingDraft.bodyHindi)"
                      class="text-[10px] text-slate-400 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                  <p class="text-xs text-slate-200 leading-relaxed font-sans">{{ prod.marketingDraft.bodyHindi }}</p>
                </div>
              </div>

              <!-- 7-Day Organic Experiment Schedule -->
              <div class="space-y-2 pt-2">
                <div class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <mat-icon class="text-sm text-blue-400">calendar_view_week</mat-icon>
                  <span>7-Day Organic Launch Experiment Plan</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                  @for (step of prod.marketingDraft.sevenDayOrganicPlan; track step.day) {
                    <div class="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                      <div class="flex items-center justify-between text-[10px] font-bold text-orange-400">
                        <span>Day {{ step.day }}</span>
                        <span class="uppercase text-[9px] text-slate-400">{{ step.platform }}</span>
                      </div>
                      <div class="text-[11px] font-semibold text-white truncate">{{ step.focus }}</div>
                      <p class="text-[10px] text-slate-400 line-clamp-2">{{ step.draftAction }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Card Actions & Approval Safeguard -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div class="text-xs text-slate-400 flex items-center gap-1.5">
                <mat-icon class="text-sm text-amber-400">gavel</mat-icon>
                <span>Explicit human approval required before publishing posts or committing marketing spend.</span>
              </div>

              <div class="flex items-center gap-2">
                @if (prod.approvalStatus !== 'APPROVED') {
                  <button
                    type="button"
                    (click)="approveOpportunity(prod)"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <mat-icon class="text-base">verified</mat-icon>
                    <span>Approve & Export to Studio</span>
                  </button>
                  <button
                    type="button"
                    (click)="rejectOpportunity(prod)"
                    class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Reject
                  </button>
                } @else {
                  <span class="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <mat-icon class="text-sm">task_alt</mat-icon>
                    <span>Exported to Studio & Social Calendar</span>
                  </span>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class MarketView {
  readonly api = inject(ShaktiApi);
  readonly selectedCategory = signal<string>('ALL');

  filteredProducts(): MarketIntelligenceProduct[] {
    const list = this.api.marketIntelligence()?.products || [];
    const cat = this.selectedCategory();
    if (cat === 'ALL') return list;
    return list.filter((p) => p.category === cat);
  }

  pendingCount(): number {
    const list = this.api.marketIntelligence()?.products || [];
    return list.filter((p) => p.approvalStatus !== 'APPROVED').length;
  }

  triggerScan() {
    this.api.runMarketResearch(this.selectedCategory());
  }

  approveOpportunity(prod: MarketIntelligenceProduct) {
    this.api.approveMarketDraft(prod.id);
  }

  rejectOpportunity(prod: MarketIntelligenceProduct) {
    this.api.rejectMarketDraft(prod.id);
  }

  exportCsv() {
    this.api.downloadMarketCsv();
  }

  async syncToSheets() {
    await this.api.syncMarketToSheets();
  }

  copyText(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    this.api.showToast('Copied draft text to clipboard!', 'success');
  }
}
