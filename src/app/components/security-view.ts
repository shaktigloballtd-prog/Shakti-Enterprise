import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

@Component({
  selector: 'app-security-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <mat-icon class="text-lg">security</mat-icon>
            </span>
            <h1 class="text-2xl font-extrabold text-white">Security, Governance & Setup Guide</h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Zero-browser-token architecture, human-in-the-loop safeguards, and beginner integration walkthroughs.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <mat-icon class="text-sm">verified_user</mat-icon>
            <span>Air-Gapped Credentials</span>
          </span>
        </div>
      </div>

      <!-- Security Policies & Safeguards Card -->
      <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-5">
        <div class="border-b border-white/5 pb-3">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <mat-icon class="text-slate-400">gavel</mat-icon>
            Enforced Security Policies
          </h2>
          <p class="text-xs text-slate-400">Hardware and software isolation rules protecting social accounts</p>
        </div>

        <form [formGroup]="policyForm" (ngSubmit)="onSavePolicies()" class="space-y-4">
          <!-- Policy 1: Human Approval -->
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="text-xs font-bold text-white flex items-center gap-2">
                <span>Human Review Sign-off Mandatory</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">Strict</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Prevents fully automated posting or unexpected social broadcasts. A registered human admin must approve every draft before it enters the live distribution pipeline.
              </p>
            </div>
            <input
              type="checkbox"
              formControlName="requireHumanApproval"
              class="w-5 h-5 rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800 shrink-0 mt-1 cursor-pointer"
            />
          </div>

          <!-- Policy 2: Rate Limit Safeguard -->
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="text-xs font-bold text-white flex items-center gap-2">
                <span>API Quota & Rate-Limit Shield</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px]">Active</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Throttles requests to YouTube Data API (10k units/day) and Meta Graph API to prevent accidental quota exhaustion or temporary IP rate-limits.
              </p>
            </div>
            <input
              type="checkbox"
              formControlName="rateLimitSafeguard"
              class="w-5 h-5 rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800 shrink-0 mt-1 cursor-pointer"
            />
          </div>

          <!-- Policy 3: Multilingual Sensitive Content Filter -->
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="text-xs font-bold text-white flex items-center gap-2">
                <span>Multilingual Brand Safety Filter</span>
                <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px]">Enabled</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                Scans generated English, Bengali, and Hindi scripts for brand safety, profanity, and sensitive cultural context before saving.
              </p>
            </div>
            <input
              type="checkbox"
              formControlName="multiLanguageFilter"
              class="w-5 h-5 rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800 shrink-0 mt-1 cursor-pointer"
            />
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-sm">save</mat-icon>
              <span>Update Security Policies</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Session Safety & Device Management Card -->
      <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <mat-icon class="text-rose-400">devices</mat-icon>
              Session Safety & Active Device Controls
            </h2>
            <p class="text-xs text-slate-400">Log out of all active staff or customer sessions across phone, desktop, or mobile web browsers.</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 font-mono font-bold border border-rose-500/20">
            Multi-Device Safety
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <div class="text-xs font-bold text-white">Staff Member Sessions</div>
              <div class="text-[11px] text-slate-400">Current Logged-in Staff: {{ api.currentUser()?.name || 'Administrator' }}</div>
            </div>
            <button
              type="button"
              (click)="api.logoutAllStaffDevices()"
              class="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <mat-icon class="text-sm">logout</mat-icon>
              <span>Log Out Staff Account From All Devices</span>
            </button>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <div class="text-xs font-bold text-white">Customer Storefront Sessions</div>
              <div class="text-[11px] text-slate-400">Active Customer: {{ api.currentCustomer()?.name || 'Guest / Not Logged In' }}</div>
            </div>
            <button
              type="button"
              (click)="api.logoutAllCustomerDevices()"
              class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-extrabold text-xs shadow-lg transition cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <mat-icon class="text-sm">power_settings_new</mat-icon>
              <span>Log Out Customer From All Devices</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Beginner Setup Guide for YouTube & Meta (No Paid Tools Needed) -->
      <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-5">
        <div class="border-b border-white/5 pb-3">
          <div class="flex items-center gap-2">
            <mat-icon class="text-orange-400">school</mat-icon>
            <h2 class="text-base font-bold text-white">Beginner Guide: Connecting Social Gateways Safely</h2>
          </div>
          <p class="text-xs text-slate-400">
            Follow these official steps to obtain free API credentials directly from Google and Meta. Zero third-party fees required.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Guide Tab 1: YouTube -->
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div class="flex items-center gap-2 text-sm font-bold text-red-400">
              <mat-icon class="text-base">ondemand_video</mat-icon>
              <span>Stage 1: Google Cloud Console & YouTube Data API v3 (Free)</span>
            </div>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed pl-1">
              <li>
                Visit the official <strong class="text-white">Google Cloud Console</strong> (<code class="text-orange-300">console.cloud.google.com</code>) and create a free project named <strong class="text-white">SHAKTI Studio</strong>.
              </li>
              <li>
                Navigate to <strong class="text-white">APIs & Services &rarr; Library</strong>, search for <strong class="text-white">YouTube Data API v3</strong>, and click <strong class="text-white">Enable</strong>.
              </li>
              <li>
                Go to <strong class="text-white">OAuth consent screen</strong>: Select <strong class="text-white">External</strong>, fill in your App Name and Email (<code class="text-slate-400">kamaldas743273&#64;gmail.com</code>).
              </li>
              <li>
                Add the minimum scopes: <code class="text-emerald-300">.../auth/youtube.upload</code> and <code class="text-emerald-300">.../auth/youtube.readonly</code>.
              </li>
              <li>
                Under <strong class="text-white">Credentials</strong>, click <strong class="text-white">Create Credentials &rarr; OAuth client ID</strong> (Web Application).
              </li>
              <li>
                Set Authorized Redirect URI to: <code class="bg-black/50 px-2 py-0.5 rounded text-amber-300 font-mono">https://ais-dev-2yop7ebq6tc4sk4x2hawez-822850197075.asia-east1.run.app/api/oauth/youtube/callback</code>.
              </li>
              <li>
                Add the generated <code class="text-slate-200">YOUTUBE_CLIENT_ID</code> and <code class="text-slate-200">YOUTUBE_CLIENT_SECRET</code> to your server environment secrets. Never commit these to git.
              </li>
            </ol>
          </div>

          <!-- Guide Tab 2: Meta Graph API -->
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div class="flex items-center gap-2 text-sm font-bold text-blue-400">
              <mat-icon class="text-base">public</mat-icon>
              <span>Stage 2: Meta for Developers (Facebook & Instagram Professional)</span>
            </div>
            <ol class="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed pl-1">
              <li>
                Visit <strong class="text-white">developers.facebook.com</strong> and register a free Developer account.
              </li>
              <li>
                Click <strong class="text-white">Create App</strong> &rarr; Select <strong class="text-white">Other &rarr; Business</strong>.
              </li>
              <li>
                Under Add Products, choose <strong class="text-white">Facebook Login for Business</strong> and <strong class="text-white">Instagram Graph API</strong>.
              </li>
              <li>
                Request permissions: <code class="text-blue-300">pages_manage_posts</code>, <code class="text-blue-300">pages_read_engagement</code>, and <code class="text-pink-300">instagram_content_publish</code>.
              </li>
              <li>
                Generate a 60-day long-lived User Token using the Graph API Explorer and exchange it for your Page Access Token.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Activity Log & Audit Trail Console -->
      <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <mat-icon class="text-slate-400">history</mat-icon>
              Complete Activity Audit Logs
            </h2>
            <p class="text-xs text-slate-400">Full audit trail of administrative actions and AI studio operations</p>
          </div>
          <span class="text-xs font-mono text-slate-400">{{ api.activityLogs().length }} entries recorded</span>
        </div>

        <div class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          @for (log of api.activityLogs(); track log.id) {
            <div class="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between gap-3">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white">{{ log.action }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{{ log.module }}</span>
                  <span
                    class="text-[10px] font-semibold"
                    [class.text-emerald-400]="log.status === 'success'"
                    [class.text-amber-400]="log.status === 'warning'"
                    [class.text-blue-400]="log.status === 'info'"
                  >
                    {{ log.status }}
                  </span>
                </div>
                <p class="text-slate-400">{{ log.details }}</p>
              </div>

              <div class="text-right shrink-0">
                <div class="text-[10px] text-slate-500 font-mono">{{ log.timestamp }}</div>
                <div class="text-[10px] text-slate-400">{{ log.actor }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SecurityView {
  readonly api = inject(ShaktiApi);

  readonly policyForm = new FormGroup({
    requireHumanApproval: new FormControl<boolean>(true, { nonNullable: true }),
    rateLimitSafeguard: new FormControl<boolean>(true, { nonNullable: true }),
    multiLanguageFilter: new FormControl<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    const s = this.api.securitySettings();
    if (s) {
      this.policyForm.patchValue({
        requireHumanApproval: s.requireHumanApproval,
        rateLimitSafeguard: s.rateLimitSafeguard,
        multiLanguageFilter: s.multiLanguageFilter,
      });
    }
  }

  async onSavePolicies() {
    const v = this.policyForm.getRawValue();
    await this.api.saveSecuritySettings(v);
  }
}
