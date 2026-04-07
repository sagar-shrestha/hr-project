import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { SidebarService } from '../core/services/sidebar.service';
import { User } from '../core/models/user.model';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import { LucideAngularModule, ArrowLeft, Mail, User as UserIcon, Shield } from 'lucide-angular';

@Component({
  selector: 'app-user-details',
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
    ButtonComponent,
    LucideAngularModule
  ],
  template: `
    <div class="min-h-screen bg-background">
      <app-dashboard-sidebar />
      <app-dashboard-header />

      <main
        [class]="'pt-24 pb-8 px-6 lg:px-8 transition-all duration-300 ease-in-out'"
        [style.margin-left]="sidebarService.collapsed() ? '80px' : '280px'"
      >
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <app-button variant="ghost" (click)="goBack()" class="group">
            <lucide-icon [img]="ArrowLeftIcon" class="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </app-button>

          @if (loading()) {
             <div class="flex items-center justify-center h-64">
                <p class="text-muted-foreground">Loading user details...</p>
             </div>
          } @else if (user()) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
               <!-- Profile Card -->
               <app-card class="md:col-span-1 border-border/50 shadow-soft">
                  <app-card-content class="pt-6 text-center">
                     <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-soft mb-4">
                        {{ (user()?.username ?? '').substring(0, 2).toUpperCase() }}
                     </div>
                     <h2 class="text-xl font-bold font-display uppercase tracking-tight">{{ user()?.username }}</h2>
                     <p class="text-muted-foreground text-sm">{{ user()?.email }}</p>
                  </app-card-content>
               </app-card>

               <!-- Details Card -->
               <app-card class="md:col-span-2 border-border/50 shadow-soft">
                  <app-card-header>
                     <app-card-title>Account Information</app-card-title>
                  </app-card-header>
                  <app-card-content class="space-y-6">
                     <div class="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                        <lucide-icon [img]="UserIcon" class="h-5 w-5 text-primary" />
                        <div>
                           <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Username</p>
                           <p class="font-medium text-sm">{{ user()?.username }}</p>
                        </div>
                     </div>

                     <div class="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                        <lucide-icon [img]="MailIcon" class="h-5 w-5 text-primary" />
                        <div>
                           <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email</p>
                           <p class="font-medium text-sm">{{ user()?.email }}</p>
                        </div>
                     </div>

                     <div class="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                        <lucide-icon [img]="ShieldIcon" class="h-5 w-5 text-primary" />
                        <div class="flex-1">
                           <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Roles & Permissions</p>
                           <div class="flex flex-wrap gap-2">
                              @for (role of user()?.roles; track role) {
                                 <app-badge variant="secondary">
                                    {{ role.replace('ROLE_', '') }}
                                 </app-badge>
                              }
                           </div>
                        </div>
                     </div>
                  </app-card-content>
               </app-card>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  sidebarService = inject(SidebarService);

  ArrowLeftIcon = ArrowLeft;
  MailIcon = Mail;
  UserIcon = UserIcon;
  ShieldIcon = Shield;

  user = signal<User | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
       this.fetchUser(id);
    }
  }

  fetchUser(id: number) {
     this.loading.set(true);
     this.userService.getUser(id).subscribe({
        next: (data) => {
           this.user.set(data);
           this.loading.set(false);
        },
        error: (err) => {
           console.error('Failed to fetch user', err);
           this.loading.set(false);
        }
     });
  }

  goBack() {
     this.router.navigate(['/dashboard/users']);
  }
}
