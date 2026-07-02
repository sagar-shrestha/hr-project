import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PermissionResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/permissions';

  getPermissions(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(this.API_URL);
  }

  createPermission(permission: { name: string }): Observable<PermissionResponse> {
    return this.http.post<PermissionResponse>(this.API_URL, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
