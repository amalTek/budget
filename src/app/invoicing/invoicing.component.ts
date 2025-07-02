import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceService } from '../services/invoice.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { InvoicingeditComponent } from './invoicingedit/invoicingedit.component';
import { InvoicingDialogComponent } from './invoicing-dialog/invoicing-dialog.component';
import { AuthService } from '../services/authService.service';

@Component({
  selector: 'app-invoicing',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    InvoicingeditComponent,
    InvoicingDialogComponent,
  ],
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.css'],
})
export class InvoicingComponent {
  isController = false;
  constructor(
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private authService: AuthService
  ) {}

  displayedColumns: string[] = [
    'corporate',
    'address',
    'clientName',
    'clientEmail',
    'clientAddress',
    'invoiceDate',
    'dueDate',
    'paymentTerms',
    'currency',
    'designation',
    'quantity',
    'price',
    'amount',
    'vatRate',
    'vatAmount',
    'totalAmount',
    'status',
    'actions',
  ];

  dataSource: any[] = [];

  ngOnInit() {
    this.isController = this.authService.hasRole('CONTROLLER');
    if (this.isController) {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== 'actions'
      );
    }
    this.loadData();
  }

  loadData() {
    this.invoiceService.loadInvoiceData().subscribe(
      (response) => {
        this.dataSource = response;
        console.log('Data loaded:', this.dataSource);
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  getTotalAmount(): number {
    return (
      this.dataSource?.reduce(
        (acc, item) => acc + (item.totalAmount || 0),
        0
      ) || 0
    );
  }

  getDefaultCurrency(): string {
    return this.dataSource[0]?.currency || 'USD';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvoicingDialogComponent, {
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  openEditExpense(element: any): void {
    const dialogRef = this.dialog.open(InvoicingeditComponent, {
      width: '1100px',
      data: element, // Pass the selected row
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData(); // Reload data after editing
      }
    });
  }

  // Remove the deleted item from the dataSource (UI update)
  deleteItem(element: any) {
    this.invoiceService.deleteInvoiceData(element.id).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(
          (item: any) => item.id !== element.id
        );
        console.log('Item deleted:', element);
      },
      error: (error) => {
        console.error('Delete failed:', error);
      },
    });
  }

  exportCsv() {
    if (this.dataSource.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = this.displayedColumns.filter((col) => col !== 'actions');
    const rows = this.dataSource.map((item) =>
      headers.map((header) => {
        if (header === 'invoiceDate' || header === 'dueDate') {
          return new Date(item[header]).toLocaleDateString();
        }
        return item[header];
      })
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
