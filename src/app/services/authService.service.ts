// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, throwError, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from './jwtService.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.jwtService.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }

  login(email: string, password: string) {
    return this.http
      .post(
        'http://localhost:8080/api/loginUser',
        { email, password },
        { responseType: 'text' }
      )
      .pipe(
        tap((token: string) => {
          if (token) {
            this.jwtService.saveToken(token);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    const token = this.jwtService.getToken();
    if (!token) {
      return new Observable((subscriber) => {
        this.clearLocalData();
        subscriber.next({ message: 'Already logged out' });
        subscriber.complete();
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post('http://localhost:8080/api/logout', {}, { headers })
      .pipe(
        tap(() => {
          this.clearLocalData();
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          this.clearLocalData();
          return throwError(() => error);
        })
      );
  }

  private clearLocalData(): void {
    this.jwtService.destroyToken();
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
    window.location.reload();
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!this.jwtService.getToken();
    this.isAuthenticatedSubject.next(isLoggedIn);
    return isLoggedIn;
  }

  getDecodedToken(): any {
    const token = this.jwtService.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  hasRole(role: string): boolean {
    const token = this.getDecodedToken();
    return token?.role === role;
  }
}
