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

  ngOnInit() {
    this.isController = this.authService.hasRole('CONTROLLER');
    console.log('isController (in ngOnInit):', this.isController);
    if (this.isController) {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== 'actions'
      );
    }
    console.log('displayedColumns (after filter):', this.displayedColumns);
    this.loadData();
  }
  get currentCurrency(): string {
    return 'TND'; // Or make this dynamic if you have currency selection
  }
  formatCurrency(value: number): string {
    if (!value && value !== 0) return `0.000 ${this.currentCurrency}`;
    return value.toFixed(3) + ' ' + this.currentCurrency;
  }
 
 
 
 
// afficher les données des expenses 
  loadData() {
   this.expenseService.loadExpenseData().subscribe((response) => {
      this.dataSource = response;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Update statuses if the date is before the curreb=nt date
      this.dataSource = this.dataSource?.map((item) => {
        const itemDate = new Date(item.date);
        if (itemDate < today) {
          return { ...item, status: 'approved' };
        }
        return item;
      });
      

    });
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
  
  
  




// ouvrir popup ajouter 
  openDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();

      }
    });
  }

  // ouvrir popup modifier  

  openEditExpense(element: any): void {
    const dialogRef = this.dialog.open(ExpenseEditComponentTsComponent, {
      width: '400px',
      data: element, // Pass the selected row
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
   
      }
    });
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
}
