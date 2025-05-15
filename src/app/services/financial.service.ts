// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private httpClient: HttpClient) { }

  loadDashboardData(year?: number, month?: number): Observable<any[]> {
    let params = new HttpParams();
    
    if (year !== undefined && month !== undefined) {
      params = params.append('year', year.toString());
      params = params.append('month', (month + 1).toString()); // +1 because Java months are 1-based
    }

    return this.httpClient.get<any[]>('http://localhost:8080/api/financialSummary/loadFinancialSummary', { params });
  }}