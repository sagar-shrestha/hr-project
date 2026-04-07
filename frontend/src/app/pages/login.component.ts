import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LucideAngularModule, Eye, EyeOff, Users, ArrowRight, Loader2 } from 'lucide-angular';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import { ThemeToggleComponent } from '../shared/components/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    LucideAngularModule, 
    ButtonComponent, 
    InputComponent, 
    ThemeToggleComponent
  ],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Side - Gradient Background -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary">
        <!-- Animated shapes -->
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s"></div>

        <!-- Grid pattern -->
        <div
          class="absolute inset-0 opacity-10"
          style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 40px 40px;"
        ></div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div class="animate-fade-in-up">
            <a routerLink="/" class="flex items-center gap-2 mb-12">
              <div class="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <lucide-icon [img]="UsersIcon" class="h-6 w-6 text-white" />
              </div>
              <span class="text-2xl font-display font-bold text-white">HRMS</span>
            </a>

            <blockquote class="space-y-6">
              <p class="text-2xl xl:text-3xl font-display text-white/90 leading-relaxed">
                "HRMS has transformed how we manage our 500+ employees. The automation alone saves us 20 hours per week."
              </p>
              <footer class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                  SK
                </div>
                <div>
                  <cite class="text-white font-semibold not-italic">Sarah Kim</cite>
                  <p class="text-white/70 text-sm">HR Director, TechCorp Inc.</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 bg-background relative">
        <div class="absolute top-4 right-4 lg:top-8 lg:right-8">
          <app-theme-toggle />
        </div>

        <div class="w-full max-w-md mx-auto animate-fade-in">
          <!-- Mobile logo -->
          <a routerLink="/" class="flex lg:hidden items-center gap-2 mb-8">
            <div class="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <lucide-icon [img]="UsersIcon" class="h-5 w-5 text-primary-foreground" />
            </div>
            <span class="text-xl font-display font-bold">HRMS</span>
          </a>

          <div class="mb-8">
            <h1 class="text-3xl font-display font-bold mb-2">Welcome back</h1>
            <p class="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            @if (errorMessage()) {
              <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {{ errorMessage() }}
              </div>
            }

            <div class="space-y-2">
              <label for="username" class="text-sm font-medium">Username</label>
              <app-input
                id="username"
                type="text"
                placeholder="Enter your username"
                formControlName="username"
                class="h-12"
              />
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Password</label>
              <div class="relative">
                <app-input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Enter your password"
                  formControlName="password"
                  class="h-12 pr-12"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <lucide-icon [img]="showPassword() ? EyeOffIcon : EyeIcon" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  class="rounded border-input text-primary focus:ring-ring"
                />
                <label for="remember" class="text-sm font-normal cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <app-button
              type="submit"
              variant="hero"
              size="lg"
              [loading]="loading()"
              class="w-full group"
            >
              @if (loading()) {
                <lucide-icon [img]="LoaderIcon" class="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              } @else {
                Sign In
                <lucide-icon [img]="ArrowRightIcon" class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              }
            </app-button>
          </form>

          <p class="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? 
            <a routerLink="/signup" class="text-primary font-medium hover:underline">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  UsersIcon = Users;
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;
  ArrowRightIcon = ArrowRight;
  LoaderIcon = Loader2;

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      
      const credentials = this.loginForm.value as any;
      
      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage.set(err.error?.message || 'Login failed. Please check your credentials.');
          this.loading.set(false);
        }
      });
    }
  }
}
