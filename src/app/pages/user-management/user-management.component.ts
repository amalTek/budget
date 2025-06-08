import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSelectModule],
  template: `
    <div class="user-management-container" *ngIf="isAdmin">
      <h2>User Management</h2>
      <table mat-table [dataSource]="users" class="mat-elevation-z8">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let user">
            {{ user.name }} {{ user.lastName }}
          </td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let user">{{ user.email }}</td>
        </ng-container>

        <!-- Role Column -->
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let user">{{ user.role }}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let user">
            <mat-select
              [value]="user.accountStatus"
              (selectionChange)="updateUserStatus(user.id, $event.value)"
            >
              <mat-option value="PENDING">Pending</mat-option>
              <mat-option value="ACCEPTED">Accepted</mat-option>
              <mat-option value="REFUSED">Refused</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let user">
            <button mat-button color="warn" (click)="deleteUser(user.id)">
              Delete
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
    <div *ngIf="!isAdmin" class="access-denied">
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
  `,
  styles: [
    `
      .user-management-container {
        padding: 20px;
      }
      table {
        width: 100%;
      }
      .mat-column-actions {
        width: 120px;
        text-align: center;
      }
      .mat-column-status {
        width: 150px;
      }
      .access-denied {
        text-align: center;
        padding: 20px;
        color: red;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkAdminRole();
    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  private checkAdminRole() {
    const token = this.authService.getDecodedToken();
    this.isAdmin = token?.role === 'ADMIN';
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  updateUserStatus(userId: number, newStatus: string) {
    this.userService.updateUserStatus(userId, newStatus).subscribe({
      next: (response) => {
        this.snackBar.open('User status updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.loadUsers(); // Reload the users list
      },
      error: (error) => {
        this.snackBar.open('Error updating user status', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadUsers(); // Reload the users list
        },
        error: (error) => {
          this.snackBar.open('Error deleting user', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
