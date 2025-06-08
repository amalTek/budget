import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/authService.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenavbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.css',
})
export class SidenavbarComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkAdminRole();
    const toggleSidebar = () => document.body.classList.toggle('open');
  }

  private checkAdminRole() {
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.snackBar.open('Successfully logged out', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.snackBar.open('Error during logout', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }
}
