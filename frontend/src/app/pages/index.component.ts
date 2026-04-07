import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingNavbarComponent } from '../shared/components/landing/navbar.component';
import { HeroSectionComponent } from '../shared/components/landing/hero-section.component';
import { FeaturesSectionComponent } from '../shared/components/landing/features-section.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, LandingNavbarComponent, HeroSectionComponent, FeaturesSectionComponent],
  template: `
    <div class="min-h-screen bg-background">
      <app-landing-navbar />
      <main>
        <app-hero-section />
        <app-features-section />
      </main>
      
      <!-- Simple Footer -->
      <footer class="py-12 border-t border-border/50 bg-card">
         <div class="container mx-auto px-4 text-center">
            <p class="text-muted-foreground text-sm">© 2024 HRMS. All rights reserved.</p>
         </div>
      </footer>
    </div>
  `,
  styles: []
})
export class IndexComponent {}
