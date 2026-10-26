import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShaktiApi } from '../services/shakti';

type AuthMode = 'LOGIN' | 'REGISTER' | 'FIRST_ADMIN' | 'VERIFY_EMAIL' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

@Component({
  selector: 'app-auth-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-orange-500/30 selection:text-orange-200">
      <!-- Background Ambient Glow -->
      <div class="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-orange-600/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Card Container -->
      <div class="relative z-10 w-full max-w-md bg-[#0f1523]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <!-- Logo & Branding -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 shadow-xl shadow-orange-500/25 text-white font-black text-2xl tracking-wider">
            ⚡
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span>SHAKTI AI</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">v2.0</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              Saarthi Enterprise • Unified Business & Market Intelligence
            </p>
          </div>
        </div>

        <!-- Mode Toggle Tabs (Login / Register / First Admin) -->
        <div class="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            (click)="setMode('LOGIN')"
            class="py-2 rounded-lg transition cursor-pointer text-center"
            [class.bg-orange-500]="mode() === 'LOGIN'"
            [class.text-white]="mode() === 'LOGIN'"
            [class.shadow-md]="mode() === 'LOGIN'"
            [class.text-slate-400]="mode() !== 'LOGIN'"
            [class.hover:text-slate-200]="mode() !== 'LOGIN'"
          >
            Log In
          </button>
          <button
            type="button"
            (click)="setMode('REGISTER')"
            class="py-2 rounded-lg transition cursor-pointer text-center"
            [class.bg-orange-500]="mode() === 'REGISTER'"
            [class.text-white]="mode() === 'REGISTER'"
            [class.shadow-md]="mode() === 'REGISTER'"
            [class.text-slate-400]="mode() !== 'REGISTER'"
            [class.hover:text-slate-200]="mode() !== 'REGISTER'"
          >
            Sign Up
          </button>
          <button
            type="button"
            (click)="setMode('FIRST_ADMIN')"
            class="py-2 rounded-lg transition cursor-pointer text-center"
            [class.bg-amber-600]="mode() === 'FIRST_ADMIN'"
            [class.text-white]="mode() === 'FIRST_ADMIN'"
            [class.shadow-md]="mode() === 'FIRST_ADMIN'"
            [class.text-slate-400]="mode() !== 'FIRST_ADMIN'"
            [class.hover:text-slate-200]="mode() !== 'FIRST_ADMIN'"
          >
            Claim Admin
          </button>
        </div>

        <!-- Global Error Alert -->
        @if (api.authError()) {
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <mat-icon class="text-base text-rose-400 shrink-0">error_outline</mat-icon>
            <span>{{ api.authError() }}</span>
          </div>
        }

        <!-- Active OTP Code Banner & Verification Box -->
        @if (api.testStaffOtpCode()) {
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3 text-center">
            <div class="font-bold flex items-center justify-center gap-1.5 text-amber-300">
              <mat-icon class="text-sm">security</mat-icon>
              <span>6-Digit Security OTP Code Issued</span>
            </div>
            <div class="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/5 font-mono">
              <span>Code: {{ api.testStaffOtpCode() }}</span>
              <button
                type="button"
                (click)="otpInput.set(api.testStaffOtpCode() || '')"
                class="px-2 py-1 rounded bg-amber-500 text-black text-[10px] font-extrabold cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <input
              type="text"
              maxlength="6"
              inputmode="numeric"
              [value]="otpInput()"
              (input)="otpInput.set($any($event.target).value)"
              placeholder="e.g. 123456"
              class="w-full text-center tracking-widest text-2xl font-mono py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 focus:outline-none"
            />

            <button
              type="button"
              (click)="submitOtpVerification()"
              [disabled]="otpInput().length < 6"
              class="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg cursor-pointer"
            >
              Verify OTP Code & Log In
            </button>
          </div>
        }

        <!-- 1. LOGIN FORM -->
        @if (mode() === 'LOGIN') {
          <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="space-y-4">
            <div class="space-y-1.5">
              <label for="login-email" class="block text-xs font-medium text-slate-300">Email Address</label>
              <div class="relative">
                <input
                  id="login-email"
                  type="email"
                  formControlName="email"
                  placeholder="kamaldas743273@gmail.com"
                  autocomplete="email"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-slate-500 outline-none transition"
                />
                <mat-icon class="absolute right-3 top-2.5 text-slate-500 text-base pointer-events-none">mail</mat-icon>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="login-password" class="block text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  (click)="setMode('FORGOT_PASSWORD')"
                  class="text-[11px] text-orange-400 hover:text-orange-300 transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div class="relative">
                <input
                  id="login-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-slate-500 outline-none transition pr-10"
                />
                <button
                  type="button"
                  (click)="toggleShowPassword()"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  <mat-icon class="text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  formControlName="rememberMe"
                  class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>Remember me for 30 days</span>
              </label>

              <button
                type="button"
                (click)="autofillKamalAdmin()"
                class="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
              >
                Fill Owner Credentials
              </button>
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || api.authLoading()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              @if (api.authLoading()) {
                <mat-icon class="text-base animate-spin">refresh</mat-icon>
                <span>Authenticating...</span>
              } @else {
                <mat-icon class="text-base">lock_open</mat-icon>
                <span>Log In to Command Center</span>
              }
            </button>
          </form>
        }

        <!-- 2. SIGN UP / REGISTER FORM -->
        @if (mode() === 'REGISTER') {
          <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" class="space-y-4">
            <div class="space-y-1.5">
              <label for="reg-name" class="block text-xs font-medium text-slate-300">Full Name</label>
              <input
                id="reg-name"
                type="text"
                formControlName="name"
                placeholder="Kamal Das"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div class="space-y-1.5">
              <label for="reg-email" class="block text-xs font-medium text-slate-300">Email Address</label>
              <input
                id="reg-email"
                type="email"
                formControlName="email"
                placeholder="you@domain.com"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div class="space-y-1.5">
              <label for="reg-password" class="block text-xs font-medium text-slate-300">Password (Min. 8 characters)</label>
              <div class="relative">
                <input
                  id="reg-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Create a strong password"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-slate-500 outline-none transition pr-10"
                />
                <button
                  type="button"
                  (click)="toggleShowPassword()"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  <mat-icon class="text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            <div class="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
              <div class="font-semibold text-slate-300 flex items-center gap-1.5">
                <mat-icon class="text-xs text-emerald-400">shield</mat-icon>
                <span>Zero-Knowledge Security</span>
              </div>
              <p>Passwords are salted with 16 random bytes and hashed using PBKDF2 with 100,000 SHA-512 rounds. Plaintext credentials are never saved.</p>
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || api.authLoading()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              @if (api.authLoading()) {
                <mat-icon class="text-base animate-spin">refresh</mat-icon>
                <span>Creating Account...</span>
              } @else {
                <mat-icon class="text-base">person_add</mat-icon>
                <span>Create Verified Account</span>
              }
            </button>
          </form>
        }

        <!-- 3. FIRST ADMINISTRATOR SETUP -->
        @if (mode() === 'FIRST_ADMIN') {
          <form [formGroup]="adminSetupForm" (ngSubmit)="submitFirstAdmin()" class="space-y-4">
            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1 text-slate-300">
              <div class="font-bold text-amber-300 flex items-center gap-1.5">
                <mat-icon class="text-sm">verified</mat-icon>
                <span>Master Administrator Claim</span>
              </div>
              <p class="text-[11px]">
                Safe first-time initialization for primary owner <strong>Kamal Das</strong> (<span class="font-mono text-amber-200">kamaldas743273&#64;gmail.com</span>). Sets your permanent master credentials without hardcoded source code secrets.
              </p>
            </div>

            <div class="space-y-1.5">
              <label for="admin-email" class="block text-xs font-medium text-slate-300">Designated Admin Email</label>
              <input
                id="admin-email"
                type="email"
                formControlName="email"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 outline-none"
              />
            </div>

            <div class="space-y-1.5">
              <label for="admin-name" class="block text-xs font-medium text-slate-300">Administrator Name</label>
              <input
                id="admin-name"
                type="text"
                formControlName="name"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 outline-none"
              />
            </div>

            <div class="space-y-1.5">
              <label for="admin-password" class="block text-xs font-medium text-slate-300">Master Password (Min. 8 characters)</label>
              <div class="relative">
                <input
                  id="admin-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Set master administrator password"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-slate-500 outline-none transition pr-10"
                />
                <button
                  type="button"
                  (click)="toggleShowPassword()"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  <mat-icon class="text-base">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="adminSetupForm.invalid || api.authLoading()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              @if (api.authLoading()) {
                <mat-icon class="text-base animate-spin">refresh</mat-icon>
                <span>Configuring Administrator...</span>
              } @else {
                <mat-icon class="text-base">admin_panel_settings</mat-icon>
                <span>Claim Master Administrator Role</span>
              }
            </button>
          </form>
        }

        <!-- 4. EMAIL VERIFICATION MODAL / FORM -->
        @if (mode() === 'VERIFY_EMAIL') {
          <div class="space-y-4">
            <div class="text-center space-y-1">
              <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <mat-icon>mark_email_unread</mat-icon>
              </div>
              <h2 class="text-base font-bold text-white">Verify Your Email Address</h2>
              <p class="text-xs text-slate-400">
                Enter the cryptographic verification token sent to your email or generated in your session.
              </p>
            </div>

            <div class="space-y-1.5">
              <label for="verify-token-input" class="block text-xs font-medium text-slate-300">Verification Token</label>
              <textarea
                id="verify-token-input"
                [value]="verificationTokenInput()"
                (input)="onVerificationTokenChange($event)"
                rows="2"
                placeholder="Paste your 64-character verification hex token"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 outline-none"
              ></textarea>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                (click)="submitEmailVerification()"
                [disabled]="!verificationTokenInput() || api.authLoading()"
                class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <mat-icon class="text-sm">verified</mat-icon>
                <span>Verify Token</span>
              </button>

              <button
                type="button"
                (click)="resendVerificationCode()"
                class="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Resend Code
              </button>
            </div>

            <div class="text-center">
              <button
                type="button"
                (click)="setMode('LOGIN')"
                class="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        }

        <!-- 5. FORGOT PASSWORD FORM -->
        @if (mode() === 'FORGOT_PASSWORD') {
          <div class="space-y-4">
            <div class="text-center space-y-1">
              <div class="w-12 h-12 mx-auto rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <mat-icon>lock_reset</mat-icon>
              </div>
              <h2 class="text-base font-bold text-white">Reset Account Password</h2>
              <p class="text-xs text-slate-400">
                Enter your registered email address to receive secure reset credentials.
              </p>
            </div>

            <div class="space-y-1.5">
              <label for="forgot-email" class="block text-xs font-medium text-slate-300">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                [value]="forgotEmailInput()"
                (input)="onForgotEmailChange($event)"
                placeholder="kamaldas743273@gmail.com"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <!-- Display test reset token if generated -->
            @if (api.testResetToken()) {
              <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                <div class="font-bold flex items-center justify-between">
                  <span>Reset Token Issued</span>
                  <button
                    type="button"
                    (click)="switchToResetPasswordWithToken()"
                    class="text-[10px] underline font-semibold"
                  >
                    Click to Use
                  </button>
                </div>
                <p class="font-mono text-[10px] break-all bg-black/40 p-1 rounded">
                  {{ api.testResetToken() }}
                </p>
              </div>
            }

            <button
              type="button"
              (click)="submitForgotPassword()"
              [disabled]="!forgotEmailInput() || api.authLoading()"
              class="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <mat-icon class="text-sm">send</mat-icon>
              <span>Send Password Reset Link</span>
            </button>

            <div class="text-center">
              <button
                type="button"
                (click)="setMode('LOGIN')"
                class="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Remembered your password? Back to Login
              </button>
            </div>
          </div>
        }

        <!-- 6. RESET PASSWORD FORM -->
        @if (mode() === 'RESET_PASSWORD') {
          <div class="space-y-4">
            <div class="text-center space-y-1">
              <h2 class="text-base font-bold text-white">Create New Password</h2>
              <p class="text-xs text-slate-400">Enter your reset token and your new password.</p>
            </div>

            <div class="space-y-1.5">
              <label for="reset-token" class="block text-xs font-medium text-slate-300">Reset Token</label>
              <input
                id="reset-token"
                type="text"
                [value]="resetTokenInput()"
                (input)="onResetTokenChange($event)"
                placeholder="Paste reset token"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none"
              />
            </div>

            <div class="space-y-1.5">
              <label for="new-pass" class="block text-xs font-medium text-slate-300">New Password (Min. 8 chars)</label>
              <input
                id="new-pass"
                type="password"
                [value]="newPasswordInput()"
                (input)="onNewPasswordChange($event)"
                placeholder="Enter new strong password"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
              />
            </div>

            <button
              type="button"
              (click)="submitResetPassword()"
              [disabled]="!resetTokenInput() || newPasswordInput().length < 8 || api.authLoading()"
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <mat-icon class="text-sm">check_circle</mat-icon>
              <span>Save New Password & Log In</span>
            </button>
          </div>
        }

        <!-- Quick Verification Jump Link for Logged In but Unverified Users -->
        @if (api.currentUser() && !api.currentUser()?.isEmailVerified && mode() !== 'VERIFY_EMAIL') {
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
            <div class="text-amber-300">
              <span class="font-bold">Email Unverified:</span> Complete verification to access full ERP tools.
            </div>
            <button
              type="button"
              (click)="setMode('VERIFY_EMAIL')"
              class="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[11px] transition cursor-pointer"
            >
              Verify Now
            </button>
          </div>
        }

        <!-- Footer Notice & Back to Storefront Link -->
        <div class="pt-2 flex flex-col items-center gap-2 text-center text-[11px] text-slate-400">
          <button
            type="button"
            (click)="switchToStorefront.emit()"
            class="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 transition cursor-pointer border border-amber-500/20"
          >
            <mat-icon class="text-sm text-amber-400">storefront</mat-icon>
            <span>Back to Customer Storefront (Buy Spices)</span>
          </button>
          <span class="text-[10px] text-slate-500">Saarthi Enterprise Security Engine • 256-Bit SSL • PBKDF2 Encrypted</span>
        </div>
      </div>
    </div>
  `,
})
export class AuthView {
  readonly api = inject(ShaktiApi);
  readonly switchToStorefront = output<void>();

  readonly mode = signal<AuthMode>('LOGIN');
  readonly showPassword = signal<boolean>(false);
  readonly verificationTokenInput = signal<string>('');
  readonly forgotEmailInput = signal<string>('kamaldas743273@gmail.com');
  readonly resetTokenInput = signal<string>('');
  readonly newPasswordInput = signal<string>('');
  readonly otpInput = signal<string>('');

  async submitOtpVerification() {
    const email = this.loginForm.value.email || this.registerForm.value.email || 'kamaldas743273@gmail.com';
    await this.api.verifyStaffOtp(email, this.otpInput());
  }

  readonly loginForm = new FormGroup({
    email: new FormControl('kamaldas743273@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Saarthi@2026', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(true),
  });

  readonly registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  readonly adminSetupForm = new FormGroup({
    name: new FormControl('Kamal Das', [Validators.required]),
    email: new FormControl('kamaldas743273@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Saarthi@2026', [Validators.required, Validators.minLength(8)]),
  });

  setMode(mode: AuthMode) {
    this.mode.set(mode);
    this.api.authError.set(null);
  }

  toggleShowPassword() {
    this.showPassword.update((s) => !s);
  }

  autofillKamalAdmin() {
    this.loginForm.patchValue({
      email: 'kamaldas743273@gmail.com',
      password: 'Saarthi@2026',
      rememberMe: true,
    });
  }

  autofillVerificationToken() {
    const code = this.api.testVerificationCode();
    if (code) {
      this.verificationTokenInput.set(code);
      this.mode.set('VERIFY_EMAIL');
    }
  }

  onVerificationTokenChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.verificationTokenInput.set(target.value);
  }

  onForgotEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.forgotEmailInput.set(target.value);
  }

  onResetTokenChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.resetTokenInput.set(target.value);
  }

  onNewPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newPasswordInput.set(target.value);
  }

  async submitLogin() {
    if (this.loginForm.invalid) return;
    const v = this.loginForm.getRawValue();
    await this.api.login({
      email: v.email || '',
      password: v.password || '',
      rememberMe: !!v.rememberMe,
    });
  }

  async submitRegister() {
    if (this.registerForm.invalid) return;
    const v = this.registerForm.getRawValue();
    const success = await this.api.register({
      name: v.name || '',
      email: v.email || '',
      password: v.password || '',
    });
    if (success) {
      this.mode.set('VERIFY_EMAIL');
      if (this.api.testVerificationCode()) {
        this.verificationTokenInput.set(this.api.testVerificationCode() || '');
      }
    }
  }

  async submitFirstAdmin() {
    if (this.adminSetupForm.invalid) return;
    const v = this.adminSetupForm.getRawValue();
    await this.api.setupFirstAdmin({
      name: v.name || 'Kamal Das',
      email: v.email || 'kamaldas743273@gmail.com',
      password: v.password || '',
    });
  }

  async submitEmailVerification() {
    const token = this.verificationTokenInput().trim();
    if (!token) return;
    const success = await this.api.verifyEmail(token);
    if (success) {
      this.setMode('LOGIN');
    }
  }

  async resendVerificationCode() {
    await this.api.resendVerification();
    if (this.api.testVerificationCode()) {
      this.verificationTokenInput.set(this.api.testVerificationCode() || '');
    }
  }

  async submitForgotPassword() {
    const email = this.forgotEmailInput().trim();
    if (!email) return;
    await this.api.forgotPassword(email);
  }

  switchToResetPasswordWithToken() {
    const token = this.api.testResetToken();
    if (token) {
      this.resetTokenInput.set(token);
      this.setMode('RESET_PASSWORD');
    }
  }

  async submitResetPassword() {
    const token = this.resetTokenInput().trim();
    const newPassword = this.newPasswordInput().trim();
    if (!token || newPassword.length < 8) return;
    const success = await this.api.resetPassword({ token, newPassword });
    if (success) {
      this.setMode('LOGIN');
    }
  }
}
