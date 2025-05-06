import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AUTH_ENDPOINTS, STORAGE_KEYS } from '../config/constants';
import { parseJwt } from '../utils/jwt.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(AUTH_ENDPOINTS.login, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(STORAGE_KEYS.authToken, response.token);
        })
      );
  }

  register(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(AUTH_ENDPOINTS.register, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(STORAGE_KEYS.authToken, response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.authToken);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.authToken);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.role || null;
  }

}
