import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeaveService, LeaveResponse, LeaveBalanceResponse, ApplyLeaveRequest } from '../core/services/leave.service';
import { AuthService } from '../core/services/auth.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import {
  LucideAngularModule,
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  User,
  FileText,
  MessageSquare
} from 'lucide-angular';

type Tab = 'my-leaves' | 'apply' | 'balance' | 'pending';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
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
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">Leave Management</h1>
              <p class="text-muted-foreground flex items-center gap-2">
                <lucide-icon [img]="CalendarIcon" class="h-5 w-5 text-sidebar-accent" />
                Apply, track, and manage leave requests
              </p>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex gap-1 bg-muted/40 p-1 rounded-xl w-fit border border-border/40">
            @for (tab of tabs; track tab.key) {
              <button
                (click)="activeTab.set(tab.key)"
                [class]="'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ' +
                         (activeTab() === tab.key
                           ? 'bg-card text-foreground shadow-sm border border-border/50'
                           : 'text-muted-foreground hover:text-foreground hover:bg-card/50')"
              >
                {{ tab.label }}
              </button>
            }
          </div>

          @switch (activeTab()) {
            @case ('my-leaves') { <ng-container *ngTemplateOutlet="myLeavesTab" /> }
            @case ('apply') { <ng-container *ngTemplateOutlet="applyLeaveTab" /> }
            @case ('balance') { <ng-container *ngTemplateOutlet="leaveBalanceTab" /> }
            @case ('pending') { <ng-container *ngTemplateOutlet="pendingApprovalsTab" /> }
          }
        </div>
      </main>
    </div>

    <!-- My Leaves Tab -->
    <ng-template #myLeavesTab>
      <app-card class="border-border/50 shadow-soft overflow-hidden">
        <app-card-header>
          <app-card-title>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="CalendarCheckIcon" class="h-5 w-5 text-primary" />
              <span>My Leave Requests</span>
            </div>
          </app-card-title>
        </app-card-header>
        <app-card-content>
          @if (myLeavesLoading()) {
            <div class="flex justify-center py-12">
              <lucide-icon [img]="LoaderIcon" class="h-8 w-8 animate-spin text-primary" />
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-border/40 bg-muted/40">
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Dates</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Days</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/30">
                  @for (leave of myLeaves(); track leave.id) {
                    <tr class="hover:bg-muted/20 transition-colors">
                      <td class="px-5 py-4 font-bold text-sm">{{ leave.leaveType }}</td>
                      <td class="px-5 py-4 text-sm text-muted-foreground">{{ leave.startDate }} — {{ leave.endDate }}</td>
                      <td class="px-5 py-4 text-sm">{{ leave.totalDays }}</td>
                      <td class="px-5 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{{ leave.reason }}</td>
                      <td class="px-5 py-4">
                        <app-badge [variant]="leave.status === 'APPROVED' ? 'default' : leave.status === 'REJECTED' ? 'destructive' : 'secondary'">
                          {{ leave.status }}
                        </app-badge>
                      </td>
                    </tr>
                  }
                  @if (myLeaves().length === 0) {
                    <tr>
                      <td colspan="5" class="px-5 py-12 text-center text-muted-foreground">No leave requests found.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </app-card-content>
      </app-card>
    </ng-template>

    <!-- Apply Leave Tab -->
    <ng-template #applyLeaveTab>
      <div class="max-w-2xl">
        <app-card class="border-border/50 shadow-soft">
          <app-card-header>
            <app-card-title>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="h-5 w-5 text-primary" />
                <span>Apply for Leave</span>
              </div>
            </app-card-title>
          </app-card-header>
          <app-card-content>
            <form [formGroup]="leaveForm" (ngSubmit)="submitLeave()" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Leave Type *</label>
                <select formControlName="leaveType" class="flex h-10.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Select type...</option>
                  <option value="ANNUAL">Annual</option>
                  <option value="SICK">Sick</option>
                  <option value="MATERNITY">Maternity</option>
                  <option value="PATERNITY">Paternity</option>
                  <option value="HOME">Home</option>
                  <option value="BEREAVEMENT">Bereavement</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Start Date *</label>
                  <app-input formControlName="startDate" type="date" class="h-10.5" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">End Date *</label>
                  <app-input formControlName="endDate" type="date" class="h-10.5" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Reason *</label>
                <textarea
                  formControlName="reason"
                  rows="4"
                  class="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Please explain the reason for your leave..."
                ></textarea>
              </div>
              <div class="flex gap-3 justify-end pt-2">
                <app-button type="submit" variant="default" [loading]="submittingLeave()" class="h-11 px-6 shadow-soft">
                  @if (submittingLeave()) {
                    <lucide-icon [img]="LoaderIcon" class="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  } @else {
                    <lucide-icon [img]="CheckCircleIcon" class="mr-2 h-4.5 w-4.5" />
                    Submit Leave Request
                  }
                </app-button>
              </div>
            </form>
          </app-card-content>
        </app-card>
      </div>
    </ng-template>

    <!-- Leave Balance Tab -->
    <ng-template #leaveBalanceTab>
      <app-card class="border-border/50 shadow-soft overflow-hidden">
        <app-card-header>
          <app-card-title>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="CalendarIcon" class="h-5 w-5 text-primary" />
              <span>Leave Balance</span>
            </div>
          </app-card-title>
        </app-card-header>
        <app-card-content>
          @if (balanceLoading()) {
            <div class="flex justify-center py-12">
              <lucide-icon [img]="LoaderIcon" class="h-8 w-8 animate-spin text-primary" />
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (item of balance(); track item.leaveType) {
                <div class="p-5 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md transition-all">
                  <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{{ item.leaveType }}</p>
                  <div class="flex items-end gap-4">
                    <div>
                      <p class="text-2xl font-bold font-display">{{ item.remainingDays }}</p>
                      <p class="text-xs text-muted-foreground">remaining</p>
                    </div>
                    <div class="text-xs text-muted-foreground space-y-0.5 pb-1">
                      <p>Total: {{ item.totalDays }}</p>
                      <p>Used: {{ item.usedDays }}</p>
                    </div>
                  </div>
                  <div class="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-sidebar-primary to-sidebar-accent transition-all"
                      [style.width.%]="item.totalDays > 0 ? (item.usedDays / item.totalDays) * 100 : 0"
                    ></div>
                  </div>
                </div>
              }
              @if (balance().length === 0) {
                <div class="col-span-full text-center py-12 text-muted-foreground">
                  No leave balance information available.
                </div>
              }
            </div>
          }
        </app-card-content>
      </app-card>
    </ng-template>

    <!-- Pending Approvals Tab (Admin/Moderator only) -->
    <ng-template #pendingApprovalsTab>
      <app-card class="border-border/50 shadow-soft overflow-hidden">
        <app-card-header>
          <app-card-title>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="ClockIcon" class="h-5 w-5 text-primary" />
              <span>Pending Approvals</span>
            </div>
          </app-card-title>
        </app-card-header>
        <app-card-content>
          @if (!canApprove()) {
            <div class="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <lucide-icon [img]="AlertCircleIcon" class="h-10 w-10" />
              <p class="text-sm">You don't have permission to approve leave requests.</p>
            </div>
          } @else if (pendingLoading()) {
            <div class="flex justify-center py-12">
              <lucide-icon [img]="LoaderIcon" class="h-8 w-8 animate-spin text-primary" />
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-border/40 bg-muted/40">
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Dates</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Days</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason</th>
                    <th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/30">
                  @for (leave of pendingLeaves(); track leave.id) {
                    <tr class="hover:bg-muted/20 transition-colors">
                      <td class="px-5 py-4 font-bold text-sm">{{ leave.username }}</td>
                      <td class="px-5 py-4 text-sm">{{ leave.leaveType }}</td>
                      <td class="px-5 py-4 text-sm text-muted-foreground">{{ leave.startDate }} — {{ leave.endDate }}</td>
                      <td class="px-5 py-4 text-sm">{{ leave.totalDays }}</td>
                      <td class="px-5 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{{ leave.reason }}</td>
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-2">
                          <app-button variant="default" size="sm" class="h-8 px-3 text-xs rounded-lg" (click)="openApproveDialog(leave)">
                            <lucide-icon [img]="CheckCircleIcon" class="mr-1 h-3.5 w-3.5" />
                            Approve
                          </app-button>
                          <app-button variant="outline" size="sm" class="h-8 px-3 text-xs rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10" (click)="openRejectDialog(leave)">
                            <lucide-icon [img]="XCircleIcon" class="mr-1 h-3.5 w-3.5" />
                            Reject
                          </app-button>
                        </div>
                      </td>
                    </tr>
                  }
                  @if (pendingLeaves().length === 0) {
                    <tr>
                      <td colspan="6" class="px-5 py-12 text-center text-muted-foreground">No pending leave requests.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </app-card-content>
      </app-card>
    </ng-template>

    <!-- Approve/Reject Remarks Dialog -->
    @if (actionDialog()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" (click)="closeDialog()"></div>
        <div class="relative bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
          <h3 class="text-lg font-bold font-display mb-4">
            {{ actionType() === 'approve' ? 'Approve' : 'Reject' }} Leave Request
          </h3>
          <p class="text-sm text-muted-foreground mb-4">
            {{ selectedLeave()?.username }} — {{ selectedLeave()?.leaveType }} ({{ selectedLeave()?.startDate }} — {{ selectedLeave()?.endDate }})
          </p>
          <div class="space-y-1.5 mb-6">
            <label class="text-xs font-bold uppercase text-muted-foreground">Remarks (optional)</label>
            <textarea
              [(ngModel)]="actionRemarks"
              rows="3"
              class="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Add any remarks..."
            ></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <app-button variant="outline" (click)="closeDialog()" class="h-10 px-4">Cancel</app-button>
            <app-button
              variant="default"
              [loading]="actionSubmitting()"
              (click)="confirmAction()"
              [class]="'h-10 px-5 ' + (actionType() === 'reject' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : '')"
            >
              {{ actionType() === 'approve' ? 'Approve' : 'Reject' }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LeaveComponent implements OnInit {
  private leaveService = inject(LeaveService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  sidebarService = inject(SidebarService);

  CalendarIcon = Calendar;
  CalendarCheckIcon = CalendarCheck;
  CalendarXIcon = CalendarX;
  ClockIcon = Clock;
  PlusIcon = Plus;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  LoaderIcon = Loader2;
  AlertCircleIcon = AlertCircle;

  tabs: { key: Tab; label: string }[] = [
    { key: 'my-leaves', label: 'My Leaves' },
    { key: 'apply', label: 'Apply Leave' },
    { key: 'balance', label: 'Leave Balance' },
    { key: 'pending', label: 'Pending Approvals' }
  ];

  activeTab = signal<Tab>('my-leaves');

  myLeaves = signal<LeaveResponse[]>([]);
  myLeavesLoading = signal(true);

  balance = signal<LeaveBalanceResponse[]>([]);
  balanceLoading = signal(true);

  pendingLeaves = signal<LeaveResponse[]>([]);
  pendingLoading = signal(true);

  submittingLeave = signal(false);

  leaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', Validators.required]
  });

  // Approve/Reject dialog state
  actionDialog = signal(false);
  actionType = signal<'approve' | 'reject'>('approve');
  selectedLeave = signal<LeaveResponse | null>(null);
  actionRemarks = '';
  actionSubmitting = signal(false);

  canApprove(): boolean {
    const user = this.authService.currentUser();
    const roles = user?.roles || [];
    return roles.some(r => ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR'].includes(r));
  }

  ngOnInit() {
    this.fetchMyLeaves();
    this.fetchBalance();
    if (this.canApprove()) this.fetchPendingLeaves();
  }

  fetchMyLeaves() {
    this.myLeavesLoading.set(true);
    this.leaveService.getMyLeaves().subscribe({
      next: (data) => { this.myLeaves.set(data); this.myLeavesLoading.set(false); },
      error: () => this.myLeavesLoading.set(false)
    });
  }

  fetchBalance() {
    this.balanceLoading.set(true);
    this.leaveService.viewBalance().subscribe({
      next: (data) => { this.balance.set(data); this.balanceLoading.set(false); },
      error: () => this.balanceLoading.set(false)
    });
  }

  fetchPendingLeaves() {
    this.pendingLoading.set(true);
    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => { this.pendingLeaves.set(data); this.pendingLoading.set(false); },
      error: () => this.pendingLoading.set(false)
    });
  }

  submitLeave() {
    if (this.leaveForm.invalid) { this.leaveForm.markAllAsTouched(); return; }
    this.submittingLeave.set(true);
    const val = this.leaveForm.value;
    this.leaveService.applyLeave(val as ApplyLeaveRequest).subscribe({
      next: () => {
        this.submittingLeave.set(false);
        this.leaveForm.reset();
        this.fetchMyLeaves();
        this.fetchBalance();
        this.activeTab.set('my-leaves');
      },
      error: (err) => {
        this.submittingLeave.set(false);
        alert(err.error?.message || 'Failed to apply leave.');
      }
    });
  }

  openApproveDialog(leave: LeaveResponse) {
    this.actionType.set('approve');
    this.selectedLeave.set(leave);
    this.actionRemarks = '';
    this.actionDialog.set(true);
  }

  openRejectDialog(leave: LeaveResponse) {
    this.actionType.set('reject');
    this.selectedLeave.set(leave);
    this.actionRemarks = '';
    this.actionDialog.set(true);
  }

  closeDialog() {
    this.actionDialog.set(false);
    this.selectedLeave.set(null);
  }

  confirmAction() {
    const leave = this.selectedLeave();
    if (!leave) return;
    this.actionSubmitting.set(true);
    const request = { remarks: this.actionRemarks };
    const action$ = this.actionType() === 'approve'
      ? this.leaveService.approveLeave(leave.id, request)
      : this.leaveService.rejectLeave(leave.id, request);

    action$.subscribe({
      next: () => {
        this.actionSubmitting.set(false);
        this.closeDialog();
        this.fetchPendingLeaves();
        this.fetchMyLeaves();
      },
      error: (err) => {
        this.actionSubmitting.set(false);
        alert(err.error?.message || `Failed to ${this.actionType()} leave.`);
      }
    });
  }
}
