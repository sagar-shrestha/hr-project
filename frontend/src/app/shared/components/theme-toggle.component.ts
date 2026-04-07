import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <app-button
      variant="ghost"
      size="icon"
      (click)="themeService.toggleDarkMode()"
      class="relative w-10 h-10 rounded-xl hover:bg-accent transition-colors duration-300"
    >
      @if (themeService.darkMode()) {
        <lucide-icon [img]="SunIcon" class="h-5 w-5 text-yellow-500 animate-scale-in" />
      } @else {
        <lucide-icon [img]="MoonIcon" class="h-5 w-5 text-foreground animate-scale-in" />
      }
      <span class="sr-only">Toggle theme</span>
    </app-button>
  `,
  styles: []
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  SunIcon = Sun;
  MoonIcon = Moon;
}
