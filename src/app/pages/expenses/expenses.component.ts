import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';

@Component({
  standalone: true,
  selector: 'app-expenses',
  imports: [MatTableModule, MatButtonModule, MatIconModule, ExpenseDialogComponent, MatDialogModule,],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) { }
  displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'status', 'actions'];

  dataSource = [

  ];

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.expenseService.loadExpenseData().subscribe(
      response => {
        this.dataSource = response

      });

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