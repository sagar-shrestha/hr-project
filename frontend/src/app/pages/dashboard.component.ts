import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { StatCardComponent } from '../shared/components/stat-card.component';
import { LucideAngularModule, Users, Calendar, Briefcase, TrendingUp, MoreVertical, ShieldCheck, Plus } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardSidebarComponent, 
    DashboardHeaderComponent, 
    StatCardComponent, 
    LucideAngularModule
  ],
  template: `
<div class="min-h-screen bg-background text-foreground transition-colors duration-300">
      <app-dashboard-sidebar />
      <app-dashboard-header />

      <!-- Main Content -->
      <main
        [class]="'pt-32 pb-12 px-6 lg:px-10 transition-all duration-300 ease-in-out ' + 
                 (sidebarService.mobileOpen() ? 'opacity-50 pointer-events-none md:opacity-100 md:pointer-events-auto' : '')"
        [style.margin-left]="sidebarService.collapsed() || sidebarService.isMobile() ? (sidebarService.isMobile() ? '0' : '80px') : '280px'"
      >
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="mb-10 animate-fade-in-up">
            <h1 class="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight">Dashboard Overview CANARY123</h1>
            <p class="text-muted-foreground text-lg flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-sidebar-accent animate-pulse"></span>
              Welcome back! Here's what's happening with your team today.
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            @for (stat of stats; track stat.title; let i = $index) {
              <app-stat-card
                [title]="stat.title"
                [value]="stat.value"
                [change]="stat.change"
                [changeType]="stat.changeType"
                [icon]="stat.icon"
                [gradient]="stat.gradient"
                [index]="i"
              />
            }
          </div>

          <!-- Chart and Activity Section -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div class="xl:col-span-2 space-y-8">
              <!-- Attendance Chart Card -->
              <div class="p-8 rounded-3xl bg-card border border-border/50 shadow-soft relative overflow-hidden group">
                <div class="flex items-center justify-between mb-8">
                  <div>
                    <h3 class="text-xl font-bold font-display tracking-tight">Attendance Overview</h3>
                    <p class="text-sm text-muted-foreground mt-1">Weekly statistics of team presence</p>
                  </div>
                  <div class="flex gap-2">
                    <span class="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">Weekly</span>
                    <button class="p-1 hover:bg-secondary rounded-lg transition-colors"><lucide-icon [img]="MoreVerticalIcon" class="h-4 w-4" /></button>
                  </div>
                </div>

                <!-- CSS Bar Chart Component -->
                <div class="h-[300px] flex items-end justify-between gap-2 sm:gap-4 px-2">
                  @for (bar of chartData; track bar.day) {
                    <div class="flex-1 flex flex-col items-center gap-3 group/bar">
                      <div class="relative w-full flex flex-col items-center">
                        <div 
                          class="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-sidebar-primary to-sidebar-accent relative transition-all duration-700 ease-out hover:brightness-110 shadow-lg"
                          [style.height.px]="bar.height"
                        >
                          <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-border shadow-soft">
                            {{ bar.value }}%
                          </div>
                        </div>
                      </div>
                      <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{{ bar.day }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Extra Content for large screens -->
              <div class="hidden xl:block p-6 rounded-3xl bg-gradient-to-br from-sidebar-primary/5 to-sidebar-accent/5 border border-sidebar-primary/10 shadow-soft">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-sidebar-primary/10 flex items-center justify-center">
                    <lucide-icon [img]="ShieldCheckIcon" class="h-6 w-6 text-sidebar-primary" />
                  </div>
                  <div>
                    <h4 class="font-bold text-sm">Security Audit Completed</h4>
                    <p class="text-xs text-muted-foreground mt-1">All systems are operational and secure. Last check: 1 hour ago.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-8">
              <!-- Quick Actions -->
              <div class="p-8 rounded-3xl bg-card border border-border/50 shadow-soft">
                <h3 class="text-xl font-bold font-display mb-6 tracking-tight">Quick Actions</h3>
                <div class="space-y-4">
                  <button class="w-full p-5 rounded-2xl bg-secondary/30 hover:bg-sidebar-primary/10 hover:border-sidebar-primary/20 border border-transparent text-left transition-all duration-300 group">
                    <div class="flex items-center gap-4">
                      <div class="h-10 w-10 rounded-xl bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary group-hover:scale-110 transition-transform">
                        <lucide-icon [img]="PlusIcon" class="h-5 w-5" />
                      </div>
                      <div>
                        <p class="font-bold text-sm tracking-tight">Add New Employee</p>
                        <p class="text-[11px] text-muted-foreground">Create a fresh user record</p>
                      </div>
                    </div>
                  </button>
                  <button class="w-full p-5 rounded-2xl bg-secondary/30 hover:bg-sidebar-accent/10 hover:border-sidebar-accent/20 border border-transparent text-left transition-all duration-300 group">
                    <div class="flex items-center gap-4">
                      <div class="h-10 w-10 rounded-xl bg-sidebar-accent/10 flex items-center justify-center text-sidebar-accent group-hover:scale-110 transition-transform">
                        <lucide-icon [img]="CalendarIcon" class="h-5 w-5" />
                      </div>
                      <div>
                        <p class="font-bold text-sm tracking-tight">Review Leaves</p>
                        <p class="text-[11px] text-muted-foreground text-accent font-semibold">24 pending approvals</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="p-8 rounded-3xl bg-card border border-border/50 shadow-soft">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-xl font-bold font-display tracking-tight">Activity</h3>
                  <button class="text-xs font-semibold text-sidebar-primary hover:underline">View All</button>
                </div>
                <div class="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
                  @for (activity of activities; track activity.id) {
                    <div class="flex gap-6 relative z-10 transition-all duration-300 hover:translate-x-2">
                      <div class="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-background">
                        <lucide-icon [img]="activity.icon" class="h-5 w-5 text-sidebar-primary" />
                      </div>
                      <div class="flex flex-col justify-center">
                        <p class="text-sm leading-snug">
                          <span class="font-bold">{{ activity.user }}</span> 
                          <span class="text-muted-foreground ml-1">{{ activity.action }}</span>
                        </p>
                        <p class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">{{ activity.time }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-soft { box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
  `]
})
export class DashboardComponent {
  sidebarService = inject(SidebarService);

  PlusIcon = Plus;
  CalendarIcon = Calendar;
  MoreVerticalIcon = MoreVertical;
  ShieldCheckIcon = ShieldCheck;

  stats: Array<{ 
    title: string; 
    value: string; 
    change: string; 
    changeType: 'positive' | 'negative' | 'neutral'; 
    icon: any; 
    gradient: string; 
  }> = [
    { title: 'Total Employees', value: '854', change: '+12%', changeType: 'positive', icon: Users, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { title: 'On Leave Today', value: '12', change: '-2', changeType: 'negative', icon: Calendar, gradient: 'bg-gradient-to-br from-rose-500 to-pink-600' },
    { title: 'New Hires', value: '5', change: '+2', changeType: 'positive', icon: Briefcase, gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
    { title: 'Growth Rate', value: '24%', change: '+4%', changeType: 'positive', icon: TrendingUp, gradient: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  ];

  chartData = [
    { day: 'Mon', height: 180, value: 85 },
    { day: 'Tue', height: 220, value: 92 },
    { day: 'Wed', height: 200, value: 88 },
    { day: 'Thu', height: 240, value: 95 },
    { day: 'Fri', height: 190, value: 87 },
    { day: 'Sat', height: 120, value: 45 },
    { day: 'Sun', height: 80, value: 30 },
  ];

  activities = [
    { id: 1, user: 'Sagar Shrestha', action: 'applied for annual leave', time: '2 hours ago', icon: Calendar },
    { id: 2, user: 'Admin User', action: 'updated system permissions', time: '5 hours ago', icon: ShieldCheck },
    { id: 3, user: 'New Hire', action: 'completed onboarding', time: 'Yesterday', icon: Briefcase },
  ];
}
