import { Component } from '@angular/core';

@Component({
  selector: 'app-expenses',
  imports: [],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  columns: any[] = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Role', field: 'role' }
  ];

  data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    // Add more data as needed
  ];

  editRow(row: any) {
    // Implement edit logic
    console.log('Editing row:', row);
    // You can open a modal or navigate to edit page
  }

  deleteRow(row: any) {
    // Implement delete logic
    if (confirm('Are you sure you want to delete this record?')) {
      this.data = this.data.filter(item => item.id !== row.id);
    }
  }

}
