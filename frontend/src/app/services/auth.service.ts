import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface AuthUser {
  id: number;
  username: string;
}

interface AuthResponse {
  user: AuthUser | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${API_BASE_URL}/auth/`;
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser() {
    return this.currentUserSubject.value;
  }

  loadCurrentUser() {
    return this.http.get<AuthResponse>(`${this.baseUrl}me/`, { withCredentials: true }).pipe(
      tap((response) => this.currentUserSubject.next(response.user))
    );
  }

  signup(data: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.baseUrl}signup/`, data, { withCredentials: true }).pipe(
      tap((response) => this.currentUserSubject.next(response.user))
    );
  }

  login(data: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.baseUrl}login/`, data, { withCredentials: true }).pipe(
      tap((response) => this.currentUserSubject.next(response.user))
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}logout/`, {}, { withCredentials: true }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }
}
