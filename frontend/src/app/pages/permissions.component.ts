import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService, PermissionResponse } from '../core/services/permission.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import { LucideAngularModule, Shield, ShieldCheck, ShieldAlert, Settings, Plus, Trash2, Key } from 'lucide-angular';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    LucideAngularModule
  ],
  template: `
    <div class="min-h-screen bg-background">
      <app-dashboard-sidebar />
      <app-dashboard-header />

      <main
        [class]="'pt-32 pb-12 px-6 lg:px-10 transition-all duration-300 ease-in-out ' +
                 (sidebarService.mobileOpen() ? 'opacity-50 pointer-events-none md:opacity-100 md:pointer-events-auto' : '')"
        [style.margin-left]="sidebarService.collapsed() || sidebarService.isMobile() ? (sidebarService.isMobile() ? '0' : '80px') : '280px'"
      >
        <div class="max-w-7xl mx-auto space-y-10 animate-fade-in-up">
          <div class="mb-10">
            <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">Permissions & Roles</h1>
            <p class="text-muted-foreground text-lg flex items-center gap-2">
              <lucide-icon [img]="ShieldCheckIcon" class="h-5 w-5 text-sidebar-accent" />
              Configure global access controls and system permission policies
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Dynamic Permissions List & Form -->
            <div class="lg:col-span-2 space-y-8">
              <app-card class="border-border/50 shadow-soft">
                <app-card-header>
                  <app-card-title>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <lucide-icon [img]="KeyIcon" class="h-5 w-5 text-primary" />
                        <span>System Permissions</span>
                      </div>
                      <app-badge variant="secondary" class="rounded-lg">{{ permissions().length }} Active</app-badge>
                    </div>
                  </app-card-title>
                </app-card-header>
                <app-card-content class="space-y-6">
                  <!-- Add Permission Inline Form -->
                  <form (submit)="addPermission($event)" class="flex gap-3">
                    <app-input
                      type="text"
                      placeholder="Enter new permission name (e.g. USER_VIEW)"
                      [(ngModel)]="newPermissionName"
                      name="newPermissionName"
                      class="h-11 flex-1"
                      required
                    />
                    <app-button type="submit" variant="default" class="h-11 px-5">
                      <lucide-icon [img]="PlusIcon" class="mr-2 h-4 w-4" />
                      Add
                    </app-button>
                  </form>

                  @if (loading()) {
                    <div class="flex justify-center py-10">
                      <div class="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  } @else {
                    <div class="divide-y divide-border/30">
                      @for (perm of permissions(); track perm.id) {
                        <div class="flex items-center justify-between py-4 group">
                          <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <lucide-icon [img]="KeyIcon" class="h-4 w-4" />
                            </div>
                            <div>
                              <p class="font-bold text-sm text-foreground tracking-wide uppercase">{{ perm.name }}</p>
                              <p class="text-xs text-muted-foreground">ID: #{{ perm.id }}</p>
                            </div>
                          </div>
                          <app-button
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9 text-destructive/70 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                            (click)="deletePermission(perm.id)"
                            title="Delete Permission"
                          >
                            <lucide-icon [img]="TrashIcon" class="h-4 w-4" />
                          </app-button>
                        </div>
                      }
                      @if (permissions().length === 0) {
                        <p class="text-sm text-muted-foreground text-center py-6">No custom permissions created yet.</p>
                      }
                    </div>
                  }
                </app-card-content>
              </app-card>
            </div>

            <!-- Role Explanations -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold font-display tracking-tight mb-4 flex items-center gap-2">
                <lucide-icon [img]="ShieldIcon" class="h-5 w-5 text-sidebar-accent" />
                Default System Roles
              </h3>

              @for (role of systemRoles; track role.name; let i = $index) {
                <app-card class="border-border/50 shadow-soft rounded-2xl overflow-hidden group">
                  <app-card-header class="p-6 pb-2">
                    <div class="flex items-center justify-between mb-4">
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-sidebar-primary/20 to-sidebar-accent/20 flex items-center justify-center text-sidebar-primary">
                        <lucide-icon [img]="role.icon" class="h-5 w-5" />
                      </div>
                      <app-badge [variant]="role.name === 'SUPER_ADMIN' ? 'default' : 'secondary'" class="rounded-lg px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                        {{ role.level }}
                      </app-badge>
                    </div>
                    <h3 class="text-lg font-bold font-display tracking-tight">{{ role.name }}</h3>
                    <p class="text-xs text-muted-foreground mt-1">{{ role.desc }}</p>
                  </app-card-header>
                </app-card>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PermissionsComponent implements OnInit {
  private permissionService = inject(PermissionService);
  sidebarService = inject(SidebarService);

  ShieldCheckIcon = ShieldCheck;
  ShieldIcon = Shield;
  KeyIcon = Key;
  PlusIcon = Plus;
  TrashIcon = Trash2;

  permissions = signal<PermissionResponse[]>([]);
  loading = signal(true);
  newPermissionName = '';

  systemRoles = [
    {
      name: 'ROLE_SUPER_ADMIN',
      level: 'Full Access',
      icon: Shield,
      desc: 'Complete control over system settings, admins, users, billing, and logs.'
    },
    {
      name: 'ROLE_ADMIN',
      level: 'Management',
      icon: ShieldAlert,
      desc: 'Manage moderator/user accounts, verify reporting analytics, edit operational entities.'
    },
    {
      name: 'ROLE_MODERATOR',
      level: 'Oversight',
      icon: Settings,
      desc: 'Moderate team members, review basic dashboards, and perform audit operations.'
    },
    {
      name: 'ROLE_USER',
      level: 'General Member',
      icon: ShieldCheck,
      desc: 'Default role assigned to all employees, allowing profiles, leaves, and logs access.'
    }
  ];

  ngOnInit() {
    this.fetchPermissions();
  }

  fetchPermissions() {
    this.loading.set(true);
    this.permissionService.getPermissions().subscribe({
      next: (data) => {
        this.permissions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  addPermission(event: Event) {
    event.preventDefault();
    if (!this.newPermissionName.trim()) return;

    this.permissionService.createPermission({ name: this.newPermissionName.trim() }).subscribe({
      next: () => {
        this.newPermissionName = '';
        this.fetchPermissions();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to add permission.');
      }
    });
  }

  deletePermission(id: number) {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => {
          this.fetchPermissions();
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Failed to delete permission.');
        }
      });
    }
  }
}
