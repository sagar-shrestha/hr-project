import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-angular';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ButtonComponent],
  template: `
    <!-- Mobile Backdrop -->
    @if (sidebarService.mobileOpen()) {
      <div 
        class="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        (click)="sidebarService.toggleMobile()"
      ></div>
    }

    <aside
      [class]="'fixed left-0 top-0 bottom-0 z-40 bg-sidebar border-r border-sidebar-border shadow-soft transition-all duration-300 ease-in-out ' + 
               (sidebarService.mobileOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0')"
      [style.width]="sidebarService.collapsed() ? '80px' : '280px'"
    >
      <div class="flex flex-col h-full bg-sidebar/50 backdrop-blur-md">
        <!-- Logo Section -->
        <div class="flex items-center h-20 px-6 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent shadow-soft transition-all duration-300 group-hover:scale-110">
              <lucide-icon [img]="UsersIcon" class="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            @if (!sidebarService.collapsed()) {
              <span class="text-xl font-display font-bold text-sidebar-foreground tracking-tight animate-fade-in">
                HRMS
              </span>
            }
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          @for (item of navigationItems; track item.label) {
            @if (!item.role || hasRole(item.role)) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-sidebar-accent/10 text-sidebar-accent shadow-sm border-l-4 border-sidebar-accent"
                class="flex items-center gap-4 px-3 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent/5 hover:text-sidebar-accent transition-all duration-200 group relative"
                (click)="sidebarService.setMobileOpen(false)"
              >
                <lucide-icon [img]="item.icon" class="h-5 w-5 transition-transform group-hover:scale-110" />
                @if (!sidebarService.collapsed()) {
                  <span class="font-medium text-sm animate-fade-in">{{ item.label }}</span>
                }
                @if (sidebarService.collapsed()) {
                  <div class="absolute left-16 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-border shadow-soft">
                    {{ item.label }}
                  </div>
                }
              </a>
            }
          }
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-3 border-t border-sidebar-border bg-sidebar/30">
          <app-button
            variant="ghost"
            (click)="authService.logout()"
            class="w-full flex items-center gap-4 px-3 py-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200"
          >
            <lucide-icon [img]="LogoutIcon" class="h-5 w-5" />
            @if (!sidebarService.collapsed()) {
              <span class="font-medium text-sm animate-fade-in">Log out</span>
            }
          </app-button>

          <app-button
            variant="ghost"
            size="icon"
            (click)="sidebarService.toggle()"
            class="absolute -right-3 top-24 h-6 w-6 rounded-full bg-sidebar border border-sidebar-border shadow-soft hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-center transition-transform hover:scale-110 z-50 hidden md:flex"
          >
            <lucide-icon [img]="sidebarService.collapsed() ? ChevronRightIcon : ChevronLeftIcon" class="h-3 w-3" />
          </app-button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class DashboardSidebarComponent {
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);

  UsersIcon = Users;
  LogoutIcon = LogOut;
  ChevronLeftIcon = ChevronLeft;
  ChevronRightIcon = ChevronRight;

  navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/dashboard/users', icon: Users, role: 'ROLE_ADMIN' },
    { label: 'Permissions', path: '/permissions', icon: ShieldCheck, role: 'ROLE_SUPER_ADMIN' },
    { label: 'Attendance', path: '/dashboard/attendance', icon: Calendar },
    { label: 'Jobs', path: '/dashboard/jobs', icon: Briefcase },
    { label: 'Reports', path: '/dashboard/reports', icon: TrendingUp },
  ];

  hasRole(role: string): boolean {
    return this.authService.currentUser()?.roles.includes(role) || 
           this.authService.currentUser()?.roles.includes('ROLE_SUPER_ADMIN') || false;
  }
}
