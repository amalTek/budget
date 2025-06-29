// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authService.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getDecodedToken()?.token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  registerUser(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/loginUser`, user);
  }

  saveUser(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/addUser`, user);
  }


  getAllUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.httpClient.put<any>(
      `${this.apiUrl}/users/${userId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  getProtectedData(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/protected-endpoint`, {
      headers: this.getHeaders(),
    });
  }
}
