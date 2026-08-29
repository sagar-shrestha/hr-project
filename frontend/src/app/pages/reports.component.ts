import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, AttendanceSummaryResponse } from '../core/services/report.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import {
  LucideAngularModule,
  TrendingUp,
  Calendar,
  Loader2,
  UserCheck,
  UserX,
  Clock,
  FileText
} from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
    ButtonComponent,
    LucideAngularModule
  ],
  template: `
    <div class="min-h-screen bg-background">
      <app-dashboard-sidebar />
      <app-dashboard-header />

      <main
        [class]="'pt-32 pb-12 px-6 lg:px-10 transition-all duration-300 ease-in-out ' +
                 (sidebarService.mobileOpen() ? 'opacity-50 pointer-events-none md:opacity-100 md:pointer-events-auto' : '')"
        [style.margin-left]="sidebarService.collapsed() || sidebarService.isMobile() ? (sidebarService.isMobile() ? '0' : '80px') : '280px'"
      >
        <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
          <div>
            <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">Reports & Analytics</h1>
            <p class="text-muted-foreground flex items-center gap-2">
              <lucide-icon [img]="TrendingUpIcon" class="h-5 w-5 text-sidebar-accent" />
              Attendance summary and workforce analytics
            </p>
          </div>

          <!-- Date Range Picker -->
          <div class="flex flex-col sm:flex-row gap-4 items-end bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-border/40 shadow-sm">
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
              <input
                type="date"
                [(ngModel)]="startDate"
                class="h-10.5 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase text-muted-foreground">End Date</label>
              <input
                type="date"
                [(ngModel)]="endDate"
                class="h-10.5 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <app-button variant="default" (click)="fetchSummary()" [loading]="loading()" class="h-10.5 px-5">
              <lucide-icon [img]="FileTextIcon" class="mr-2 h-4 w-4" />
              Generate Report
            </app-button>
          </div>

          <!-- Results -->
          @if (summary().length > 0) {
            <app-card class="border-border/50 shadow-soft overflow-hidden">
              <app-card-header>
                <app-card-title>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="TrendingUpIcon" class="h-5 w-5 text-primary" />
                    <span>Attendance Summary</span>
                  </div>
                </app-card-title>
              </app-card-header>
              <app-card-content>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse text-left">
                    <thead>
                      <tr class="border-b border-border/40 bg-muted/40">
                        <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</th>
                        <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span class="flex items-center gap-1"><lucide-icon [img]="UserCheckIcon" class="h-3.5 w-3.5" /> Present</span>
                        </th>
                        <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span class="flex items-center gap-1"><lucide-icon [img]="UserXIcon" class="h-3.5 w-3.5" /> Absent</span>
                        </th>
                        <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span class="flex items-center gap-1"><lucide-icon [img]="ClockIcon" class="h-3.5 w-3.5" /> Late</span>
                        </th>
                        <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span class="flex items-center gap-1"><lucide-icon [img]="CalendarIcon" class="h-3.5 w-3.5" /> On Leave</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border/30">
                      @for (row of summary(); track row.department) {
                        <tr class="hover:bg-muted/20 transition-colors">
                          <td class="px-5 py-4 font-bold text-sm">{{ row.department }}</td>
                          <td class="px-5 py-4"><app-badge variant="success">{{ row.present }}</app-badge></td>
                          <td class="px-5 py-4"><app-badge variant="destructive">{{ row.absent }}</app-badge></td>
                          <td class="px-5 py-4"><app-badge variant="secondary">{{ row.late }}</app-badge></td>
                          <td class="px-5 py-4"><app-badge variant="outline">{{ row.leave }}</app-badge></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </app-card-content>
            </app-card>
          } @else if (!loading() && queried()) {
            <div class="text-center py-12 text-muted-foreground">
              No attendance data found for the selected period.
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReportsComponent {
  private reportService = inject(ReportService);
  sidebarService = inject(SidebarService);

  TrendingUpIcon = TrendingUp;
  CalendarIcon = Calendar;
  LoaderIcon = Loader2;
  UserCheckIcon = UserCheck;
  UserXIcon = UserX;
  ClockIcon = Clock;
  FileTextIcon = FileText;

  startDate = '';
  endDate = '';
  loading = signal(false);
  queried = signal(false);
  summary = signal<AttendanceSummaryResponse[]>([]);

  fetchSummary() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    this.loading.set(true);
    this.queried.set(true);
    this.reportService.getAttendanceSummary(this.startDate, this.endDate).subscribe({
      next: (data) => { this.summary.set(data); this.loading.set(false); },
      error: (err) => { this.loading.set(false); alert(err.error?.message || 'Failed to load report.'); }
    });
  }
}
