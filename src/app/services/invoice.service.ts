// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/invoices';
  loadInvoiceData(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8080/api/invoices/loadInoicingDataList') // Adjust the URL as per your backend endpoint
  }
  deleteInvoiceData(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
  createInvoiceData(expense: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8080/api/invoices/createNewInvoice', expense);
  }
  
  updateInvoiceData(data: any) {
    return this.httpClient.put(`http://localhost:8080/api/invoices/${data.id}`, data);
  }
}
