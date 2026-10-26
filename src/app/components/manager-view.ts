import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

interface ChatMessage {
  sender: 'user' | 'shakti';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-manager-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Top Section Header & Tab Switcher -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <mat-icon class="text-lg">smart_toy</mat-icon>
            </span>
            <h1 class="text-2xl font-extrabold text-white">SHAKTI Executive Hub</h1>
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              AI Advisor & Role Task Delegation
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Grounded in Saarthi Enterprise real-time inventory, double-entry financial ledger, and team role authorizations.
          </p>
        </div>

        <!-- Section View Mode Switcher -->
        <div class="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            (click)="activeTab.set('ADVISOR')"
            class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            [class.bg-cyan-600]="activeTab() === 'ADVISOR'"
            [class.text-white]="activeTab() === 'ADVISOR'"
            [class.text-slate-400]="activeTab() !== 'ADVISOR'"
          >
            <mat-icon class="text-sm">psychology</mat-icon>
            <span>AI Advisor</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('TEAM'); api.fetchTeam()"
            class="px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            [class.bg-purple-600]="activeTab() === 'TEAM'"
            [class.text-white]="activeTab() === 'TEAM'"
            [class.text-slate-400]="activeTab() !== 'TEAM'"
          >
            <mat-icon class="text-sm">badge</mat-icon>
            <span>Team & Role Ledgers</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: AI BUSINESS ADVISOR -->
      @if (activeTab() === 'ADVISOR') {
        <!-- Quick Action Strategic Prompt Chips -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-semibold text-slate-400">Quick Strategic & Accounting Inquiries:</span>
          <div class="flex flex-wrap gap-2">
            @for (chip of promptChips; track chip) {
              <button
                type="button"
                (click)="sendPresetPrompt(chip)"
                [disabled]="isThinking()"
                class="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
              >
                <mat-icon class="text-xs text-cyan-400">arrow_outward</mat-icon>
                <span>{{ chip }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Conversational Chat Console -->
        <div class="rounded-2xl bg-[#0f1523] border border-white/5 flex flex-col h-[560px] overflow-hidden shadow-xl">
          <!-- Chat History -->
          <div class="flex-1 p-5 overflow-y-auto space-y-4">
            @for (msg of messages(); track msg.timestamp + msg.sender) {
              <div
                class="flex gap-3 max-w-3xl"
                [class.ml-auto]="msg.sender === 'user'"
                [class.flex-row-reverse]="msg.sender === 'user'"
              >
                <!-- Avatar -->
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md"
                  [class.bg-orange-500]="msg.sender === 'user'"
                  [class.text-white]="msg.sender === 'user'"
                  [class.bg-gradient-to-tr]="msg.sender === 'shakti'"
                  [class.from-cyan-600]="msg.sender === 'shakti'"
                  [class.to-blue-600]="msg.sender === 'shakti'"
                  [class.text-cyan-100]="msg.sender === 'shakti'"
                >
                  @if (msg.sender === 'user') {
                    KD
                  } @else {
                    ⚡
                  }
                </div>

                <!-- Message Bubble -->
                <div
                  class="p-4 rounded-2xl text-xs leading-relaxed border space-y-2"
                  [class.bg-slate-800]="msg.sender === 'user'"
                  [class.border-slate-700]="msg.sender === 'user'"
                  [class.text-slate-100]="msg.sender === 'user'"
                  [class.bg-[#12192c]]="msg.sender === 'shakti'"
                  [class.border-cyan-500/20]="msg.sender === 'shakti'"
                  [class.text-slate-200]="msg.sender === 'shakti'"
                >
                  <div class="whitespace-pre-line leading-relaxed font-sans">
                    {{ msg.text }}
                  </div>

                  <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                    <span>{{ msg.timestamp }}</span>
                    @if (msg.sender === 'shakti') {
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          (click)="copyMessage(msg.text)"
                          class="hover:text-white transition cursor-pointer flex items-center gap-1"
                        >
                          <mat-icon class="text-xs">content_copy</mat-icon>
                          <span>Copy</span>
                        </button>
                        <button
                          type="button"
                          (click)="saveAdviceAsDraft(msg.text)"
                          class="hover:text-cyan-300 transition cursor-pointer flex items-center gap-1"
                        >
                          <mat-icon class="text-xs">bookmark_add</mat-icon>
                          <span>Save as Draft</span>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            @if (isThinking()) {
              <div class="flex gap-3 max-w-xl">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-cyan-100 flex items-center justify-center text-xs font-bold shadow-md animate-pulse">
                  ⚡
                </div>
                <div class="p-4 rounded-2xl bg-[#12192c] border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>SHAKTI AI analyzing double-entry ledger & inventory telemetry...</span>
                </div>
              </div>
            }
          </div>

          <!-- Chat Input Bar -->
          <form [formGroup]="chatForm" (ngSubmit)="onSend()" class="p-3 bg-[#0a0e17] border-t border-white/5 flex gap-2">
            <input
              type="text"
              formControlName="message"
              placeholder="Ask about live sales, low-stock masalas, GST calculation, or marketing strategy..."
              class="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              [disabled]="chatForm.invalid || isThinking()"
              class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-sm">send</mat-icon>
              <span>Ask SHAKTI</span>
            </button>
          </form>
        </div>
      }

      <!-- TAB 2: TEAM & ROLE TASK DELEGATION -->
      @if (activeTab() === 'TEAM') {
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-[#0f1523] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-bold text-white">Team Members & Assigned Tasks</h2>
              <p class="text-xs text-slate-400">Admins assign specific role ledgers and task permissions to team members.</p>
            </div>
            <button
              type="button"
              (click)="api.fetchTeam()"
              class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5"
            >
              <mat-icon class="text-sm">sync</mat-icon>
              <span>Refresh Team List</span>
            </button>
          </div>

          <!-- Delegated Task Board with 1-Tap AI Proposal Execution -->
          <div class="p-5 rounded-2xl bg-[#0f1523] border border-white/10 space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-400">task_alt</mat-icon>
                  <h2 class="text-sm font-bold text-white">Delegated Task Board & AI Proposals</h2>
                </div>
                <p class="text-xs text-slate-400">Tasks assigned by Admin with target goals, due dates, and 1-tap AI action proposals.</p>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                {{ api.memberTasks().length }} Tasks
              </span>
            </div>

            <!-- Member Tasks List -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (task of api.memberTasks(); track task.id) {
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white flex items-center gap-2">
                      <span>{{ task.title }}</span>
                    </span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                          [class.bg-emerald-500/20]="task.status === 'COMPLETED'"
                          [class.text-emerald-300]="task.status === 'COMPLETED'"
                          [class.bg-amber-500/20]="task.status === 'PENDING'"
                          [class.text-amber-300]="task.status === 'PENDING'">
                      {{ task.status }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-300">{{ task.description }}</p>

                  <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Assigned to: <strong class="text-slate-200">{{ task.assignedToUserName }}</strong></span>
                    <span>Due: <strong class="text-amber-400">{{ task.dueDate }}</strong></span>
                    <span class="capitalize">Module: {{ task.ledgerModule }}</span>
                  </div>

                  <!-- 1-Tap AI Proposal Execution Card -->
                  @if (task.aiProposal) {
                    <div class="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="text-cyan-300 font-bold flex items-center gap-1">
                          <mat-icon class="text-xs">auto_awesome</mat-icon>
                          AI Action Proposal: {{ task.aiProposal.type }}
                        </span>
                        <span class="text-[10px] text-slate-400" [class.text-emerald-400]="task.aiProposal.executed">
                          {{ task.aiProposal.executed ? 'Executed' : 'Ready' }}
                        </span>
                      </div>

                      @if (!task.aiProposal.executed) {
                        <button
                          type="button"
                          (click)="api.executeTaskAiProposal(task.id)"
                          class="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <mat-icon class="text-sm">bolt</mat-icon>
                          <span>1-Tap Execute AI Proposal</span>
                        </button>
                      } @else {
                        <div class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <mat-icon class="text-xs">check_circle</mat-icon>
                          <span>Action completed successfully</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ManagerView implements OnInit {
  readonly api = inject(ShaktiApi);
  readonly activeTab = signal<'ADVISOR' | 'TEAM'>('ADVISOR');
  readonly isThinking = signal<boolean>(false);

  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'shakti',
      text: `Namaste Kamal! I am SHAKTI AI, your Chief Executive & Operations Advisor for Saarthi Enterprise.

I am connected live to your business data:
• Storefront orders & customer loyalty coins
• 100% stone-ground spice inventory & low-stock alerts
• Double-entry general ledger & chart of accounts
• GST reconciliation (CGST / SGST / IGST)
• Team role task authorizations and OTP verification logs

How can I advise your enterprise today?`,
      timestamp: '09:00 AM',
    },
  ]);

  readonly promptChips = [
    'Summarize today\'s business performance & net profit',
    'Identify low-stock spice items needing reorder',
    'Calculate net GST liability and input tax credits',
    'Draft a promotional launch campaign for Royal Garam Masala in Bengali',
  ];

  readonly chatForm = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  ngOnInit() {
    this.api.fetchTeam();
  }

  async onSend() {
    if (this.chatForm.invalid || this.isThinking()) return;
    const text = this.chatForm.getRawValue().message;
    this.chatForm.reset({ message: '' });

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.update((prev) => [...prev, { sender: 'user', text, timestamp: now }]);

    this.isThinking.set(true);
    try {
      const reply = await this.api.askBusinessAdvisor(text);
      this.messages.update((prev) => [
        ...prev,
        {
          sender: 'shakti',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      // Error handled via toast
    } finally {
      this.isThinking.set(false);
    }
  }

  sendPresetPrompt(prompt: string) {
    this.chatForm.patchValue({ message: prompt });
    this.onSend();
  }

  async copyMessage(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.api.showToast('Copied advice to clipboard!', 'success');
    } catch {
      this.api.showToast('Could not copy to clipboard', 'error');
    }
  }

  async saveAdviceAsDraft(text: string) {
    await this.api.saveDraft({
      title: 'SHAKTI Executive Strategy Brief',
      type: 'facebook_post',
      platform: 'all',
      language: 'english',
      tone: 'professional',
      content: text,
      tags: ['executive-brief', 'business-strategy'],
      metadata: { viralScore: 92, hashtags: ['#SaarthiEnterprise', '#BusinessIntelligence'] },
    });
  }
}
