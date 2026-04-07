import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Users, Menu, X } from 'lucide-angular';
import { ButtonComponent } from '../button.component';
import { ThemeToggleComponent } from '../theme-toggle.component';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ButtonComponent, ThemeToggleComponent],
  template: `
    <nav
      [class]="'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b'"
      [class.py-4]="!isScrolled()"
      [class.py-3]="isScrolled()"
      [class.bg-background/80]="isScrolled()"
      [class.backdrop-blur-md]="isScrolled()"
      [class.border-border/50]="isScrolled()"
      [class.border-transparent]="!isScrolled()"
      [class.bg-transparent]="!isScrolled()"
    >
      <div class="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 group">
          <div class="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft transition-all duration-300 group-hover:scale-110">
            <lucide-icon [img]="UsersIcon" class="h-6 w-6 text-white" />
          </div>
          <span class="text-2xl font-display font-bold tracking-tight">HRMS</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#solutions" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Solutions</a>
          <a href="#pricing" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          <a href="#resources" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Resources</a>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-4">
          <app-theme-toggle />
          <app-button variant="ghost" (click)="login()">Log In</app-button>
          <app-button variant="hero" (click)="signup()">Get Started</app-button>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="flex md:hidden items-center gap-4">
          <app-theme-toggle />
          <button (click)="toggleMenu()" class="p-2 text-foreground">
            <lucide-icon [img]="isMenuOpen() ? XIcon : MenuIcon" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMenuOpen()) {
        <div class="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 space-y-6 animate-fade-in-down">
          <div class="flex flex-col gap-4">
            <a href="#features" (click)="toggleMenu()" class="text-lg font-medium">Features</a>
            <a href="#solutions" (click)="toggleMenu()" class="text-lg font-medium">Solutions</a>
            <a href="#pricing" (click)="toggleMenu()" class="text-lg font-medium">Pricing</a>
            <a href="#resources" (click)="toggleMenu()" class="text-lg font-medium">Resources</a>
          </div>
          <div class="flex flex-col gap-3 pt-4 border-t border-border">
            <app-button variant="outline" class="w-full" (click)="login()">Log In</app-button>
            <app-button variant="hero" class="w-full" (click)="signup()">Get Started</app-button>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LandingNavbarComponent {
  private router = inject(Router);

  UsersIcon = Users;
  MenuIcon = Menu;
  XIcon = X;

  isScrolled = signal(false);
  isMenuOpen = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  login() {
    this.router.navigate(['/login']);
  }

  signup() {
    this.router.navigate(['/signup']);
  }
}
