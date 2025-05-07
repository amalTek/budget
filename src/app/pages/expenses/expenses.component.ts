import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';

@Component({
  standalone: true,
  selector: 'app-expenses',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  constructor(
    private expenseService: ExpenseService,
    
  ) {}
  displayedColumns: string[] = ['date', 'category', 'description','amount','actions'];

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

  deleteItem(element: any) {
    // console.log('Delete:', element);
    // this.dataSource = this.dataSource.filter(item => item.id !== element.id);
  }
}