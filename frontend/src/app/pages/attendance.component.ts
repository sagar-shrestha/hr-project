import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">Attendance Management</h1>
      <div class="bg-card border border-border rounded-3xl p-8 shadow-soft">
        <p class="text-muted-foreground">Attendance module is coming soon...</p>
      </div>
    </div>
  `
})
export class AttendanceComponent {}
