import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/users';

  private unwrap<T>(field: string = 'data') {
    return map((response: any) => response[field] as T);
  }

  getUsers() {
    return this.http.get<any>(this.API_URL).pipe(this.unwrap<User[]>());
  }

  getUser(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(this.unwrap<User>());
  }

  createUser(user: any) {
    return this.http.post<any>(this.API_URL, user).pipe(this.unwrap<User>());
  }

  updateUser(id: number, user: any) {
    return this.http.put<any>(`${this.API_URL}/${id}`, user).pipe(this.unwrap<User>());
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.API_URL}/${id}`).pipe(this.unwrap<void>());
  }

  updateRoles(id: number, roles: string[]) {
    return this.http.put<any>(`${this.API_URL}/${id}/roles`, roles).pipe(this.unwrap<User>());
  }
}
