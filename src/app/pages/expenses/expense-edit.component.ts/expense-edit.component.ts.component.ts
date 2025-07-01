import { Component, Inject } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expense-edit.component.ts',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './expense-edit.component.ts.component.html',
  styleUrl: './expense-edit.component.ts.component.css'
})
export class ExpenseEditComponentTsComponent {
  public formData: any = {};
  constructor(
    private expenseService: ExpenseService,
    private dialogRef: MatDialogRef<ExpenseEditComponentTsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data) {
      this.expense = { ...this.data }; // initialize form model
    }
  }

  expense = {
    date: '',
    description: '',
    category: '',
    amount: 0,
    status: ''
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.formData = { ...form.value, id: this.data?.id }; // include ID for update


      // Call update instead of create
      this.expenseService.updateExpenseData(this.formData).subscribe({
        next: (response) => {
          this.calculerExpense();
          form.resetForm();
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Failed to update expense:', err);
        }
      });
    }
  }
  calculerExpense() {
    const value = this.groupTransactionsByMonth();
    this.expenseService.saveExpense(value).subscribe((response) => { console.log("mmannn", response) })
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

