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
  selector: 'app-signup',
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
      <!-- Right Side - Form (Swapped for signup flow) -->
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
            <h1 class="text-3xl font-display font-bold mb-2">Create an account</h1>
            <p class="text-muted-foreground">
              Sign up to start managing your workforce efficiently
            </p>
          </div>

          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
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
                placeholder="Choose a username"
                formControlName="username"
                class="h-12"
              />
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email Address</label>
              <app-input
                id="email"
                type="email"
                placeholder="Enter your email"
                formControlName="email"
                class="h-12"
              />
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Password</label>
              <div class="relative">
                <app-input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Create a password"
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

            <app-button
              type="submit"
              variant="hero"
              size="lg"
              [loading]="loading()"
              class="w-full group mt-6"
            >
              @if (loading()) {
                <lucide-icon [img]="LoaderIcon" class="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              } @else {
                Create Account
                <lucide-icon [img]="ArrowRightIcon" class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              }
            </app-button>
          </form>

          <p class="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? 
            <a routerLink="/login" class="text-primary font-medium hover:underline">
              Sign in instead
            </a>
          </p>
        </div>
      </div>

      <!-- Left Side - Gradient Background -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-accent via-primary to-accent">
         <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center px-12">
            <h2 class="text-4xl font-display font-bold mb-6 italic">"Join the revolution in HR management."</h2>
            <p class="text-xl text-white/80">Trusted by modern teams everywhere.</p>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  UsersIcon = Users;
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;
  ArrowRightIcon = ArrowRight;
  LoaderIcon = Loader2;

  signupForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup failed', err);
          this.errorMessage.set(err.error?.message || 'Signup failed. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }
}
