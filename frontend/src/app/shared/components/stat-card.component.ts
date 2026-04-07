import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, TrendingUp } from 'lucide-angular';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="containerClasses()" [style.animation-delay]="index * 0.1 + 's'">
      <div class="flex items-center justify-between mb-6">
        <div [class]="iconWrapperClasses()">
          <lucide-icon [img]="icon" class="h-6 w-6 text-sidebar-primary drop-shadow-[0_0_8px_rgba(var(--sidebar-primary-rgb),0.5)]" />
        </div>
        @if (change) {
          <div [class]="badgeClasses()">
            <lucide-icon [img]="TrendingUpIcon" class="h-3 w-3 mr-1" />
            {{ change }}
          </div>
        }
      </div>
      <div class="space-y-1">
        <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{{ title }}</p>
        <h3 class="text-3xl font-bold font-display tracking-tighter">{{ value }}</h3>
      </div>
      
      <!-- Subtle progress bar indicator -->
      <div class="mt-6 h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-sidebar-primary to-sidebar-accent transition-all duration-1000 ease-out"
          [style.width]="'65%'"
          [style.transition-delay]="index * 0.2 + 's'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() change?: string;
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() icon!: LucideIconData;
  @Input() gradient: string = '';
  @Input() index: number = 0;
  TrendingUpIcon = TrendingUp;

  containerClasses = computed(() => {
    return cn(
      "p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in-up"
    );
  });

  iconWrapperClasses = computed(() => {
    return cn("p-3 rounded-xl shadow-lg", this.gradient);
  });

  badgeClasses = computed(() => {
    const colors = {
      positive: "text-emerald-500 bg-emerald-500/10",
      negative: "text-rose-500 bg-rose-500/10",
      neutral: "text-blue-500 bg-blue-500/10",
    };
    return cn("px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider", colors[this.changeType]);
  });
}
