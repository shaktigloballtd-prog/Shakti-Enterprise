import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';
import {
  ContentType,
  Draft,
  LanguageType,
  LengthType,
  PlatformType,
  ToneType,
} from '../models/shakti.models';

@Component({
  selector: 'app-studio-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Studio Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
              <mat-icon class="text-lg">auto_awesome</mat-icon>
            </span>
            <h1 class="text-2xl font-extrabold text-white">AI Content Studio</h1>
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Generate high-converting multilingual scripts, viral hooks, Facebook posts, and Instagram captions.
          </p>
        </div>

        <!-- Studio View Modes -->
        <div class="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            (click)="activeSubTab.set('generator')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            [class.bg-orange-500]="activeSubTab() === 'generator'"
            [class.text-white]="activeSubTab() === 'generator'"
            [class.text-slate-400]="activeSubTab() !== 'generator'"
            [class.hover:text-slate-200]="activeSubTab() !== 'generator'"
          >
            <mat-icon class="text-sm">draw</mat-icon>
            <span>Create & Generate</span>
          </button>
          <button
            type="button"
            (click)="activeSubTab.set('drafts')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            [class.bg-orange-500]="activeSubTab() === 'drafts'"
            [class.text-white]="activeSubTab() === 'drafts'"
            [class.text-slate-400]="activeSubTab() !== 'drafts'"
            [class.hover:text-slate-200]="activeSubTab() !== 'drafts'"
          >
            <mat-icon class="text-sm">folder_open</mat-icon>
            <span>Saved Drafts ({{ api.drafts().length }})</span>
          </button>
        </div>
      </div>

      <!-- VIEW 1: GENERATOR TAB -->
      @if (activeSubTab() === 'generator') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Column: Generator Controls (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <mat-icon class="text-orange-400 text-sm">tune</mat-icon>
                  Content Parameters
                </span>
                <span class="text-[10px] text-slate-500">Multilingual Engine</span>
              </div>

              <form [formGroup]="studioForm" (ngSubmit)="onGenerate()" class="space-y-4">
                <!-- Topic / Idea Prompt -->
                <div class="space-y-1.5">
                  <label for="studio-topic-input" class="block text-xs font-semibold text-slate-300">
                    Topic / Concept Prompt <span class="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="studio-topic-input"
                    formControlName="topic"
                    rows="3"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition resize-none"
                    placeholder="e.g. How creators can scale with AI in 2026, or Bangla tech freelancing tips..."
                  ></textarea>

                  <!-- Quick Idea Chips -->
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    @for (chip of ideaSuggestions; track chip.label) {
                      <button
                        type="button"
                        (click)="applyPreset(chip)"
                        class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        {{ chip.label }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Content Type Selection -->
                <div class="space-y-1.5">
                  <label for="studio-content-type" class="block text-xs font-semibold text-slate-300">Content Format</label>
                  <select
                    id="studio-content-type"
                    formControlName="type"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="video_ideas">💡 Viral Video Ideas & Angles</option>
                    <option value="youtube_script">🎬 Full YouTube Long-form Script</option>
                    <option value="title_description">📝 High-CTR Titles & SEO Description</option>
                    <option value="facebook_post">📱 Engaging Facebook Post & Discussion</option>
                    <option value="instagram_caption">📸 Instagram Captions & Curated Hashtags</option>
                    <option value="short_video_script">⚡ 45s Reel / Shorts Script with Visual Cues</option>
                  </select>
                </div>

                <!-- Platform Target -->
                <div class="space-y-1.5">
                  <span class="block text-xs font-semibold text-slate-300">Target Platform</span>
                  <div class="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      (click)="setPlatform('youtube')"
                      class="py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer"
                      [class.bg-red-600]="studioForm.value.platform === 'youtube'"
                      [class.border-red-500]="studioForm.value.platform === 'youtube'"
                      [class.text-white]="studioForm.value.platform === 'youtube'"
                      [class.bg-slate-900]="studioForm.value.platform !== 'youtube'"
                      [class.border-slate-800]="studioForm.value.platform !== 'youtube'"
                      [class.text-slate-400]="studioForm.value.platform !== 'youtube'"
                    >
                      YouTube
                    </button>
                    <button
                      type="button"
                      (click)="setPlatform('facebook')"
                      class="py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer"
                      [class.bg-blue-600]="studioForm.value.platform === 'facebook'"
                      [class.border-blue-500]="studioForm.value.platform === 'facebook'"
                      [class.text-white]="studioForm.value.platform === 'facebook'"
                      [class.bg-slate-900]="studioForm.value.platform !== 'facebook'"
                      [class.border-slate-800]="studioForm.value.platform !== 'facebook'"
                      [class.text-slate-400]="studioForm.value.platform !== 'facebook'"
                    >
                      Facebook
                    </button>
                    <button
                      type="button"
                      (click)="setPlatform('instagram')"
                      class="py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer"
                      [class.bg-pink-600]="studioForm.value.platform === 'instagram'"
                      [class.border-pink-500]="studioForm.value.platform === 'instagram'"
                      [class.text-white]="studioForm.value.platform === 'instagram'"
                      [class.bg-slate-900]="studioForm.value.platform !== 'instagram'"
                      [class.border-slate-800]="studioForm.value.platform !== 'instagram'"
                      [class.text-slate-400]="studioForm.value.platform !== 'instagram'"
                    >
                      Instagram
                    </button>
                    <button
                      type="button"
                      (click)="setPlatform('all')"
                      class="py-2 rounded-xl text-xs font-semibold border text-center transition cursor-pointer"
                      [class.bg-purple-600]="studioForm.value.platform === 'all'"
                      [class.border-purple-500]="studioForm.value.platform === 'all'"
                      [class.text-white]="studioForm.value.platform === 'all'"
                      [class.bg-slate-900]="studioForm.value.platform !== 'all'"
                      [class.border-slate-800]="studioForm.value.platform !== 'all'"
                      [class.text-slate-400]="studioForm.value.platform !== 'all'"
                    >
                      Cross-post
                    </button>
                  </div>
                </div>

                <!-- Language Selector -->
                <div class="space-y-1.5">
                  <label for="studio-language-select" class="block text-xs font-semibold text-slate-300">
                    Language & Regional Dialect
                  </label>
                  <select
                    id="studio-language-select"
                    formControlName="language"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="english">English (Global Reach)</option>
                    <option value="bengali">বাংলা - Bengali (Native Script & Nuance)</option>
                    <option value="hindi">हिन्दी - Hindi (Authentic Indian Audience)</option>
                    <option value="bilingual">Bilingual (Hinglish / Benglish Code-switching)</option>
                  </select>
                </div>

                <!-- Tone & Length Row -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label for="studio-tone-select" class="block text-xs font-semibold text-slate-300">Tone</label>
                    <select
                      id="studio-tone-select"
                      formControlName="tone"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                    >
                      <option value="high_energy">⚡ High-Energy / Viral</option>
                      <option value="professional">💼 Professional / Expert</option>
                      <option value="inspiring">✨ Inspiring / Visionary</option>
                      <option value="educational">📚 Educational / Step-by-Step</option>
                      <option value="casual">☕ Casual / Conversational</option>
                      <option value="storytelling">📖 Storytelling / Narrative</option>
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label for="studio-length-select" class="block text-xs font-semibold text-slate-300">Length</label>
                    <select
                      id="studio-length-select"
                      formControlName="length"
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-orange-500 transition"
                    >
                      <option value="short">Short (Bite-Sized)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="long">Long (Comprehensive)</option>
                    </select>
                  </div>
                </div>

                <!-- Additional Context Input -->
                <div class="space-y-1.5">
                  <label for="studio-context-input" class="block text-xs font-semibold text-slate-300">
                    Special Directives / Target Audience (Optional)
                  </label>
                  <input
                    id="studio-context-input"
                    type="text"
                    formControlName="additionalContext"
                    class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition"
                    placeholder="e.g. Include 3 questions to spark comments, target beginners..."
                  />
                </div>

                <!-- Action Button -->
                <div class="pt-2">
                  <button
                    type="submit"
                    [disabled]="api.isGenerating() || studioForm.invalid"
                    class="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    @if (api.isGenerating()) {
                      <mat-icon class="animate-spin text-lg">sync</mat-icon>
                      <span>Architecting with Gemini 3.8 Flash...</span>
                    } @else {
                      <mat-icon class="text-lg">auto_awesome</mat-icon>
                      <span>Generate Content Asset</span>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Right Column: Generation Canvas & Editor (7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/5 space-y-4 min-h-[520px] flex flex-col justify-between">
              <div>
                <!-- Canvas Top Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <mat-icon class="text-slate-400 text-sm">edit_note</mat-icon>
                      Creative Canvas & Preview
                    </span>
                    @if (currentResult(); as res) {
                      <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                        Viral Score: {{ res.viralScore }}/100
                      </span>
                    }
                  </div>

                  @if (currentResult(); as res) {
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        (click)="copyToClipboard(editableContent())"
                        class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                        title="Copy to clipboard"
                      >
                        <mat-icon class="text-xs">content_copy</mat-icon>
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        (click)="onRegenerate()"
                        [disabled]="api.isGenerating()"
                        class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                        title="Regenerate with variations"
                      >
                        <mat-icon class="text-xs">replay</mat-icon>
                        <span>Regenerate</span>
                      </button>
                    </div>
                  }
                </div>

                <!-- Canvas Body -->
                @if (api.isGenerating()) {
                  <div class="py-24 text-center space-y-3">
                    <div class="w-12 h-12 mx-auto rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center animate-spin">
                      <mat-icon class="text-2xl">sync</mat-icon>
                    </div>
                    <div class="text-sm font-semibold text-white">Synthesizing Creative Content...</div>
                    <p class="text-xs text-slate-400 max-w-sm mx-auto">
                      Gemini 3.8 Flash is analyzing tone, hooks, audience nuance, and optimizing SEO metadata.
                    </p>
                  </div>
                } @else if (!currentResult() && !editableContent()) {
                  <div class="py-24 text-center text-slate-400 space-y-3">
                    <mat-icon class="text-5xl text-slate-600">tips_and_updates</mat-icon>
                    <p class="text-sm font-medium text-slate-300">Ready to orchestrate your next viral post.</p>
                    <p class="text-xs text-slate-500 max-w-md mx-auto">
                      Choose your format (YouTube script, Facebook update, or Instagram caption), pick language (English, বাংলা, हिन्दी), and hit Generate.
                    </p>
                  </div>
                } @else {
                  <!-- Editable Text Area -->
                  <div class="pt-3 space-y-3">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs text-slate-400">
                        <span class="font-medium">Direct Editor (Edit before saving)</span>
                        <span class="text-[11px] font-mono text-slate-500">{{ editableContent().length }} characters</span>
                      </div>
                      <textarea
                        [value]="editableContent()"
                        (input)="onContentInput($event)"
                        rows="15"
                        class="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 font-sans text-xs leading-relaxed focus:outline-none focus:border-orange-500 transition resize-y font-mono"
                      ></textarea>
                    </div>

                    <!-- Tags & Hashtags Preview -->
                    @if (currentResult()?.hashtags?.length) {
                      <div class="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span class="text-[10px] text-slate-500 font-semibold uppercase mr-1">Hashtags:</span>
                        @for (tag of currentResult()?.hashtags; track tag) {
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {{ tag }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Bottom Actions Bar -->
              @if (editableContent()) {
                <div class="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div class="text-xs text-slate-400 flex items-center gap-1.5">
                    <mat-icon class="text-emerald-400 text-sm">lock</mat-icon>
                    <span>Stored safely in local repository</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="saveAsDraft()"
                      class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <mat-icon class="text-sm">save</mat-icon>
                      <span>Save as Draft</span>
                    </button>

                    <button
                      type="button"
                      (click)="openScheduleModal()"
                      class="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <mat-icon class="text-sm">schedule</mat-icon>
                      <span>Send to Publishing Queue</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- VIEW 2: SAVED DRAFTS TAB -->
      @if (activeSubTab() === 'drafts') {
        <div class="space-y-4">
          <!-- Drafts Filter Bar -->
          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 flex-1 max-w-sm">
              <mat-icon class="text-slate-400 text-sm">search</mat-icon>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                placeholder="Search drafts by title, content, or tags..."
                class="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Platform:</span>
              <select
                [value]="selectedPlatformFilter()"
                (change)="onPlatformFilterChange($event)"
                class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
          </div>

          <!-- Drafts Grid -->
          @if (filteredDrafts().length === 0) {
            <div class="py-20 text-center text-slate-400 space-y-2 rounded-2xl bg-[#0f1523] border border-white/5">
              <mat-icon class="text-4xl text-slate-600">drafts</mat-icon>
              <p class="text-sm font-medium">No drafts match your current filter.</p>
              <button
                type="button"
                (click)="activeSubTab.set('generator')"
                class="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                Create a new draft in AI Studio &rarr;
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (draft of filteredDrafts(); track draft.id) {
                <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/5 hover:border-slate-700 transition space-y-3 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-red-500/20]="draft.platform === 'youtube'"
                        [class.text-red-400]="draft.platform === 'youtube'"
                        [class.bg-blue-500/20]="draft.platform === 'facebook'"
                        [class.text-blue-400]="draft.platform === 'facebook'"
                        [class.bg-pink-500/20]="draft.platform === 'instagram'"
                        [class.text-pink-400]="draft.platform === 'instagram'"
                        [class.bg-purple-500/20]="draft.platform === 'all'"
                        [class.text-purple-400]="draft.platform === 'all'"
                      >
                        {{ draft.platform }}
                      </span>

                      <span class="text-[10px] text-slate-500 font-mono">
                        {{ draft.language }}
                      </span>
                    </div>

                    <h3 class="text-sm font-bold text-white line-clamp-1">{{ draft.title }}</h3>
                    <p class="text-xs text-slate-400 line-clamp-4 leading-relaxed font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      {{ draft.content }}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div class="text-[10px] text-slate-500 font-mono">
                      {{ formatDate(draft.updatedAt) }}
                    </div>

                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        (click)="loadDraftToEditor(draft)"
                        class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Load into Studio Canvas"
                      >
                        <mat-icon class="text-sm">edit</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="copyToClipboard(draft.content)"
                        class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy content"
                      >
                        <mat-icon class="text-sm">content_copy</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="quickSendToCalendar(draft)"
                        class="p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white transition cursor-pointer"
                        title="Add to Publishing Calendar"
                      >
                        <mat-icon class="text-sm">event</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="api.deleteDraft(draft.id)"
                        class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition cursor-pointer"
                        title="Delete draft"
                      >
                        <mat-icon class="text-sm">delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Simple Quick Schedule Modal -->
      @if (showScheduleModal()) {
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl animate-fade-in">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-orange-400">calendar_month</mat-icon>
                <h3 class="text-base font-bold text-white">Queue for Publishing</h3>
              </div>
              <button
                type="button"
                (click)="showScheduleModal.set(false)"
                class="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="scheduleModalForm" (ngSubmit)="confirmSchedule()" class="space-y-3">
              <div class="space-y-1">
                <label for="modal-schedule-title" class="block text-xs font-semibold text-slate-300">Title</label>
                <input
                  id="modal-schedule-title"
                  type="text"
                  formControlName="title"
                  class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label for="modal-schedule-date" class="block text-xs font-semibold text-slate-300">Date</label>
                  <input
                    id="modal-schedule-date"
                    type="date"
                    formControlName="date"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div class="space-y-1">
                  <label for="modal-schedule-time" class="block text-xs font-semibold text-slate-300">Time</label>
                  <input
                    id="modal-schedule-time"
                    type="time"
                    formControlName="time"
                    class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <mat-icon class="text-base shrink-0 mt-0.5">verified_user</mat-icon>
                <p>
                  This entry will be created in <strong class="font-bold">Pending Approval</strong> state. A human reviewer must explicitly approve it before publication.
                </p>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="showScheduleModal.set(false)"
                  class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <mat-icon class="text-sm">done</mat-icon>
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class StudioView {
  readonly api = inject(ShaktiApi);

  readonly activeSubTab = signal<'generator' | 'drafts'>('generator');
  readonly currentResult = signal<{
    content: string;
    topic: string;
    type: ContentType;
    platform: PlatformType;
    language: LanguageType;
    tone: string;
    length: string;
    hashtags: string[];
    viralScore: number;
  } | null>(null);

  readonly editableContent = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly selectedPlatformFilter = signal<string>('all');
  readonly showScheduleModal = signal<boolean>(false);

  // Preset Idea Suggestions
  readonly ideaSuggestions = [
    { label: '🚀 AI Tools in 2026', topic: 'Top 5 AI tools every creator must use in 2026', type: 'youtube_script' as ContentType, lang: 'english' as LanguageType },
    { label: '🇧🇩 বাংলা ফ্রিল্যান্সিং টিপস', topic: '২০২৬ সালে বাংলা কনটেন্ট ক্রিয়েটরদের ক্যারিয়ার ও আয়ের সেরা উপায়', type: 'facebook_post' as ContentType, lang: 'bengali' as LanguageType },
    { label: '🇮🇳 Hindi Reel Hook', topic: '3 viral tricks to retain 80% viewers on Instagram Reels', type: 'short_video_script' as ContentType, lang: 'hindi' as LanguageType },
    { label: '🌐 Bilingual Launch', topic: 'Launching SHAKTI AI: Full automated social media workflow', type: 'facebook_post' as ContentType, lang: 'bilingual' as LanguageType },
  ];

  readonly studioForm = new FormGroup({
    topic: new FormControl<string>('Top 5 AI Productivity Tools in 2026 for Video Creators', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    type: new FormControl<ContentType>('youtube_script', { nonNullable: true }),
    platform: new FormControl<PlatformType>('youtube', { nonNullable: true }),
    language: new FormControl<LanguageType>('english', { nonNullable: true }),
    tone: new FormControl<ToneType>('high_energy', { nonNullable: true }),
    length: new FormControl<LengthType>('medium', { nonNullable: true }),
    additionalContext: new FormControl<string>('Targeting solo content creators and video editors.', {
      nonNullable: true,
    }),
  });

  readonly scheduleModalForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    time: new FormControl<string>('15:00', { nonNullable: true }),
  });

  setPlatform(p: PlatformType) {
    this.studioForm.patchValue({ platform: p });
  }

  applyPreset(chip: { label: string; topic: string; type: ContentType; lang: LanguageType }) {
    this.studioForm.patchValue({
      topic: chip.topic,
      type: chip.type,
      language: chip.lang,
    });
  }

  onContentInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.editableContent.set(target.value);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onPlatformFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedPlatformFilter.set(target.value);
  }

  filteredDrafts(): Draft[] {
    const query = this.searchQuery().toLowerCase().trim();
    const plat = this.selectedPlatformFilter();

    return this.api.drafts().filter((d) => {
      const matchPlat = plat === 'all' || d.platform === plat || d.platform === 'all';
      const matchQuery =
        !query ||
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.tags.some((t) => t.toLowerCase().includes(query));
      return matchPlat && matchQuery;
    });
  }

  async onGenerate() {
    if (this.studioForm.invalid) return;
    const v = this.studioForm.getRawValue();

    try {
      const res = await this.api.generateContent({
        topic: v.topic,
        type: v.type,
        platform: v.platform,
        language: v.language,
        tone: v.tone,
        length: v.length,
        additionalContext: v.additionalContext,
      });

      this.currentResult.set(res);
      this.editableContent.set(res.content);
    } catch {
      // Toast already shown by service
    }
  }

  async onRegenerate() {
    await this.onGenerate();
  }

  async saveAsDraft() {
    const text = this.editableContent();
    if (!text) return;
    const formVals = this.studioForm.getRawValue();

    const title =
      formVals.topic.length > 50 ? `${formVals.topic.substring(0, 50)}...` : formVals.topic;

    await this.api.saveDraft({
      title,
      type: formVals.type,
      platform: formVals.platform,
      language: formVals.language,
      tone: formVals.tone,
      content: text,
      tags: this.currentResult()?.hashtags || ['ai-studio', 'shakti'],
      metadata: {
        viralScore: this.currentResult()?.viralScore || 85,
        hashtags: this.currentResult()?.hashtags || [],
      },
    });

    this.activeSubTab.set('drafts');
  }

  openScheduleModal() {
    const topic = this.studioForm.getRawValue().topic;
    this.scheduleModalForm.patchValue({
      title: topic,
    });
    this.showScheduleModal.set(true);
  }

  async confirmSchedule() {
    if (this.scheduleModalForm.invalid) return;
    const val = this.scheduleModalForm.getRawValue();
    const formVals = this.studioForm.getRawValue();

    const plat: 'youtube' | 'facebook' | 'instagram' =
      formVals.platform === 'all' ? 'youtube' : formVals.platform;

    await this.api.addCalendarItem({
      title: val.title,
      platform: plat,
      plannedDate: val.date,
      plannedTime: val.time,
      contentPreview: this.editableContent().substring(0, 160),
    });

    this.showScheduleModal.set(false);
  }

  loadDraftToEditor(draft: Draft) {
    this.studioForm.patchValue({
      topic: draft.title,
      type: draft.type,
      platform: draft.platform,
      language: draft.language,
      tone: (draft.tone as ToneType) || 'high_energy',
    });
    this.editableContent.set(draft.content);
    this.activeSubTab.set('generator');
  }

  async quickSendToCalendar(draft: Draft) {
    const plat: 'youtube' | 'facebook' | 'instagram' =
      draft.platform === 'all' ? 'youtube' : draft.platform;

    await this.api.addCalendarItem({
      title: draft.title,
      draftId: draft.id,
      platform: plat,
      plannedDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      plannedTime: '16:00',
      contentPreview: draft.content.substring(0, 150),
    });
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.api.showToast('Copied content to clipboard!', 'success');
    } catch {
      this.api.showToast('Could not copy to clipboard', 'error');
    }
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }
}
