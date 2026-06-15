import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, AuthResponse } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/v1/auth';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/signin`, credentials).pipe(
      tap(response => {
        const user: User = {
          id: response.id,
          username: response.username,
          email: '', // Backend response might not have email in signin, or add placeholder
          roles: response.roles
        };
        this.currentUser.set(user);
        this.token.set(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  signup(userData: any) {
    return this.http.post(`${this.API_URL}/signup`, userData);
  }

  logout() {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
