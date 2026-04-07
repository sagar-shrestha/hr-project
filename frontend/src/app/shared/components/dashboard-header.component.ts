import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
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
  imports: [CommonModule, LucideAngularModule, ThemeToggleComponent, ButtonComponent, InputComponent],
  template: `
    <header
      [class]="'fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300'"
      [style.left]="(sidebarService.mobileOpen() || !isMobile()) ? (sidebarService.collapsed() ? '80px' : '280px') : '0'"
      [class.left-0]="isMobile()"
    >
      <div class="flex items-center gap-4 w-full max-w-xl">
        <app-button 
          variant="ghost" 
          size="icon" 
          class="md:hidden h-10 w-10 rounded-xl"
          (click)="sidebarService.toggleMobile()"
        >
          <lucide-icon [img]="sidebarService.mobileOpen() ? XIcon : MenuIcon" class="h-5 w-5" />
        </app-button>

        <div class="relative w-full max-md:hidden">
          <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <app-input
            placeholder="Search everything..."
            class="pl-10 h-10 bg-secondary/30 border-transparent focus:bg-background focus:border-border transition-all duration-300"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
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
  SearchIcon = Search;
  BellIcon = Bell;
  UserIcon = User;
  MenuIcon = Menu;
  XIcon = X;

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
