import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceSummaryResponse {
  department: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/reports';

  getAttendanceSummary(startDate: string, endDate: string): Observable<AttendanceSummaryResponse[]> {
    return this.http.get<AttendanceSummaryResponse[]>(`${this.API_URL}/attendance-summary?startDate=${startDate}&endDate=${endDate}`);
  }
}
