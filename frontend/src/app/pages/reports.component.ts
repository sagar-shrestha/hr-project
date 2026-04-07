import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div class="bg-card border border-border rounded-3xl p-8 shadow-soft">
        <p class="text-muted-foreground">Reports module is coming soon...</p>
      </div>
    </div>
  `
})
export class ReportsComponent {}
