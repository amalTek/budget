import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';
import { ExpenseEditComponentTsComponent } from './expense-edit.component.ts/expense-edit.component.ts.component';
import { AuthService } from '../../services/authService.service';
import { CommonModule } from '@angular/common';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-expenses',
  imports: [
    CommonModule, 
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ExpenseDialogComponent,
    MatDialogModule,
  ],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent {
  isController = false;
  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}
  displayedColumns: string[] = [
    'date',
    'category',
    'description',
    'amount',
    'status',
    'actions',
  ];

  dataSource: any[] = [];
  dataSourceTotal: any[] = [];


  ngOnInit() {
    this.isController = this.authService.hasRole('CONTROLLER');
    console.log('isController (in ngOnInit):', this.isController);
    if (this.isController) {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== 'actions'
      );
    }
    console.log('displayedColumns (after filter):', this.displayedColumns);
  this.loadData().subscribe({
    error: (err) => console.error('Initial load failed:', err)
  });
  }
  get currentCurrency(): string {
    return 'TND'; // Or make this dynamic if you have currency selection
  }
  formatCurrency(value: number): string {
    if (!value && value !== 0) return `0.000 ${this.currentCurrency}`;
    return value.toFixed(3) + ' ' + this.currentCurrency;
  }
 
 
 
 
// afficher les données des expenses 
loadData(): Observable<any[]> {
  return this.expenseService.loadExpenseData().pipe(
    tap((response: any[]) => {
      this.dataSourceTotal = response;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.dataSource = response.map(item => {
        const itemDate = new Date(item.date);
        return { 
          ...item, 
          status: itemDate < today ? 'approved' : item.status 
        };
      });
    })
  );
}


  // calculer las somme de status approved 
  getTotalAmount(): string {
    const valueTotal =
      this.dataSource
        ?.filter((item) => item.status === 'approved')
        ?.map((item) => item.amount)
        ?.reduce((acc, value) => acc + (value || 0), 0) || 0;
    return this.formatCurrency(valueTotal);
  }
  
  
  
  //// calculer la somme des expenses en cas de status approved and envoyer un objet avec meme month && year  totalexpense 
groupTransactionsByMonth() {
  return Object.entries(
    this.dataSourceTotal?.filter(t => t.status === 'approved')
      .reduce((acc, t) => {
        const monthKey = t.date.slice(0, 7); // "YYYY-MM"
        // Initialize if not exists, then add to the total amount
        acc[monthKey] = (acc[monthKey] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([month, totalAmount]) => ({ 
    month, 
    totalAmount 
  }));
}



// ouvrir popup ajouter 
  openDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '400px',
    });

   
  dialogRef.afterClosed().pipe(
    filter(result => !!result), // Only proceed if result exists
    switchMap(() => this.loadData()) // Refresh data
  ).subscribe({
    next: () => this.calculerExpense(),
    error: (err) => console.error('Error reloading data:', err)
  });
  }

  // ouvrir popup modifier  

 openEditExpense(element: any): void {
  const dialogRef = this.dialog.open(ExpenseEditComponentTsComponent, {
    width: '400px',
    data: element,
  });

  dialogRef.afterClosed().pipe(
    filter(result => !!result), // Only proceed if result exists
    switchMap(() => this.loadData()) // Refresh data
  ).subscribe({
    next: () => this.calculerExpense(),
    error: (err) => console.error('Error reloading data:', err)
  });
}
  /// calculer la somme des expenes 
  calculerExpense(){
     const value = this.groupTransactionsByMonth();
    this.expenseService.saveExpense(value).subscribe((response) => { })
  }

  /// Delete Expense
  deleteItem(element: any) {
    // Send the delete request using the correct ID
    this.expenseService.deleteExpenseData(element.id).subscribe({
      next: () => {
        // Remove the deleted item from the dataSource (UI update)
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

  // export csv
  exportCsv() {
    if (this.dataSource.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = this.displayedColumns.filter((col) => col !== 'actions');
    const rows = this.dataSource.map((item) =>
      headers.map((header) => {
        if (header === 'date') {
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
    link.setAttribute('download', 'expenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  updateExpensesOnly(): void {
    const totalExpenses = this.calculateCurrentMonthExpenses();
    let currentMonthSummary: any = {
      totalInvoicing: 0,
      totalExpenses: 0,
      currentBalance: 0,
      createdAt: new Date(),
    };
    this.expenseService.updateCurrentMonthExpenses(totalExpenses).subscribe({
      next: (updatedSummary) => {
        currentMonthSummary = updatedSummary;
        // Show success notification
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  private calculateCurrentMonthExpenses(): number {
    // Your expense calculation logic here
    // Example:
    return (
      this.dataSource
        ?.filter(
          (item) => item.status === 'approved' && this.isCurrentMonth(item.date)
        )
        ?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    );
  }
 private isCurrentMonth(date: Date | string): boolean {
    const now = new Date();
    const itemDate = new Date(date);
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }



  
}
