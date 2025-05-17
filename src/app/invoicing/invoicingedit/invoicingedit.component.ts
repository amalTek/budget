import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-invoicingedit',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,MatIconModule
  ],
  templateUrl: './invoicingedit.component.html',
  styleUrls: ['./invoicingedit.component.css']
})
export class InvoicingeditComponent implements OnInit {
  invoice: any = {
    corporate: '',
    address: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceDate: new Date(),
    dueDate: new Date(),
    paymentTerms: '',
    currency: 'USD',
    items: [{
      designation: '',
      quantity: 1,
      price: 0,
      amount: 0
    }],
    vatRate: 0,
    vatAmount: 0,
    totalAmount: 0,
    status: 'draft'
  };

  constructor(
    private invoiceService: InvoiceService,
    private dialogRef: MatDialogRef<InvoicingeditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.invoice = { ...this.data };
      // Ensure items array exists
      if (!this.invoice.items || this.invoice.items.length === 0) {
        this.invoice.items = [{
          designation: '',
          quantity: 1,
          price: 0,
          amount: 0
        }];
      }
    }
  }

  calculateAmounts() {
    // Calculate item amounts
    this.invoice.items.forEach((item: any) => {
      item.amount = item.quantity * item.price;
    });

    // Calculate subtotal
    const subtotal = this.invoice.items.reduce((sum: number, item: any) => sum + item.amount, 0);
    
    // Calculate VAT and total
    this.invoice.vatAmount = subtotal * (this.invoice.vatRate / 100);
    this.invoice.totalAmount = subtotal + this.invoice.vatAmount;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.calculateAmounts();
      
      const formData = { 
        ...this.invoice,
        id: this.data?.id 
      };

      this.invoiceService.updateInvoiceData(formData).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.invoiceService.loadInvoiceData();
        },
        error: (err) => {
          console.error('Failed to update invoice:', err);
        }
      });
    }
  }

  addItem() {
    this.invoice.items.push({
      designation: '',
      quantity: 1,
      price: 0,
      amount: 0
    });
  }

  removeItem(index: number) {
    this.invoice.items.splice(index, 1);
    this.calculateAmounts();
  }
}
