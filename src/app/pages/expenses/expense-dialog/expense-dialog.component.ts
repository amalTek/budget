import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../../services/expense.service';
@Component({
  selector: 'app-expense-dialog',
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
  templateUrl: './expense-dialog.component.html',
  styleUrl: './expense-dialog.component.css'
})

export class ExpenseDialogComponent {
  public formData:any = {};
  constructor(
    private expenseService: ExpenseService,private dialogRef: MatDialogRef<ExpenseDialogComponent>
  ) {}
  onSubmit(form: NgForm): void {

      this.formData = form.value;
  
      this.expenseService.createExpenseData(this.formData).subscribe({
        next: (response) => {
          console.log('Expense created:', response);
          form.resetForm();
          this.dialogRef.close(response); // ✅ Close the dialog and optionally pass data
        },
        error: (err) => {
          console.error('Failed to create expense:', err);
        }
      });
   
  }

    calculerExpense() {
    const value = this.groupTransactionsByMonth();
    this.expenseService.saveExpense(value).subscribe((response) => { })
  }
  groupTransactionsByMonth() {
    const dataTobeSaved = [this.formData]
    return Object.entries(
      dataTobeSaved?.filter(t => t.status === 'approved')
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
  
  
}
