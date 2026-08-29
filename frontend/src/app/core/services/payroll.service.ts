import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryStructureResponse {
  id: number;
  name: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  taxRate: number;
  active: boolean;
  employeeId?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSalaryStructureRequest {
  name: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  taxRate: number;
  employeeId?: number;
  effectiveFrom?: string;
}

export interface UpdateSalaryStructureRequest {
  name?: string;
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  taxRate?: number;
  employeeId?: number;
  active?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface PayrollCalculationResult {
  employeeId: number;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  totalTaxes: number;
  ssfEmployee: number;
  ssfEmployer: number;
  basicSalary: number;
  allowances: number;
  festivalBonus: number;
  calculatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/payroll';

  calculateNetSalary(employeeId: number, structureName: string, periodStart?: string, periodEnd?: string): Observable<PayrollCalculationResult> {
    let params = `?employeeId=${employeeId}&structureName=${structureName}`;
    if (periodStart) params += `&periodStart=${periodStart}`;
    if (periodEnd) params += `&periodEnd=${periodEnd}`;
    return this.http.get<PayrollCalculationResult>(`${this.API_URL}/calculate${params}`);
  }

  createStructure(request: CreateSalaryStructureRequest): Observable<SalaryStructureResponse> {
    return this.http.post<SalaryStructureResponse>(`${this.API_URL}/structures`, request);
  }

  updateStructure(id: number, request: UpdateSalaryStructureRequest): Observable<SalaryStructureResponse> {
    return this.http.put<SalaryStructureResponse>(`${this.API_URL}/structures/${id}`, request);
  }

  deactivateStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/structures/${id}`);
  }
}
