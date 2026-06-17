import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarService} from '../core/services/sidebar.service';
import {UserService} from '../core/services/user.service';
import {AuthService} from '../core/services/auth.service';
import {User} from '../core/models/user.model';
import {DashboardSidebarComponent} from '../shared/components/dashboard-sidebar.component';
import {DashboardHeaderComponent} from '../shared/components/dashboard-header.component';
import {CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent} from '../shared/components/card.component';
import {BadgeComponent} from '../shared/components/badge.component';
import {ButtonComponent} from '../shared/components/button.component';
import {
  Edit,
  Eye,
  Filter,
  LucideAngularModule,
  Mail,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCircle,
  UserCog,
  Users
} from 'lucide-angular';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-management',
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
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight">User Management</h1>
              <p class="text-muted-foreground mt-2 flex items-center gap-2">
                <lucide-icon [img]="UsersIcon" class="h-4 w-4 text-sidebar-accent" />
                Manage team accounts, roles and permissions
              </p>
            </div>
            @if (canCreateUser()) {
              <app-button
                variant="hero"
                class="h-12 px-8 rounded-2xl hover:scale-105"
                (click)="addNewUser()"
              >
                <lucide-icon [img]="PlusIcon" class="mr-2 h-5 w-5" />
                Add New User
              </app-button>
            }
          </div>

          <!-- Filters -->
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative w-full md:flex-1">
              <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email or role..."
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                class="w-full h-12 pl-12 pr-4 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-sidebar-accent/10 focus:border-sidebar-accent/50 transition-all duration-300 shadow-soft placeholder:text-muted-foreground"
              />
            </div>

            <div class="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
              <lucide-icon [img]="FilterIcon" class="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <select
                class="h-12 rounded-xl border border-border/50 bg-card px-3 text-sm focus:outline-none focus:ring-4 focus:ring-sidebar-accent/10 transition-all duration-300 shadow-soft"
                (change)="searchTerm.set($any($event.target).value)"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admins</option>
                <option value="MODERATOR">Moderators</option>
                <option value="USER">Users</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col xl:flex-row gap-6">
            <div class="flex-1 min-w-0 bg-card rounded-3xl border border-border/50 shadow-soft overflow-hidden">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-secondary/30 border-b border-border/50">
                      <th class="px-6 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                      <th class="px-6 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact</th>
                      <th class="px-6 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Roles</th>
                      <th class="px-6 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right pr-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border/30">
                    @if (loading()) {
                      <tr>
                        <td colSpan="4" class="h-40 text-center">
                          <div class="flex flex-col items-center justify-center gap-3">
                            <div class="h-8 w-8 border-4 border-sidebar-primary border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-sm font-medium text-muted-foreground">Fetching users...</p>
                          </div>
                        </td>
                      </tr>
                    } @else if (filteredUsers().length === 0) {
                      <tr>
                        <td colSpan="4" class="h-40 text-center">
                          <div class="flex flex-col items-center justify-center gap-3">
                             <lucide-icon [img]="SearchIcon" class="h-10 w-10 text-muted-foreground/30" />
                             <p class="text-sm font-medium text-muted-foreground">No users matching your search</p>
                          </div>
                        </td>
                      </tr>
                    } @else {
                      @for (user of filteredUsers(); track user.id) {
                        <tr class="group hover:bg-secondary/10 transition-colors duration-200 cursor-pointer" (click)="viewDetails(user.id!)">
                          <td class="px-6 py-5">
                            <div class="flex items-center gap-4">
                              <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center text-white font-bold shadow-soft transition-transform group-hover:scale-110">
                                {{ user.username.substring(0, 2).toUpperCase() }}
                              </div>
                              <div>
                                <p class="font-bold text-base tracking-tight">{{ user.username }}</p>
                                <p class="text-xs text-muted-foreground">ID: #{{ user.id }}</p>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-5">
                            <div class="flex items-center gap-2 text-sm font-medium">
                              <lucide-icon [img]="MailIcon" class="h-4 w-4 text-muted-foreground" />
                              {{ user.email }}
                            </div>
                          </td>
                          <td class="px-6 py-5">
                            <div class="flex flex-wrap gap-1.5">
                              @for (role of user.roles; track role) {
                                <app-badge [variant]="role === 'ROLE_SUPER_ADMIN' ? 'default' : 'secondary'" class="rounded-lg px-2.5 py-1 font-bold text-[10px] tracking-widest uppercase">
                                  {{ role.replace('ROLE_', '') }}
                                </app-badge>
                              }
                            </div>
                          </td>
                          <td class="px-6 py-5">
                             <div class="flex items-center justify-end gap-2 pr-4">
                                 <app-button variant="ghost" size="icon" class="h-10 w-10 text-muted-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent rounded-xl transition-all duration-200" (click)="$event.stopPropagation(); viewDetails(user.id!)" title="View user">
                                    <lucide-icon [img]="EyeIcon" class="h-5 w-5" />
                                 </app-button>
                                 @if (canManageUser(user.roles)) {
                                    <app-button variant="ghost" size="icon" class="h-10 w-10 text-muted-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary rounded-xl transition-all duration-200" title="Edit user">
                                       <lucide-icon [img]="EditIcon" class="h-5 w-5" />
                                    </app-button>
                                    <app-button variant="ghost" size="icon" class="h-10 w-10 text-destructive/70 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200" (click)="$event.stopPropagation(); deleteUser(user.id!)" title="Delete user">
                                      <lucide-icon [img]="Trash2Icon" class="h-5 w-5" />
                                   </app-button>
                                 }
                             </div>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
            </div>

            @if (selectedUser(); as user) {
              <div class="w-full xl:w-96 shrink-0 animate-fade-in">
                <app-card class="border-border/50 shadow-soft sticky top-36">
                  <app-card-content class="pt-6">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="text-lg font-bold font-display tracking-tight">User Details</h3>
                      <app-button variant="ghost" size="icon" class="h-8 w-8 rounded-lg" (click)="selectedUser.set(null)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </app-button>
                    </div>
                    <div class="text-center mb-6">
                      <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-soft mb-4">
                        {{ user.username.substring(0, 2).toUpperCase() }}
                      </div>
                      <h2 class="text-xl font-bold font-display tracking-tight">{{ user.username }}</h2>
                      <p class="text-muted-foreground text-sm">{{ user.email }}</p>
                    </div>
                    <div class="space-y-4">
                      <div class="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                        <lucide-icon [img]="MailIcon" class="h-4 w-4 text-primary shrink-0" />
                        <div class="min-w-0">
                          <p class="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Email</p>
                          <p class="font-medium text-sm truncate">{{ user.email }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                        <lucide-icon [img]="ShieldCheckIcon" class="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p class="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Roles</p>
                          <div class="flex flex-wrap gap-1.5">
                            @for (role of user.roles; track role) {
                              <app-badge variant="secondary" class="text-[10px]">
                                {{ role.replace('ROLE_', '') }}
                              </app-badge>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </app-card-content>
                </app-card>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserManagementComponent implements OnInit {
  sidebarService = inject(SidebarService);
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  SearchIcon = Search;
  MailIcon = Mail;
  UsersIcon = Users;
  Trash2Icon = Trash2;
  MoreVerticalIcon = MoreVertical;
  UserCircleIcon = UserCircle;
  UserCogIcon = UserCog;
  PlusIcon = Plus;
  FilterIcon = Filter;
  EyeIcon = Eye;
  ShieldCheckIcon = ShieldCheck;
  EditIcon = Edit;

  users = signal<User[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  selectedUser = signal<User | null>(null);

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter((u: User) =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to fetch users', err);
        this.loading.set(false);
      }
    });
  }

  canCreateUser(): boolean {
    const roles = this.authService.currentUser()?.roles || [];
    return roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_MODERATOR');
  }

  canManageUser(targetRoles: string[]): boolean {
    const roles = this.authService.currentUser()?.roles || [];
    const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
    const isAdmin = roles.includes('ROLE_ADMIN');
    const isModerator = roles.includes('ROLE_MODERATOR');

    const isTargetSuperAdmin = targetRoles.includes('ROLE_SUPER_ADMIN');

    if (isTargetSuperAdmin) return false;
    if (isSuperAdmin) return true;
    if (isAdmin) {
      return !targetRoles.includes('ROLE_ADMIN');
    }
    if (isModerator) {
      return targetRoles.every(role => role === 'ROLE_USER');
    }
    return false;
  }

  addNewUser() {
    this.router.navigate(['/users/new']);
  }

  viewDetails(id: number) {
    const user = this.users().find(u => u.id === id);
    if (user) this.selectedUser.set(user);
  }

  deleteUser(id: number) {
    const user = this.users().find(u => u.id === id);
    if (user?.roles.includes('ROLE_SUPER_ADMIN')) return;
    if (confirm('Are you sure you want to delete this user?')) {
       this.userService.deleteUser(id).subscribe(() => this.fetchUsers());
    }
  }
}
