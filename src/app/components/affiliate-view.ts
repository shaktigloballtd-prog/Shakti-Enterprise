import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import { AffiliateCampaign } from '../models/shakti.models';

@Component({
  selector: 'app-affiliate-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f1523] border border-white/5 shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <mat-icon class="text-xs">share</mat-icon>
            <span>Partner Networks & Creator Monetization</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Affiliate Marketing & Regulatory Hub
          </h1>
          <p class="text-xs text-slate-400">
            Track external affiliate referrals for heavy kitchen appliances, track real-time click telemetry, and enforce ASCI-compliant disclosures.
          </p>
        </div>

        <button
          type="button"
          (click)="copyDisclosureSnippet()"
          class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <mat-icon class="text-sm">content_copy</mat-icon>
          <span>Copy ASCI Disclosure</span>
        </button>
      </div>

      <!-- Compliance & Disclosure Banner -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#181122] to-slate-900 border border-purple-500/30 flex items-start gap-3 shadow-lg">
        <mat-icon class="text-purple-400 text-xl shrink-0 mt-0.5">verified_user</mat-icon>
        <div class="space-y-1 text-xs">
          <div class="font-bold text-purple-200">Legal Compliance Disclosure (ASCI / FTC India)</div>
          <p class="text-slate-300 leading-relaxed text-[11px]">
            "Saarthi Enterprise / SHAKTI participates in verified affiliate advertising programs. When our audience buys cookware or appliances through these curated partner links, we may earn an affiliate commission at no extra cost to you. We only recommend appliances tested for authentic spice grinding."
          </p>
        </div>
      </div>

      <!-- Metrics Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Campaigns</div>
          <div class="text-xl font-bold text-white font-mono">{{ api.affiliateCampaigns().length }}</div>
          <div class="text-[10px] text-slate-500">Live affiliate products</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tracked Clicks</div>
          <div class="text-xl font-bold text-purple-400 font-mono">{{ totalClicks() }}</div>
          <div class="text-[10px] text-slate-500">Telemetry logged</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Earnings</div>
          <div class="text-xl font-bold text-emerald-400 font-mono">₹{{ totalEstimated() | number }}</div>
          <div class="text-[10px] text-slate-500">Accrued commissions</div>
        </div>

        <div class="p-4 rounded-xl bg-[#0f1523] border border-white/5 space-y-1">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Confirmed Payouts</div>
          <div class="text-xl font-bold text-blue-400 font-mono">₹{{ totalConfirmed() | number }}</div>
          <div class="text-[10px] text-slate-500">Received into bank</div>
        </div>
      </div>

      <!-- Campaigns Table -->
      <div class="rounded-2xl bg-[#0f1523] border border-white/5 overflow-hidden shadow-xl">
        <div class="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
            Affiliate Partner Products & Link Telemetry
          </h3>
          <span class="text-[11px] text-slate-400 font-mono">
            Direct tracking via /api/affiliate/click/:id
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th class="p-3.5 pl-5">Product & Network</th>
                <th class="p-3.5">Commission Rate</th>
                <th class="p-3.5">Tracked Clicks</th>
                <th class="p-3.5">Conversions</th>
                <th class="p-3.5">Estimated Accrual</th>
                <th class="p-3.5">Confirmed Bank</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-mono">
              @for (campaign of api.affiliateCampaigns(); track campaign.id) {
                <tr class="hover:bg-slate-900/40 transition">
                  <td class="p-3.5 pl-5 font-sans">
                    <div class="space-y-0.5">
                      <div class="font-bold text-white">{{ campaign.productName }}</div>
                      <div class="flex items-center gap-1.5 text-[10px] text-purple-400 font-mono">
                        <span>{{ campaign.network }}</span>
                        <span>•</span>
                        <span class="truncate max-w-[200px] text-slate-500">{{ campaign.affiliateUrl }}</span>
                      </div>
                    </div>
                  </td>

                  <td class="p-3.5 text-amber-400 font-bold">
                    {{ campaign.commissionRate }}%
                  </td>

                  <td class="p-3.5 text-slate-200 font-bold">
                    {{ campaign.clicks }}
                  </td>

                  <td class="p-3.5 text-blue-400 font-semibold">
                    {{ campaign.conversions }}
                  </td>

                  <td class="p-3.5 text-emerald-400 font-bold">
                    ₹{{ campaign.estimatedEarnings | number }}
                  </td>

                  <td class="p-3.5 text-white font-semibold">
                    ₹{{ campaign.confirmedEarnings | number }}
                  </td>

                  <td class="p-3.5 font-sans">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      [class.bg-emerald-500/20]="campaign.status === 'ACTIVE'"
                      [class.text-emerald-400]="campaign.status === 'ACTIVE'"
                      [class.bg-slate-800]="campaign.status === 'PAUSED'"
                      [class.text-slate-400]="campaign.status === 'PAUSED'"
                    >
                      {{ campaign.status }}
                    </span>
                  </td>

                  <td class="p-3.5 text-right pr-5 font-sans">
                    <div class="inline-flex items-center gap-2">
                      <button
                        type="button"
                        (click)="testLink(campaign)"
                        class="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Simulate Click & Open Partner Link"
                      >
                        <mat-icon class="text-xs">open_in_new</mat-icon>
                        <span>Test Click</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Multi-Channel Marketplace Feeds & Affiliate Selling Hub -->
      <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <mat-icon class="text-xs">storefront</mat-icon>
              <span>Meesho, Snapdeal, Nykaa, Myntra, Amazon & Flipkart</span>
            </div>
            <h2 class="text-lg font-bold text-white">Multi-Marketplace Catalog Feeds & Selling Channels</h2>
            <p class="text-xs text-slate-400">
              Download formatted catalog CSV feeds or sync affiliate products across top Indian e-commerce marketplaces with automated commission tracking.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('meesho')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-pink-500/20 hover:border-pink-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-pink-400">Meesho</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">CSV Catalog Feed</div>
          </button>

          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('nykaa')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-500/20 hover:border-rose-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-400">Nykaa</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">Beauty & Gourmet</div>
          </button>

          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('myntra')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/20 hover:border-amber-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-400">Myntra</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">Fashion & Style Feed</div>
          </button>

          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('snapdeal')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-red-500/20 hover:border-red-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-red-400">Snapdeal</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">Vendor Feed</div>
          </button>

          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('amazon')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-yellow-500/20 hover:border-yellow-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-yellow-400">Amazon IN</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">Associates Feed</div>
          </button>

          <button
            type="button"
            (click)="api.downloadMarketplaceFeed('flipkart')"
            class="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-blue-500/20 hover:border-blue-500/40 text-left transition cursor-pointer space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-400">Flipkart</span>
              <mat-icon class="text-xs text-slate-400 group-hover:text-white">file_download</mat-icon>
            </div>
            <div class="text-[10px] text-slate-400">Seller CSV Feed</div>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AffiliateView {
  readonly api = inject(ShaktiApi);

  totalClicks(): number {
    return this.api.affiliateCampaigns().reduce((sum, c) => sum + c.clicks, 0);
  }

  totalEstimated(): number {
    return this.api.affiliateCampaigns().reduce((sum, c) => sum + c.estimatedEarnings, 0);
  }

  totalConfirmed(): number {
    return this.api.affiliateCampaigns().reduce((sum, c) => sum + c.confirmedEarnings, 0);
  }

  async testLink(campaign: AffiliateCampaign) {
    await this.api.recordAffiliateClick(campaign.id);
    this.api.showToast(`Affiliate click logged for ${campaign.productName}`, 'success');
    if (typeof window !== 'undefined' && campaign.affiliateUrl) {
      window.open(campaign.affiliateUrl, '_blank');
    }
  }

  copyDisclosureSnippet() {
    const text = `Transparency Disclosure: Saarthi Enterprise earns affiliate commissions on qualifying purchases made through our appliance and cookware links at zero extra cost to you.`;
    navigator.clipboard.writeText(text);
    this.api.showToast('ASCI Compliance Disclosure copied to clipboard!', 'info');
  }
}
