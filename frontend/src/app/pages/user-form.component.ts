import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import { LucideAngularModule, ArrowLeft, UserPlus, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="min-h-screen bg-background">
      <app-dashboard-sidebar />
      <app-dashboard-header />

      <main
        [class]="'pt-32 pb-8 px-6 lg:px-8 transition-all duration-300 ease-in-out'"
        [style.margin-left]="sidebarService.collapsed() ? '80px' : '280px'"
      >
        <div class="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <app-button variant="ghost" (click)="goBack()" class="group">
            <lucide-icon [img]="ArrowLeftIcon" class="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </app-button>

          <app-card class="border-border/50 shadow-soft">
            <app-card-header>
              <app-card-title>
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center">
                    <lucide-icon [img]="UserPlusIcon" class="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 class="text-2xl font-display font-bold tracking-tight">Add New User</h1>
                    <p class="text-sm text-muted-foreground">Create a new user account with role assignments</p>
                  </div>
                </div>
              </app-card-title>
            </app-card-header>
            <app-card-content>
              <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                    placeholder="Enter username"
                    formControlName="username"
                    class="h-12"
                  />
                  @if (userForm.get('username')?.invalid && userForm.get('username')?.touched) {
                    <p class="text-xs text-destructive">Username is required (min 3 characters)</p>
                  }
                </div>

                <div class="space-y-2">
                  <label for="email" class="text-sm font-medium">Email</label>
                  <app-input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    formControlName="email"
                    class="h-12"
                  />
                  @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
                    <p class="text-xs text-destructive">Valid email is required</p>
                  }
                </div>

                <div class="space-y-2">
                  <label for="password" class="text-sm font-medium">Password</label>
                  <app-input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    formControlName="password"
                    class="h-12"
                  />
                  @if (userForm.get('password')?.invalid && userForm.get('password')?.touched) {
                    <p class="text-xs text-destructive">Password is required (min 6 characters)</p>
                  }
                </div>

                <div class="space-y-2">
                  <label for="role" class="text-sm font-medium">Role</label>
                  <select
                    id="role"
                    formControlName="role"
                    class="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_MODERATOR">Moderator</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>

                <div class="flex items-center gap-3 pt-4">
                  <app-button type="submit" variant="default" [loading]="loading()" class="h-12 px-8">
                    @if (loading()) {
                      <lucide-icon [img]="LoaderIcon" class="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    } @else {
                      <lucide-icon [img]="UserPlusIcon" class="mr-2 h-5 w-5" />
                      Create User
                    }
                  </app-button>
                  <app-button type="button" variant="outline" (click)="goBack()" class="h-12 px-8">
                    Cancel
                  </app-button>
                </div>
              </form>
            </app-card-content>
          </app-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  sidebarService = inject(SidebarService);

  ArrowLeftIcon = ArrowLeft;
  UserPlusIcon = UserPlus;
  LoaderIcon = Loader2;

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ROLE_USER', Validators.required],
  });

  loading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const formData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      roles: [this.userForm.value.role],
    };

    this.userService.createUser(formData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to create user. Please try again.');
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
