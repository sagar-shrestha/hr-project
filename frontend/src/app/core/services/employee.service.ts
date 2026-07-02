import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeResponse {
  id: number;
  name: string;
  nameNepali?: string;
  email: string;
  phone?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  departmentId?: number;
  departmentName?: string;
  designation?: string;
  employeeCode?: string;
  dateOfBirth?: string;
  dateOfBirthBS?: string;
  joinDate?: string;
  joinDateBS?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/employees';

  getEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.API_URL);
  }

  getEmployee(id: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.API_URL}/${id}`);
  }

  createEmployee(employee: any): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.API_URL, employee);
  }

  updateEmployee(id: number, employee: any): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.API_URL}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
