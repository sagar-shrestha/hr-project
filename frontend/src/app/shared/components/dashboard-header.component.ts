import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  LucideAngularModule, 
  Bell, 
  Search, 
  User,
  Menu,
  X
} from 'lucide-angular';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ButtonComponent } from './button.component';
import { InputComponent } from './input.component';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ThemeToggleComponent, ButtonComponent, InputComponent],
  template: `
    <header
      [class]="'fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300'"
      [style.left]="(sidebarService.mobileOpen() || !isMobile()) ? (sidebarService.collapsed() ? '80px' : '280px') : '0'"
      [class.left-0]="isMobile()"
    >
      <div class="flex items-center gap-4 min-w-0 flex-1 md:flex-initial md:max-w-md lg:max-w-lg">
        <app-button 
          variant="ghost" 
          size="icon" 
          class="md:hidden h-10 w-10 rounded-xl flex-shrink-0"
          (click)="sidebarService.toggleMobile()"
        >
          <lucide-icon [img]="sidebarService.mobileOpen() ? XIcon : MenuIcon" class="h-5 w-5" />
        </app-button>

        <form class="relative flex-1 min-w-0 max-md:hidden" (submit)="onSearch()">
          <app-input
            [(ngModel)]="searchQuery"
            name="search"
            placeholder="Search everything..."
            class="pl-4 pr-14 h-10 bg-secondary/30 border-transparent focus:bg-background focus:border-border transition-all duration-300"
          />
          <button
            type="submit"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-sidebar-primary/10 hover:bg-sidebar-primary text-sidebar-primary hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <lucide-icon [img]="SearchIcon" class="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <app-theme-toggle />
        
        <app-button variant="ghost" size="icon" class="relative h-10 w-10 rounded-xl">
          <lucide-icon [img]="BellIcon" class="h-5 w-5" />
          <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
        </app-button>

        <div class="h-8 w-[1px] bg-border/50 mx-2 hidden sm:block"></div>

        <div class="flex items-center gap-3 pl-2">
          <div class="hidden lg:block text-right">
            <p class="text-sm font-semibold whitespace-nowrap">{{ authService.currentUser()?.username }}</p>
            <p class="text-[10px] text-muted-foreground uppercase tracking-wider">
              {{ authService.currentUser()?.roles?.[0]?.replace('ROLE_', '') }}
            </p>
          </div>
          <div class="p-1 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50">
            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-soft text-xs sm:text-sm">
              {{ (authService.currentUser()?.username ?? '').substring(0, 2).toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class DashboardHeaderComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);
  private router = inject(Router);
  SearchIcon = Search;
  BellIcon = Bell;
  UserIcon = User;
  MenuIcon = Menu;
  XIcon = X;

  searchQuery = signal('');

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  onSearch() {
    const q = this.searchQuery().trim();
    if (!q) return;
    this.router.navigate(['/users'], { queryParams: { search: q } });
    this.searchQuery.set('');
  }
}
