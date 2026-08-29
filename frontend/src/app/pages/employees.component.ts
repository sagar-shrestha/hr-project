import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, EmployeeResponse } from '../core/services/employee.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { BadgeComponent } from '../shared/components/badge.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import { 
  LucideAngularModule, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Briefcase, 
  Calendar, 
  Loader2, 
  Mail, 
  Phone, 
  X,
  CheckCircle,
  FileText,
  User,
  AlertCircle
} from 'lucide-angular';

@Component({
  selector: 'app-employees',
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
          <!-- Page Header -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">Employee Directory</h1>
              <p class="text-muted-foreground flex items-center gap-2">
                <lucide-icon [img]="BriefcaseIcon" class="h-5 w-5 text-sidebar-accent" />
                Manage employee profiles, designations, and corporate information
              </p>
            </div>
            <app-button variant="default" class="h-11 px-5 rounded-xl shadow-soft" (click)="openAddModal()">
              <lucide-icon [img]="PlusIcon" class="mr-2 h-4 w-4" />
              Add Employee
            </app-button>
          </div>

          <!-- Controls Section -->
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-border/40 shadow-sm">
            <div class="relative w-full sm:w-80">
              <lucide-icon [img]="SearchIcon" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email or code..."
                class="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                [(ngModel)]="searchQuery"
                (input)="filterEmployees()"
              />
            </div>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Showing <strong>{{ filteredEmployees().length }}</strong> of <strong>{{ employees().length }}</strong> employees</span>
            </div>
          </div>

          <!-- Employees Table / Grid -->
          @if (loading()) {
            <div class="flex justify-center py-20">
              <lucide-icon [img]="LoaderIcon" class="h-10 w-10 animate-spin text-primary" />
            </div>
          } @else {
            <app-card class="border-border/50 shadow-soft overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left">
                  <thead>
                    <tr class="border-b border-border/40 bg-muted/40">
                      <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</th>
                      <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Code / Title</th>
                      <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</th>
                      <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border/30">
                    @for (emp of filteredEmployees(); track emp.id) {
                      <tr class="hover:bg-muted/20 transition-colors group">
                        <td class="px-6 py-5">
                          <div class="flex items-center gap-3">
                            <div class="h-11 w-11 rounded-full bg-gradient-to-br from-sidebar-primary/20 to-sidebar-accent/20 flex items-center justify-center font-bold text-sidebar-primary">
                              {{ emp.name.charAt(0) }}
                            </div>
                            <div>
                              <p class="font-bold text-sm text-foreground">{{ emp.name }}</p>
                              @if (emp.nameNepali) {
                                <p class="text-xs text-muted-foreground/80 font-medium">{{ emp.nameNepali }}</p>
                              }
                              <div class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span class="flex items-center gap-1"><lucide-icon [img]="MailIcon" class="h-3 w-3" /> {{ emp.email }}</span>
                                @if (emp.phone) {
                                  <span class="flex items-center gap-1"><lucide-icon [img]="PhoneIcon" class="h-3 w-3" /> {{ emp.phone }}</span>
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-5">
                          <p class="font-bold text-sm text-foreground">{{ emp.designation || 'N/A' }}</p>
                          <p class="text-xs text-muted-foreground">{{ emp.employeeCode || 'N/A' }}</p>
                        </td>
                        <td class="px-6 py-5">
                          <p class="text-sm font-medium text-foreground">{{ emp.departmentName || 'N/A' }}</p>
                          @if (emp.joinDate) {
                            <p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <lucide-icon [img]="CalendarIcon" class="h-3 w-3" /> Joined: {{ emp.joinDate | date:'mediumDate' }}
                            </p>
                          }
                        </td>
                        <td class="px-6 py-5">
                          <app-badge [variant]="emp.status === 'ACTIVE' ? 'default' : 'secondary'">
                            {{ emp.status }}
                          </app-badge>
                        </td>
                        <td class="px-6 py-5">
                          <div class="flex items-center justify-end gap-2 pr-2">
                            <app-button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary rounded-xl" (click)="openEditModal(emp)" title="Edit Employee">
                              <lucide-icon [img]="EditIcon" class="h-4.5 w-4.5" />
                            </app-button>
                            <app-button variant="ghost" size="icon" class="h-9 w-9 text-destructive/70 hover:bg-destructive/10 hover:text-destructive rounded-xl" (click)="deleteEmployee(emp.id)" title="Delete Employee">
                              <lucide-icon [img]="TrashIcon" class="h-4.5 w-4.5" />
                            </app-button>
                          </div>
                        </td>
                      </tr>
                    }
                    @if (filteredEmployees().length === 0) {
                      <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
                          No employees found. Try a different query or add one.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </app-card>
          }
        </div>
      </main>
    </div>

    <!-- Side Slide-out Form Panel (Modal Drawer) -->
    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" (click)="closeModal()"></div>

        <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col">
            <div class="px-6 py-6 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center">
                  <lucide-icon [img]="isEditMode() ? EditIcon : PlusIcon" class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-bold font-display tracking-tight">{{ isEditMode() ? 'Edit Employee Profile' : 'Add New Employee' }}</h2>
                  <p class="text-xs text-muted-foreground mt-0.5">Please provide all necessary occupational details</p>
                </div>
              </div>
              <app-button variant="ghost" size="icon" class="rounded-xl h-10 w-10" (click)="closeModal()">
                <lucide-icon [img]="XIcon" class="h-5 w-5" />
              </app-button>
            </div>

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              @if (formSubmitted() && employeeForm.invalid) {
                <div class="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                  <lucide-icon [img]="AlertCircleIcon" class="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p class="text-sm font-bold text-destructive">Please fix the following errors:</p>
                    <ul class="text-xs text-destructive/80 mt-1 space-y-0.5 list-disc list-inside">
                      @if (employeeForm.get('name')?.invalid) { <li>Full Name is required</li> }
                      @if (employeeForm.get('email')?.invalid) {
                        <li>
                          {{ employeeForm.get('email')?.errors?.['required'] ? 'Email is required' : 'Please enter a valid email address' }}
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <form [formGroup]="employeeForm" class="space-y-6">
                <!-- Section: Personal Info -->
                <div class="space-y-4">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-border/20 pb-2">
                    <lucide-icon [img]="UserIcon" class="h-4 w-4" /> Personal Information
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Full Name <span class="text-destructive">*</span></label>
                      <app-input formControlName="name" placeholder="John Doe" [errorMessage]="() => 'Full Name is required'" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Name in Nepali</label>
                      <app-input formControlName="nameNepali" placeholder="राम बहादुर" class="h-10.5" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Email Address <span class="text-destructive">*</span></label>
                      <app-input formControlName="email" type="email" placeholder="john.doe@company.com" [errorMessage]="() => employeeForm.get('email')?.errors?.['required'] ? 'Email is required' : 'Please enter a valid email'" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
                      <app-input formControlName="phone" placeholder="+977-9800000000" class="h-10.5" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Date of Birth (AD)</label>
                      <app-input formControlName="dateOfBirth" type="date" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Date of Birth (BS)</label>
                      <app-input formControlName="dateOfBirthBS" placeholder="2048-05-10" class="h-10.5" />
                    </div>
                  </div>
                </div>

                <!-- Section: Corporate Info -->
                <div class="space-y-4 pt-4">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-border/20 pb-2">
                    <lucide-icon [img]="BriefcaseIcon" class="h-4 w-4" /> Employment Details
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Employee Code</label>
                      <app-input formControlName="employeeCode" placeholder="EMP-012" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Designation</label>
                      <app-input formControlName="designation" placeholder="Senior Engineer" class="h-10.5" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Join Date (AD)</label>
                      <app-input formControlName="joinDate" type="date" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Join Date (BS)</label>
                      <app-input formControlName="joinDateBS" placeholder="2079-01-01" class="h-10.5" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Department ID</label>
                      <app-input formControlName="departmentId" type="number" placeholder="1" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Status <span class="text-destructive">*</span></label>
                      <select
                        formControlName="status"
                        [class]="'flex h-10.5 w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
                          (employeeForm.get('status')?.invalid && (employeeForm.get('status')?.touched || formSubmitted())
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-input focus-visible:ring-ring')"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="TERMINATED">TERMINATED</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Section: Tax & Legal -->
                <div class="space-y-4 pt-4">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-border/20 pb-2">
                    <lucide-icon [img]="FileTextIcon" class="h-4 w-4" /> Identity & Verification
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">Citizenship Number</label>
                      <app-input formControlName="citizenshipNumber" placeholder="47291/05" class="h-10.5" />
                    </div>
                    <div class="space-y-1.5 col-span-2 sm:col-span-1">
                      <label class="text-xs font-bold uppercase text-muted-foreground">PAN Number</label>
                      <app-input formControlName="panNumber" placeholder="602941829" class="h-10.5" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Footer Actions -->
            <div class="px-6 py-4 border-t border-border bg-muted/20 flex items-center gap-3 justify-end">
              <app-button variant="outline" (click)="closeModal()" class="h-11 px-5">Cancel</app-button>
              <app-button variant="default" [loading]="submitting()" (click)="saveEmployee()" class="h-11 px-6 shadow-soft">
                @if (submitting()) {
                  <lucide-icon [img]="LoaderIcon" class="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                } @else {
                  <lucide-icon [img]="CheckCircleIcon" class="mr-2 h-4.5 w-4.5" />
                  Save Changes
                }
              </app-button>
            </div>
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
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);
  sidebarService = inject(SidebarService);

  BriefcaseIcon = Briefcase;
  PlusIcon = Plus;
  SearchIcon = Search;
  EditIcon = Edit;
  TrashIcon = Trash2;
  LoaderIcon = Loader2;
  MailIcon = Mail;
  PhoneIcon = Phone;
  CalendarIcon = Calendar;
  XIcon = X;
  CheckCircleIcon = CheckCircle;
  FileTextIcon = FileText;
  UserIcon = User;
  AlertCircleIcon = AlertCircle;

  employees = signal<EmployeeResponse[]>([]);
  filteredEmployees = signal<EmployeeResponse[]>([]);
  loading = signal(true);
  searchQuery = '';

  // Modal control
  modalOpen = signal(false);
  isEditMode = signal(false);
  selectedEmployeeId = signal<number | null>(null);
  submitting = signal(false);
  formSubmitted = signal(false);

  employeeForm = this.fb.group({
    name: ['', Validators.required],
    nameNepali: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    citizenshipNumber: [''],
    panNumber: [''],
    departmentId: [null as number | null],
    designation: [''],
    employeeCode: [''],
    dateOfBirth: [''],
    dateOfBirthBS: [''],
    joinDate: [''],
    joinDateBS: [''],
    status: ['ACTIVE', Validators.required]
  });

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading.set(true);
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.filterEmployees();
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  filterEmployees() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredEmployees.set(this.employees());
      return;
    }

    const filtered = this.employees().filter(e => 
      e.name.toLowerCase().includes(q) || 
      (e.email && e.email.toLowerCase().includes(q)) || 
      (e.employeeCode && e.employeeCode.toLowerCase().includes(q))
    );
    this.filteredEmployees.set(filtered);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedEmployeeId.set(null);
    this.formSubmitted.set(false);
    this.employeeForm.reset({
      status: 'ACTIVE'
    });
    this.modalOpen.set(true);
  }

  openEditModal(emp: EmployeeResponse) {
    this.isEditMode.set(true);
    this.selectedEmployeeId.set(emp.id);
    this.formSubmitted.set(false);
    this.employeeForm.patchValue({
      name: emp.name,
      nameNepali: emp.nameNepali,
      email: emp.email,
      phone: emp.phone,
      citizenshipNumber: emp.citizenshipNumber,
      panNumber: emp.panNumber,
      departmentId: emp.departmentId,
      designation: emp.designation,
      employeeCode: emp.employeeCode,
      dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().substring(0, 10) : null,
      dateOfBirthBS: emp.dateOfBirthBS,
      joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().substring(0, 10) : null,
      joinDateBS: emp.joinDateBS,
      status: emp.status
    });
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.formSubmitted.set(false);
  }

  saveEmployee() {
    this.formSubmitted.set(true);
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    this.submitting.set(true);
    const formVal = this.employeeForm.value;

    const payload = {
      ...formVal,
      departmentId: formVal.departmentId ? Number(formVal.departmentId) : null,
      dateOfBirth: formVal.dateOfBirth ? formVal.dateOfBirth : null,
      joinDate: formVal.joinDate ? formVal.joinDate : null
    };

    const request$ = this.isEditMode()
      ? this.employeeService.updateEmployee(this.selectedEmployeeId()!, payload)
      : this.employeeService.createEmployee(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeModal();
        this.fetchEmployees();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to save employee profile.');
        this.submitting.set(false);
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee profile?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.fetchEmployees();
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Failed to delete employee profile.');
        }
      });
    }
  }
}
