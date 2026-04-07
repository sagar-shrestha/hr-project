import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Zap, Shield, BarChart3, Clock } from 'lucide-angular';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="features" class="py-24 bg-secondary/10">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 class="text-3xl sm:text-4xl font-display font-bold mb-4">Everything you need to manage your team</h2>
          <p class="text-lg text-muted-foreground">
            Powerful tools to help you streamline HR processes and focus on what matters most—your people.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (feature of features; track feature.title; let i = $index) {
            <div 
              class="p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in-up"
              [style.animation-delay]="0.1 * i + 's'"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <lucide-icon [img]="feature.icon" class="h-6 w-6" />
              </div>
              <h3 class="text-xl font-bold mb-3 font-display tracking-tight">{{ feature.title }}</h3>
              <p class="text-muted-foreground leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FeaturesSectionComponent {
  ZapIcon = Zap;
  ShieldIcon = Shield;
  BarChartIcon = BarChart3;
  ClockIcon = Clock;

  features = [
    { title: 'Fast Onboarding', description: 'Get new hires up and running in minutes with automated workflows.', icon: Zap },
    { title: 'Secure Data', description: 'Enterprise-grade security to keep your employee data safe and compliant.', icon: Shield },
    { title: 'Insightful Analytics', description: 'Make data-driven decisions with real-time HR dashboards.', icon: BarChart3 },
    { title: 'Time Tracking', description: 'Simple attendance and leave management for modern teams.', icon: Clock },
  ];
}
