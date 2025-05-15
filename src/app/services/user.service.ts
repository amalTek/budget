// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/loginUser', user); // Adjust the URL as per your backend endpoint
  }
  saveUser(user: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/addUser', user); // Adjust the URL as per your backend endpoint
  }
  getProtectedData(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.httpClient.get<any>(`http://localhost:8080/protected-endpoint`, { headers });
  }

}
