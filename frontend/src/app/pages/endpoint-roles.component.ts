import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../core/services/sidebar.service';
import { AuthService } from '../core/services/auth.service';
import { EndpointRoleService, EndpointRoleResponse } from '../core/services/endpoint-role.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import {
  LucideAngularModule,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Search,
  Key,
  Pencil
} from 'lucide-angular';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const ROLES = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_USER'] as const;

@Component({
  selector: 'app-endpoint-roles',
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
        <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
          <div class="mb-6">
            <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight">Endpoint Roles</h1>
            <p class="text-muted-foreground mt-2 flex items-center gap-2">
              <lucide-icon [img]="ShieldCheckIcon" class="h-4 w-4 text-sidebar-accent" />
              Manage URL pattern to role mappings for API authorization
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Rules List -->
            <div class="lg:col-span-2 space-y-6">
              <app-card class="border-border/50 shadow-soft">
                <app-card-header>
                  <app-card-title>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <lucide-icon [img]="KeyIcon" class="h-5 w-5 text-primary" />
                        <span>Endpoint Rules</span>
                      </div>
                      <app-badge variant="secondary" class="rounded-lg">{{ filteredRules().length }} Active</app-badge>
                    </div>
                  </app-card-title>
                </app-card-header>
                <app-card-content class="space-y-4">
                  <!-- Search & Filter -->
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search by URL pattern..."
                        [ngModel]="searchTerm()"
                        (ngModelChange)="searchTerm.set($event)"
                        class="w-full h-10 pl-10 pr-4 bg-secondary/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-accent/10 transition-all"
                      />
                    </div>
                    <select
                      [ngModel]="methodFilter()"
                      (ngModelChange)="methodFilter.set($event)"
                      class="h-10 rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-accent/10"
                    >
                      <option value="">All Methods</option>
                      @for (m of httpMethods; track m) {
                        <option [value]="m">{{ m }}</option>
                      }
                    </select>
                  </div>

                  @if (loading()) {
                    <div class="flex justify-center py-12">
                      <div class="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  } @else {
                    <div class="divide-y divide-border/30">
                      @for (rule of filteredRules(); track rule.id) {
                        <div class="flex items-center justify-between py-4 group">
                          <div class="flex items-center gap-4 min-w-0 flex-1">
                            <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <lucide-icon [img]="ShieldCheckIcon" class="h-4 w-4" />
                            </div>
                            <div class="min-w-0 flex-1">
                              <div class="flex items-center gap-2 flex-wrap">
                                <app-badge variant="outline" class="font-mono text-[10px] tracking-wider uppercase rounded-md">
                                  {{ rule.httpMethod }}
                                </app-badge>
                                <span class="font-mono text-sm font-medium truncate">{{ rule.urlPattern }}</span>
                              </div>
                              <p class="text-xs text-muted-foreground mt-1">ID: #{{ rule.id }}</p>
                            </div>
                            <app-badge
                              [variant]="rule.roleName === 'ROLE_SUPER_ADMIN' ? 'default' : (rule.roleName === 'ROLE_ADMIN' ? 'success' : 'secondary')"
                              class="rounded-lg px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase shrink-0"
                            >
                              {{ rule.roleName.replace('ROLE_', '') }}
                            </app-badge>
                          </div>
                          <div class="flex items-center gap-1 ml-4">
                            <app-button
                              variant="ghost"
                              size="icon"
                              class="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                              (click)="startEdit(rule)"
                              title="Edit"
                            >
                              <lucide-icon [img]="PencilIcon" class="h-4 w-4" />
                            </app-button>
                            @if (canDelete()) {
                              <app-button
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                (click)="deleteRule(rule.id)"
                                title="Delete"
                              >
                                <lucide-icon [img]="TrashIcon" class="h-4 w-4" />
                              </app-button>
                            }
                          </div>
                        </div>
                      }
                      @if (filteredRules().length === 0) {
                        <p class="text-sm text-muted-foreground text-center py-8">
                          {{ searchTerm() || methodFilter() ? 'No rules matching your filters.' : 'No endpoint rules configured yet.' }}
                        </p>
                      }
                    </div>
                  }
                </app-card-content>
              </app-card>
            </div>

            <!-- Right: Add / Edit Form -->
            <div class="space-y-6">
              <app-card class="border-border/50 shadow-soft sticky top-36">
                <app-card-header>
                  <app-card-title>
                    <div class="flex items-center gap-2">
                      <lucide-icon [img]="editingId() ? PencilIcon : PlusIcon" class="h-5 w-5 text-primary" />
                      <span>{{ editingId() ? 'Edit Rule' : 'Add New Rule' }}</span>
                    </div>
                  </app-card-title>
                </app-card-header>
                <app-card-content>
                  <form (submit)="submitForm()" class="space-y-5">
                    <div class="space-y-2">
                      <label class="text-sm font-medium">URL Pattern</label>
                      <app-input
                        type="text"
                        placeholder="/api/v1/resource/**"
                        [(ngModel)]="formUrlPattern"
                        name="urlPattern"
                        required
                      />
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium">HTTP Method</label>
                      <select
                        [(ngModel)]="formHttpMethod"
                        name="httpMethod"
                        required
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>Select method</option>
                        @for (m of httpMethods; track m) {
                          <option [value]="m">{{ m }}</option>
                        }
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium">Role</label>
                      <select
                        [(ngModel)]="formRoleName"
                        name="roleName"
                        required
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>Select role</option>
                        @for (r of roles; track r) {
                          <option [value]="r">{{ r.replace('ROLE_', '') }}</option>
                        }
                      </select>
                    </div>

                    <div class="flex gap-3 pt-2">
                      @if (editingId()) {
                        <app-button type="button" variant="outline" class="flex-1" (click)="cancelEdit()">
                          Cancel
                        </app-button>
                      }
                      <app-button type="submit" variant="default" class="flex-1" [loading]="submitting()">
                        {{ editingId() ? 'Update Rule' : 'Create Rule' }}
                      </app-button>
                    </div>
                  </form>
                </app-card-content>
              </app-card>
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
export class EndpointRolesComponent implements OnInit {
  private endpointRoleService = inject(EndpointRoleService);
  private authService = inject(AuthService);
  sidebarService = inject(SidebarService);

  ShieldCheckIcon = ShieldCheck;
  PlusIcon = Plus;
  TrashIcon = Trash2;
  EditIcon = Edit;
  PencilIcon = Pencil;
  SearchIcon = Search;
  KeyIcon = Key;

  httpMethods = HTTP_METHODS;
  roles = ROLES;

  rules = signal<EndpointRoleResponse[]>([]);
  loading = signal(true);
  submitting = signal(false);
  searchTerm = signal('');
  methodFilter = signal('');

  editingId = signal<number | null>(null);
  formUrlPattern = '';
  formHttpMethod = '';
  formRoleName = '';

  filteredRules = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const method = this.methodFilter();
    return this.rules().filter(r =>
      (!term || r.urlPattern.toLowerCase().includes(term)) &&
      (!method || r.httpMethod === method)
    );
  });

  canDelete(): boolean {
    const roles = this.authService.currentUser()?.roles || [];
    return roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN');
  }

  ngOnInit() {
    this.fetchRules();
  }

  fetchRules() {
    this.loading.set(true);
    this.endpointRoleService.getAll().subscribe({
      next: (data) => {
        this.rules.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  startEdit(rule: EndpointRoleResponse) {
    this.editingId.set(rule.id);
    this.formUrlPattern = rule.urlPattern;
    this.formHttpMethod = rule.httpMethod;
    this.formRoleName = rule.roleName;
  }

  cancelEdit() {
    this.editingId.set(null);
    this.resetForm();
  }

  private resetForm() {
    this.formUrlPattern = '';
    this.formHttpMethod = '';
    this.formRoleName = '';
  }

  submitForm() {
    if (!this.formUrlPattern.trim() || !this.formHttpMethod || !this.formRoleName) return;

    this.submitting.set(true);
    const payload = {
      urlPattern: this.formUrlPattern.trim(),
      httpMethod: this.formHttpMethod,
      roleName: this.formRoleName
    };

    if (this.editingId()) {
      this.endpointRoleService.update(this.editingId()!, payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.cancelEdit();
          this.fetchRules();
        },
        error: () => this.submitting.set(false)
      });
    } else {
      this.endpointRoleService.create(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.resetForm();
          this.fetchRules();
        },
        error: () => this.submitting.set(false)
      });
    }
  }

  deleteRule(id: number) {
    if (!confirm('Delete this endpoint rule?')) return;
    this.endpointRoleService.delete(id).subscribe({
      next: () => this.fetchRules(),
      error: () => {}
    });
  }
}
