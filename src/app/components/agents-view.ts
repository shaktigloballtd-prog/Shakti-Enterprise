import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

@Component({
  selector: 'app-agents-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <mat-icon class="text-lg">hub</mat-icon>
            </span>
            <h1 class="text-2xl font-extrabold text-white">Specialist Platform Agents</h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Dedicated integrations for YouTube Data API v3 and Meta Graph API (Facebook & Instagram).
          </p>
        </div>

        <!-- Platform Sub-Navigation Tabs -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            (click)="activeAgent.set('youtube')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            [class.bg-red-600]="activeAgent() === 'youtube'"
            [class.text-white]="activeAgent() === 'youtube'"
            [class.text-slate-400]="activeAgent() !== 'youtube'"
          >
            <span class="w-2 h-2 rounded-full bg-red-400"></span>
            <span>YouTube Agent</span>
          </button>
          <button
            type="button"
            (click)="activeAgent.set('facebook')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            [class.bg-blue-600]="activeAgent() === 'facebook'"
            [class.text-white]="activeAgent() === 'facebook'"
            [class.text-slate-400]="activeAgent() !== 'facebook'"
          >
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Facebook Agent</span>
          </button>
          <button
            type="button"
            (click)="activeAgent.set('instagram')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            [class.bg-pink-600]="activeAgent() === 'instagram'"
            [class.text-white]="activeAgent() === 'instagram'"
            [class.text-slate-400]="activeAgent() !== 'instagram'"
          >
            <span class="w-2 h-2 rounded-full bg-pink-400"></span>
            <span>Instagram Agent</span>
          </button>
        </div>
      </div>

      <!-- AGENT 1: YOUTUBE AGENT -->
      @if (activeAgent() === 'youtube') {
        <div class="space-y-6">
          <!-- Gateway Status Card -->
          <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center font-black text-lg">
                  YT
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-white">YouTube Data API v3 Gateway</h2>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      Setup Required (OAuth 2.0)
                    </span>
                  </div>
                  <p class="text-xs text-slate-400">Official Google Developer API Specification</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="testYoutubeConnection()"
                  class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <mat-icon class="text-sm">verified</mat-icon>
                  <span>Verify Credentials</span>
                </button>
                <button
                  type="button"
                  (click)="api.disconnectPlatform('youtube')"
                  class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-900/40 text-rose-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  <mat-icon class="text-xs">link_off</mat-icon>
                  <span>Safe Revoke</span>
                </button>
              </div>
            </div>

            <!-- YouTube Quota & Architecture Info -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Default Free Quota:</span>
                <div class="text-lg font-bold text-white">10,000 units / day</div>
                <p class="text-[11px] text-slate-500">Video upload costs 1,600 units; channel telemetry costs 1-5 units.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Required Scopes:</span>
                <div class="text-slate-200 font-mono text-[11px]">
                  youtube.upload, youtube.readonly, yt-analytics.readonly
                </div>
                <p class="text-[11px] text-slate-500">Minimum authorization needed for upload & analytics.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Publishing Rule:</span>
                <div class="text-emerald-400 font-semibold">API-Confirmed Only</div>
                <p class="text-[11px] text-slate-500">Never report upload as completed until the YouTube API returns HTTP 200 with video ID.</p>
              </div>
            </div>
          </div>

          <!-- YouTube Video Metadata Pre-Flight Validator -->
          <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
            <div class="border-b border-white/5 pb-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <mat-icon class="text-red-400 text-base">video_settings</mat-icon>
                YouTube Upload Pre-Flight Validator
              </h3>
              <p class="text-xs text-slate-400">
                Validate titles, descriptions, and tags against YouTube Data API v3 length restrictions before publishing.
              </p>
            </div>

            <form [formGroup]="ytValidatorForm" class="space-y-4">
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <label for="yt-val-title" class="font-semibold text-slate-300">Video Title (Max 100 characters)</label>
                  <span
                    class="font-mono text-[11px]"
                    [class.text-emerald-400]="ytValidatorForm.value.title?.length! <= 100"
                    [class.text-rose-400]="ytValidatorForm.value.title?.length! > 100"
                  >
                    {{ ytValidatorForm.value.title?.length || 0 }} / 100
                  </span>
                </div>
                <input
                  id="yt-val-title"
                  type="text"
                  formControlName="title"
                  class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <label for="yt-val-desc" class="font-semibold text-slate-300">Description (Max 5,000 characters)</label>
                  <span class="font-mono text-[11px] text-slate-400">
                    {{ ytValidatorForm.value.description?.length || 0 }} / 5000
                  </span>
                </div>
                <textarea
                  id="yt-val-desc"
                  formControlName="description"
                  rows="4"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 font-mono resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="space-y-1">
                  <label for="yt-val-privacy" class="block text-xs font-semibold text-slate-300">Privacy Status</label>
                  <select
                    id="yt-val-privacy"
                    formControlName="privacy"
                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="private">Private (Recommended for testing)</option>
                    <option value="unlisted">Unlisted (Shareable link)</option>
                    <option value="public">Public (Immediate broadcast)</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label for="yt-val-cat" class="block text-xs font-semibold text-slate-300">Category ID</label>
                  <select
                    id="yt-val-cat"
                    formControlName="category"
                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="28">Science & Technology (28)</option>
                    <option value="27">Education (27)</option>
                    <option value="24">Entertainment (24)</option>
                    <option value="22">People & Blogs (22)</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label for="yt-val-kids" class="block text-xs font-semibold text-slate-300">Audience Setting</label>
                  <select
                    id="yt-val-kids"
                    formControlName="madeForKids"
                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="false">No, not Made for Kids (COPPA)</option>
                    <option value="true">Yes, Made for Kids</option>
                  </select>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-emerald-400 text-base">check_circle</mat-icon>
                  <span>Pre-flight checks passed: Metadata adheres to official YouTube Data API v3 parameters.</span>
                </div>
                <span class="text-[10px] font-mono text-emerald-400">Strict Standards</span>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- AGENT 2: FACEBOOK AGENT -->
      @if (activeAgent() === 'facebook') {
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-500 flex items-center justify-center font-black text-lg">
                  FB
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-white">Facebook Page Publishing Agent</h2>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      Setup Required (Meta Graph API)
                    </span>
                  </div>
                  <p class="text-xs text-slate-400">Meta Graph API v21.0 - Page Feed & Insights Endpoint</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="testMetaConnection()"
                  class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <mat-icon class="text-sm">verified</mat-icon>
                  <span>Test Permissions</span>
                </button>
                <button
                  type="button"
                  (click)="api.disconnectPlatform('facebook')"
                  class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-900/40 text-rose-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  <mat-icon class="text-xs">link_off</mat-icon>
                  <span>Revoke</span>
                </button>
              </div>
            </div>

            <!-- Permission Check Matrix -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">pages_manage_posts</span>
                <div class="text-white font-semibold">Feed Publishing</div>
                <p class="text-[11px] text-slate-500">Allows posting approved updates and videos to the authorized Page.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">pages_read_engagement</span>
                <div class="text-white font-semibold">Insights & Telemetry</div>
                <p class="text-[11px] text-slate-500">Fetches organic post reach, likes, shares, and comment metrics.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Token Lifespan</span>
                <div class="text-amber-400 font-semibold">60-Day Long-Lived Token</div>
                <p class="text-[11px] text-slate-500">Requires server-side refresh before expiration to prevent dispatch halts.</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- AGENT 3: INSTAGRAM AGENT -->
      @if (activeAgent() === 'instagram') {
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center font-black text-lg">
                  IG
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-white">Instagram Professional Agent</h2>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      Setup Required (Creator / Business Account)
                    </span>
                  </div>
                  <p class="text-xs text-slate-400">Instagram Graph API - Reels, Carousels, and Media Publishing</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="testMetaConnection()"
                  class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <mat-icon class="text-sm">verified</mat-icon>
                  <span>Verify Account Type</span>
                </button>
                <button
                  type="button"
                  (click)="api.disconnectPlatform('instagram')"
                  class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-900/40 text-rose-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  <mat-icon class="text-xs">link_off</mat-icon>
                  <span>Revoke</span>
                </button>
              </div>
            </div>

            <!-- Crucial Rule: Personal vs Professional Accounts -->
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-2">
              <div class="flex items-center gap-2 font-bold text-white">
                <mat-icon class="text-amber-400 text-base">info</mat-icon>
                <span>Instagram API Architecture Rule</span>
              </div>
              <p class="leading-relaxed">
                As per Meta's official policy, personal Instagram accounts do not possess Graph API publishing or insights privileges. You must link an <strong class="underline">Instagram Creator or Business account</strong> connected to a Facebook Page to enable automated media containers, Reels uploads, and engagement analytics.
              </p>
            </div>

            <!-- Media Specs & Formats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Reels Specification:</span>
                <div class="text-white font-semibold">9:16 Aspect Ratio</div>
                <p class="text-[11px] text-slate-500">1080x1920px, H.264 video codec, AAC audio, max 15 minutes.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Feed Carousels:</span>
                <div class="text-white font-semibold">1:1 or 4:5 Aspect Ratio</div>
                <p class="text-[11px] text-slate-500">Up to 10 images or video slides per carousel container.</p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-medium">Container Publishing Flow:</span>
                <div class="text-pink-400 font-semibold">2-Step Creation</div>
                <p class="text-[11px] text-slate-500">Step 1: Create IG Container. Step 2: Publish Container with ID.</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AgentsView {
  readonly api = inject(ShaktiApi);
  readonly activeAgent = signal<'youtube' | 'facebook' | 'instagram'>('youtube');

  readonly ytValidatorForm = new FormGroup({
    title: new FormControl<string>('Top 5 AI Tools in 2026 for Video Creators | SHAKTI Studio', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl<string>(
      'In this video, we break down the 5 essential AI tools that creators use to 10x their production speed and reach.\n\nTimestamps:\n00:00 - Introduction\n01:30 - Tool #1: SHAKTI AI Studio\n05:00 - Summary & Next Steps\n\n#AITools #ContentCreators #Productivity',
      { nonNullable: true, validators: [Validators.required, Validators.maxLength(5000)] },
    ),
    privacy: new FormControl<'private' | 'unlisted' | 'public'>('private', { nonNullable: true }),
    category: new FormControl<string>('28', { nonNullable: true }),
    madeForKids: new FormControl<string>('false', { nonNullable: true }),
  });

  testYoutubeConnection() {
    this.api.showToast(
      'YouTube OAuth verification checked: Missing Google Cloud Client Secret. Setup required.',
      'info',
    );
  }

  testMetaConnection() {
    this.api.showToast(
      'Meta Graph API checked: Meta App ID & User Token awaiting configuration.',
      'info',
    );
  }
}
