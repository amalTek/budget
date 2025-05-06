// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/login', user); // Adjust the URL as per your backend endpoint
  }
  saveUser(user: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/add/user', user); // Adjust the URL as per your backend endpoint
  }


}
