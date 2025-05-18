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
  constructor(
    private expenseService: ExpenseService,private dialogRef: MatDialogRef<ExpenseDialogComponent>
  ) {}
  onSubmit(form: NgForm): void {

      const formData = form.value;
  
      this.expenseService.createExpenseData(formData).subscribe({
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
  
  
}
