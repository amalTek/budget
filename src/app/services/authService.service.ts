// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from './jwtService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

// auth.service.ts
login(email: string, password: string) {
    return this.http.post(
      'http://localhost:8080/api/loginUser', 
      { email, password },
      { responseType: 'text' }  // Important: Expect text response
    ).pipe(
      tap((token: string) => {
        if (token) {
          this.jwtService.saveToken(token);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.jwtService.getToken();
  }

// auth.service.ts
logout(): void {
    // Clear token and any user data
    this.jwtService.destroyToken();
    
    // Clear any cached user information
    localStorage.clear(); // Or sessionStorage.clear() if you use that
    
    // Navigate to login page with preventRedirect flag
    this.router.navigate(['/login'], {
      // queryParams: { preventRedirect: 'true' }
    });
    
    // Force full page reload to clear all application state
    window.location.reload();
  }
}