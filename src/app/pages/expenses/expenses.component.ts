import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-expenses',
  imports: [MatTableModule, MatButtonModule, MatIconModule,MatDialogModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog
  ) {}
  displayedColumns: string[] = ['date', 'category', 'description','amount','status','actions'];

  dataSource = [
   
  ];

ngOnInit(){
  this.expenseService.loadExpenseData() .subscribe(
    response => {
      this.dataSource =response
  
    });
   
}

  editItem(element: any) {
    console.log('Edit:', element);
    // You can add logic here to open a dialog or inline form for editing
  }

  // openAddExpenseDialog(): void {
  //   const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
  //     width: '400px'
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // You can call your API to save `result`
  //       console.log('New Expense:', result);
  //       // e.g., this.expenseService.addExpense(result).subscribe(...)
  //     }
  //   });
  // }
  deleteItem(element: any) {
    // console.log('Delete:', element);
    // this.dataSource = this.dataSource.filter(item => item.id !== element.id);
  }
}