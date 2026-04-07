import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/components/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-9xl font-display font-bold text-primary opacity-20">404</h1>
      <div class="absolute">
        <h2 class="text-3xl font-display font-bold mb-4">Page Not Found</h2>
        <p class="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <app-button routerLink="/" variant="hero">
          Return Home
        </app-button>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
