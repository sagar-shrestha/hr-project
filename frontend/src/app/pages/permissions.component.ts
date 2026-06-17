import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { LucideAngularModule, Shield, ShieldCheck, ShieldAlert, Settings } from 'lucide-angular';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
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
        <div class="max-w-7xl mx-auto space-y-10 animate-fade-in-up">
          <div class="mb-10">
            <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">Permissions & Roles</h1>
            <p class="text-muted-foreground text-lg flex items-center gap-2">
              <lucide-icon [img]="ShieldCheckIcon" class="h-5 w-5 text-sidebar-accent" />
              Configure global access controls and team hierarchy
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             @for (role of roles; track role.name; let i = $index) {
                <app-card
                  class="border-border/50 shadow-soft hover:shadow-glow transition-all duration-500 rounded-3xl overflow-hidden group"
                  [style.animation-delay]="i * 0.1 + 's'"
                >
                   <app-card-header class="p-8 pb-4">
                      <div class="flex items-center justify-between mb-6">
                         <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-sidebar-primary/20 to-sidebar-accent/20 flex items-center justify-center text-sidebar-primary group-hover:scale-110 transition-transform duration-500">
                            <lucide-icon [img]="role.icon" class="h-7 w-7" />
                         </div>
                         <app-badge [variant]="role.name === 'SUPER_ADMIN' ? 'default' : 'secondary'" class="rounded-lg px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                            {{ role.level }}
                         </app-badge>
                      </div>
                      <h3 class="text-2xl font-bold font-display tracking-tight">{{ role.name }}</h3>
                      <p class="text-sm text-muted-foreground mt-2">Core system permissions and capabilities</p>
                   </app-card-header>
                   <app-card-content class="px-8 pb-8 pt-4">
                      <div class="h-[1px] bg-border/30 w-full mb-6"></div>
                      <ul class="space-y-4">
                         @for (permission of role.permissions; track permission) {
                            <li class="flex items-center gap-3 text-sm font-medium text-muted-foreground group/item">
                               <lucide-icon [img]="ShieldCheckIcon" class="h-4 w-4 text-emerald-500 group-hover/item:scale-125 transition-transform" />
                               {{ permission }}
                            </li>
                         }
                      </ul>
                   </app-card-content>
                </app-card>
             }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class PermissionsComponent {
  sidebarService = inject(SidebarService);

  ShieldCheckIcon = ShieldCheck;

  roles = [
    {
      name: 'SUPER_ADMIN',
      level: 'Full Access',
      icon: Shield,
      permissions: ['Manage Admins', 'System Configuration', 'Audit Logs', 'Billing Access', 'All User Data']
    },
    {
      name: 'ADMIN',
      level: 'Management',
      icon: ShieldAlert,
      permissions: ['Manage Moderators', 'Manage Users', 'View Reports', 'Edit Content']
    },
    {
      name: 'MODERATOR',
      level: 'Oversight',
      icon: Settings,
      permissions: ['Manage Users', 'View Dashboard', 'Basic Reports']
    }
  ];
}
