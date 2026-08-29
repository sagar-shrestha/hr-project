import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveResponse {
  id: number;
  userId: number;
  username: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string;
  totalDays: number;
  approvedById?: number;
  approvedByName?: string;
  approvedAt?: string;
  rejectedReason?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveBalanceResponse {
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface ApplyLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApproveRejectRequest {
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/leaves';

  applyLeave(request: ApplyLeaveRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(`${this.API_URL}/apply`, request);
  }

  approveLeave(id: number, request: ApproveRejectRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(`${this.API_URL}/${id}/approve`, request);
  }

  rejectLeave(id: number, request: ApproveRejectRequest): Observable<LeaveResponse> {
    return this.http.post<LeaveResponse>(`${this.API_URL}/${id}/reject`, request);
  }

  viewBalance(): Observable<LeaveBalanceResponse[]> {
    return this.http.get<LeaveBalanceResponse[]>(`${this.API_URL}/balance`);
  }

  getMyLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.API_URL}/my`);
  }

  getPendingLeaves(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(`${this.API_URL}/pending`);
  }

  initializeBalance(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/initialize-balance`, {});
  }
}
