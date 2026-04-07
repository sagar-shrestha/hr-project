import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/users';

  getUsers() {
    return this.http.get<User[]>(this.API_URL);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  createUser(user: any) {
    return this.http.post<User>(this.API_URL, user);
  }

  updateUser(id: number, user: any) {
    return this.http.put<User>(`${this.API_URL}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
