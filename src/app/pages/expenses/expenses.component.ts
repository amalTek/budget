import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';
import { ExpenseEditComponentTsComponent } from './expense-edit.component.ts/expense-edit.component.ts.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-expenses',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ExpenseDialogComponent,
    MatDialogModule,CurrencyPipe
  ] , templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) { }
  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'status', 'actions'];

  dataSource:any[] = [

  ];

  ngOnInit() {
    this.loadData();
  }
  get currentCurrency(): string {
  return 'TND'; // Or make this dynamic if you have currency selection
}
  formatCurrency(value: number): string {
  if (!value && value !== 0) return `0.000 ${this.currentCurrency}`;
  return value.toFixed(3) + ' ' + this.currentCurrency;

}
  loadData() {
    this.expenseService.loadExpenseData().subscribe(
      response => {
        this.dataSource = response

      });

  }

getTotalAmount(): string {
  const valueTotal = this.dataSource
    ?.filter(item => item.status === 'approved')
    ?.map(item => item.amount)
    ?.reduce((acc, value) => acc + (value || 0), 0) || 0;

  return this.formatCurrency(valueTotal);
}
getCurrentMonthExpenses(): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return this.dataSource
    ?.filter(item => {
      const itemDate = new Date(item.date); // assuming you have a date field
      return item.status === 'approved' && 
             itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear;
    })
    ?.map(item => item.amount)
    ?.reduce((acc, value) => acc + (value || 0), 0) || 0;
}

updateExpensesOnly(): void {
    const totalExpenses = this.calculateCurrentMonthExpenses();
    let currentMonthSummary: any = {
  totalInvoicing: 0,
  totalExpenses: 0,
  currentBalance: 0,
  createdAt: new Date()
};
    this.expenseService.updateCurrentMonthExpenses(totalExpenses)
      .subscribe({
        next: (updatedSummary) => {
          currentMonthSummary = updatedSummary;
          // Show success notification
        },
        error: (err) => {
       
          console.error(err);
        }
      });
  }

  private calculateCurrentMonthExpenses(): number {
    // Your expense calculation logic here
    // Example:
    return this.dataSource
      ?.filter(item => item.status === 'approved' && this.isCurrentMonth(item.date))
      ?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  }

  private isCurrentMonth(date: Date | string): boolean {
    const now = new Date();
    const itemDate = new Date(date);
    return itemDate.getMonth() === now.getMonth() && 
           itemDate.getFullYear() === now.getFullYear();
  }

  editItem(element: any) {
    console.log('Edit:', element);
    // You can add logic here to open a dialog or inline form for editing
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData()

      }
    });
  }

  openEditExpense(element: any): void {
    const dialogRef = this.dialog.open(ExpenseEditComponentTsComponent, {
      width: '400px',
      data: element // Pass the selected row
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.updateExpensesOnly() // Reload data after editing
      }
    });
  }
  
  /// Delete Expense 
  deleteItem(element: any) {
    // Send the delete request using the correct ID
    this.expenseService.deleteExpenseData(element.id).subscribe({
      next: () => {
        // Remove the deleted item from the dataSource (UI update)
        this.dataSource = this.dataSource.filter((item: any) => item.id !== element.id);
        console.log('Item deleted:', element);
      },
      error: (error) => {
        console.error('Delete failed:', error);
      }
    });
  }
  exportCsv() {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Status'];
    const rows = this.dataSource.map((item: any) => [
      item.date,
      item.category,
      item.description,
      item.amount,
      item.status
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    // Create a Blob and create an anchor tag to download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    link.click();
    URL.revokeObjectURL(url);
  }

}