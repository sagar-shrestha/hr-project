import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PayrollService, SalaryStructureResponse, PayrollCalculationResult, CreateSalaryStructureRequest } from '../core/services/payroll.service';
import { EmployeeService } from '../core/services/employee.service';
import { SidebarService } from '../core/services/sidebar.service';
import { DashboardSidebarComponent } from '../shared/components/dashboard-sidebar.component';
import { DashboardHeaderComponent } from '../shared/components/dashboard-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../shared/components/card.component';
import { ButtonComponent } from '../shared/components/button.component';
import { InputComponent } from '../shared/components/input.component';
import {
  LucideAngularModule,
  DollarSign,
  Calculator,
  Plus,
  Loader2,
  CheckCircle,
  Banknote
} from 'lucide-angular';

type PayrollTab = 'calculator' | 'structures';

@Component({
  selector: 'app-payroll',
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
              <h1 class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">Payroll</h1>
              <p class="text-muted-foreground flex items-center gap-2">
                <lucide-icon [img]="DollarSignIcon" class="h-5 w-5 text-sidebar-accent" />
                Salary calculation and structure management
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
            @case ('calculator') { <ng-container *ngTemplateOutlet="calculatorTab" /> }
            @case ('structures') { <ng-container *ngTemplateOutlet="structuresTab" /> }
          }
        </div>
      </main>
    </div>

    <!-- Calculator Tab -->
    <ng-template #calculatorTab>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <app-card class="border-border/50 shadow-soft">
          <app-card-header>
            <app-card-title>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="CalculatorIcon" class="h-5 w-5 text-primary" />
                <span>Net Salary Calculator</span>
              </div>
            </app-card-title>
          </app-card-header>
          <app-card-content>
            <form [formGroup]="calcForm" (ngSubmit)="calculateSalary()" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Employee ID *</label>
                <app-input formControlName="employeeId" type="number" placeholder="Enter employee ID" class="h-10.5" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Structure Name *</label>
                <app-input formControlName="structureName" placeholder="e.g. Standard, Executive" class="h-10.5" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Period Start</label>
                  <app-input formControlName="periodStart" type="date" class="h-10.5" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Period End</label>
                  <app-input formControlName="periodEnd" type="date" class="h-10.5" />
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <app-button type="submit" variant="default" [loading]="calcLoading()" class="h-11 px-6 shadow-soft">
                  <lucide-icon [img]="CalculatorIcon" class="mr-2 h-4.5 w-4.5" />
                  Calculate
                </app-button>
              </div>
            </form>
          </app-card-content>
        </app-card>

        <!-- Results -->
        @if (calcResult()) {
          <app-card class="border-border/50 shadow-soft">
            <app-card-header>
              <app-card-title>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="BanknoteIcon" class="h-5 w-5 text-emerald-500" />
                  <span>Calculation Result</span>
                </div>
              </app-card-title>
            </app-card-header>
            <app-card-content class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-muted/40">
                  <p class="text-xs font-bold uppercase text-muted-foreground mb-1">Gross Pay</p>
                  <p class="text-xl font-bold font-display">Rs. {{ calcResult()!.grossPay.toLocaleString() }}</p>
                </div>
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p class="text-xs font-bold uppercase text-emerald-600 mb-1">Net Pay</p>
                  <p class="text-2xl font-bold font-display text-emerald-600">Rs. {{ calcResult()!.netPay.toLocaleString() }}</p>
                </div>
              </div>

              <div class="space-y-3 pt-2">
                <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/20 pb-2">Breakdown</h4>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Basic Salary</span><span class="font-bold">Rs. {{ calcResult()!.basicSalary.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Allowances</span><span class="font-bold">Rs. {{ calcResult()!.allowances.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Festival Bonus</span><span class="font-bold">Rs. {{ calcResult()!.festivalBonus.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Total Deductions</span><span class="font-bold text-destructive">- Rs. {{ calcResult()!.totalDeductions.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Total Taxes</span><span class="font-bold text-destructive">- Rs. {{ calcResult()!.totalTaxes.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm pt-2 border-t border-border/20"><span class="text-muted-foreground">SSF (Employee)</span><span class="font-bold">Rs. {{ calcResult()!.ssfEmployee.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">SSF (Employer)</span><span class="font-bold">Rs. {{ calcResult()!.ssfEmployer.toLocaleString() }}</span></div>
              </div>
            </app-card-content>
          </app-card>
        }
      </div>
    </ng-template>

    <!-- Structures Tab -->
    <ng-template #structuresTab>
      <div class="max-w-2xl">
        <app-card class="border-border/50 shadow-soft">
          <app-card-header>
            <app-card-title>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="h-5 w-5 text-primary" />
                <span>Create Salary Structure</span>
              </div>
            </app-card-title>
          </app-card-header>
          <app-card-content>
            <form [formGroup]="structureForm" (ngSubmit)="createStructure()" class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Structure Name *</label>
                <app-input formControlName="name" placeholder="e.g. Standard Structure" class="h-10.5" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Basic Salary *</label>
                  <app-input formControlName="basicSalary" type="number" placeholder="50000" class="h-10.5" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Allowances *</label>
                  <app-input formControlName="allowances" type="number" placeholder="10000" class="h-10.5" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Deductions *</label>
                  <app-input formControlName="deductions" type="number" placeholder="5000" class="h-10.5" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold uppercase text-muted-foreground">Tax Rate (%) *</label>
                  <app-input formControlName="taxRate" type="number" placeholder="10" class="h-10.5" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase text-muted-foreground">Employee ID (optional)</label>
                <app-input formControlName="employeeId" type="number" placeholder="Leave empty for default" class="h-10.5" />
              </div>
              <div class="flex justify-end pt-2">
                <app-button type="submit" variant="default" [loading]="structureSubmitting()" class="h-11 px-6 shadow-soft">
                  <lucide-icon [img]="CheckCircleIcon" class="mr-2 h-4.5 w-4.5" />
                  Create Structure
                </app-button>
              </div>
            </form>
          </app-card-content>
        </app-card>
      </div>
    </ng-template>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PayrollComponent implements OnInit {
  private payrollService = inject(PayrollService);
  private fb = inject(FormBuilder);
  sidebarService = inject(SidebarService);

  DollarSignIcon = DollarSign;
  CalculatorIcon = Calculator;
  PlusIcon = Plus;
  LoaderIcon = Loader2;
  CheckCircleIcon = CheckCircle;
  BanknoteIcon = Banknote;

  tabs: { key: PayrollTab; label: string }[] = [
    { key: 'calculator', label: 'Salary Calculator' },
    { key: 'structures', label: 'Create Structure' }
  ];

  activeTab = signal<PayrollTab>('calculator');

  calcLoading = signal(false);
  calcResult = signal<PayrollCalculationResult | null>(null);

  calcForm = this.fb.group({
    employeeId: [null as number | null, Validators.required],
    structureName: ['', Validators.required],
    periodStart: [''],
    periodEnd: ['']
  });

  structureSubmitting = signal(false);

  structureForm = this.fb.group({
    name: ['', Validators.required],
    basicSalary: [null as number | null, Validators.required],
    allowances: [null as number | null, Validators.required],
    deductions: [null as number | null, Validators.required],
    taxRate: [null as number | null, Validators.required],
    employeeId: [null as number | null]
  });

  ngOnInit() {}

  calculateSalary() {
    if (this.calcForm.invalid) { this.calcForm.markAllAsTouched(); return; }
    this.calcLoading.set(true);
    const val = this.calcForm.value;
    this.payrollService.calculateNetSalary(
      val.employeeId!,
      val.structureName!,
      val.periodStart || undefined,
      val.periodEnd || undefined
    ).subscribe({
      next: (result) => { this.calcResult.set(result); this.calcLoading.set(false); },
      error: (err) => { this.calcLoading.set(false); alert(err.error?.message || 'Calculation failed.'); }
    });
  }

  createStructure() {
    if (this.structureForm.invalid) { this.structureForm.markAllAsTouched(); return; }
    this.structureSubmitting.set(true);
    const val = this.structureForm.value;
    this.payrollService.createStructure(val as CreateSalaryStructureRequest).subscribe({
      next: () => {
        this.structureSubmitting.set(false);
        this.structureForm.reset();
        alert('Salary structure created successfully.');
      },
      error: (err) => { this.structureSubmitting.set(false); alert(err.error?.message || 'Failed to create structure.'); }
    });
  }
}
