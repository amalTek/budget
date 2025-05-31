import { Component } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-invoicing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './invoicing-dialog.component.html',
  styleUrl: './invoicing-dialog.component.css'
})
export class InvoicingDialogComponent {
  invoice: any = {
    corporate: '',
    address: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    paymentTerms: 'NET 30',
    currency: 'TND', // Changed to TND for Tunisian Dinar
    designation: '', // Single item description
    quantity: 1,
    price: 0,
    amount: 0,
    vatRate: 0,
    vatAmount: 0,
    totalAmount: 0,
    status: 'draft'
  };

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  calculateAmount() {
    // Calculate amount for single item
    this.invoice.amount = this.invoice.quantity * this.invoice.price;
    
    // Calculate VAT and total
    this.invoice.vatAmount = this.invoice.amount * (this.invoice.vatRate / 100);
    this.invoice.totalAmount = this.invoice.amount + this.invoice.vatAmount;
  }

  onSubmit(form: NgForm) {
 
      this.calculateAmount();
      
      // Convert dates to ISO string format
      const invoiceToSend = {
        ...this.invoice,
        invoiceDate: this.formatDate(this.invoice.invoiceDate),
        dueDate: this.formatDate(this.invoice.dueDate)
      };

      this.invoiceService.createInvoiceData(invoiceToSend).subscribe({
        next: () => {
          this.snackBar.open('Invoice created!', 'Close', { duration: 3000 });
          this.router.navigate(['/invoices']);
        },
        error: (err) => {
          console.error('Error creating invoice:', err);
          this.snackBar.open('Error creating invoice', 'Close', { duration: 3000 });
        }
      });
    
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
formatCurrency(value: number): string {
  if (!value) return '0.000 TND'; // Handle null/undefined cases
  return value.toFixed(3) + ' ' + this.invoice.currency;
}
}