// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/expenses';
  loadExpenseData(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8080/api/expenses/loadExpenseData') // Adjust the URL as per your backend endpoint
  }
  deleteExpenseData(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
  createExpenseData(expense: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/expenses/createExpense', expense);
  }
}
