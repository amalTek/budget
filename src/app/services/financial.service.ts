// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private httpClient: HttpClient) { }

  loadDashboardData(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8080/api/financialSummary/loadFinancialSummary') // Adjust the URL as per your backend endpoint
  }
 
}
