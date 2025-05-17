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
    MatButtonModule,MatIconModule
  ],
  templateUrl: './expense-edit.component.ts.component.html',
  styleUrl: './expense-edit.component.ts.component.css'
})
export class ExpenseEditComponentTsComponent {
  constructor(
    private expenseService: ExpenseService,
    private dialogRef: MatDialogRef<ExpenseEditComponentTsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.expense = { ...this.data }; // initialize form model
    }
    console.log("this.expense",this.expense)
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
      const formData = { ...form.value, id: this.data?.id }; // include ID for update
      console.log("formData",formData)

      // Call update instead of create
      this.expenseService.updateExpenseData(formData).subscribe({
        next: (response) => {
          form.resetForm();
          this.dialogRef.close(response);
        },
        error: (err) => {
          console.error('Failed to update expense:', err);
        }
      });
    }
  }
  
  
}

