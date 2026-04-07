import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowRight, Play, Sparkles } from 'lucide-angular';
import { ButtonComponent } from '../button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, ButtonComponent],
  template: `
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20"></div>
      
      <!-- Animated gradient orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s"></div>
      
      <!-- Grid pattern -->
      <div 
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px); background-size: 60px 60px;"
      ></div>

      <div class="container mx-auto px-4 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent mb-8 animate-fade-in-up">
            <lucide-icon [img]="SparklesIcon" class="h-4 w-4" />
            <span class="text-sm font-medium">Trusted by 10,000+ companies worldwide</span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
            Empower Your <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-flow">Workforce</span>
          </h1>

          <!-- Subtext -->
          <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style="animation-delay: 0.2s">
            The all-in-one HR platform for modern teams. Streamline payroll, 
            track attendance, and boost employee performance with intelligent automation.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.3s">
            <app-button 
              variant="hero" 
              size="lg" 
              (click)="navigateTo('/signup')"
              class="w-full sm:w-auto group"
            >
              Get Started Free
              <lucide-icon [img]="ArrowRightIcon" class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </app-button>
            <app-button 
              variant="outline" 
              size="lg" 
              class="w-full sm:w-auto group border-accent/20 text-accent hover:bg-accent/5"
            >
              <lucide-icon [img]="PlayIcon" class="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              View Demo
            </app-button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in-up" style="animation-delay: 0.4s">
            @for (stat of landingStats; track stat.label; let i = $index) {
              <div class="text-center">
                <div 
                  class="text-2xl sm:text-4xl font-display font-bold text-foreground animate-scale-in"
                  [style.animation-delay]="0.5 + i * 0.1 + 's'"
                >
                  {{ stat.value }}
                </div>
                <div class="text-sm text-muted-foreground mt-1">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style="animation-delay: 1s">
        <div class="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce-custom"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-gradient-flow { animation: gradient-flow 3s linear infinite; }
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
    .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; opacity: 0; }
    .animate-bounce-custom { animation: bounceCustom 1.5s infinite; }
    
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes gradient-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    @keyframes bounceCustom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
  `]
})
export class HeroSectionComponent {
  private router = inject(Router);

  SparklesIcon = Sparkles;
  ArrowRightIcon = ArrowRight;
  PlayIcon = Play;

  landingStats = [
    { value: '10K+', label: 'Companies' },
    { value: '500K+', label: 'Employees Managed' },
    { value: '99.9%', label: 'Uptime' },
  ];

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
