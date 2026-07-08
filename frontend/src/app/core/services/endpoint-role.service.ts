import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface EndpointRoleResponse {
  id: number;
  urlPattern: string;
  httpMethod: string;
  roleName: string;
}

export interface CreateEndpointRoleRequest {
  urlPattern: string;
  httpMethod: string;
  roleName: string;
}

export interface UpdateEndpointRoleRequest {
  urlPattern: string;
  httpMethod: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class EndpointRoleService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/endpoint-roles';

  getAll(): Observable<EndpointRoleResponse[]> {
    return this.http.get<any>(this.API_URL).pipe(map(r => r.data));
  }

  getById(id: number): Observable<EndpointRoleResponse> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(map(r => r.data));
  }

  create(request: CreateEndpointRoleRequest): Observable<EndpointRoleResponse> {
    return this.http.post<any>(this.API_URL, request).pipe(map(r => r.data));
  }

  update(id: number, request: UpdateEndpointRoleRequest): Observable<EndpointRoleResponse> {
    return this.http.put<any>(`${this.API_URL}/${id}`, request).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.API_URL}/${id}`).pipe(map(() => undefined));
  }
}
