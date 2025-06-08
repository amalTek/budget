import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authService.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public isLogingMode: boolean = true;
  public formulaireForm!: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.formulaireForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required], // Default role
    });
  }

  onLogin() {
    const { email, password } = this.formulaireForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        console.log('Login successful, token received');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err, 'login');
      },
    });
  }

  private showLoginError(message: string): void {
    this.snackBar.open(`⚠️ ${message}`, 'Close', {
      duration: 4000,
      panelClass: ['warn-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  redirectToSignUpPage() {
    this.isLogingMode = !this.isLogingMode;
    this.formulaireForm.reset();
    // Reset form with default values
    this.formulaireForm.patchValue({
      role: 'USER',
    });
  }

  onRegister() {
    if (this.formulaireForm.valid) {
      const val = this.formulaireForm.value;
      this.userService.saveUser(val).subscribe({
        next: (response) => {
          this.formulaireForm.reset();
          this.isLogingMode = true;
          this.snackBar.open(
            '✅ Registration successful! Please wait for admin approval.',
            'Close',
            {
              duration: 4000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error, 'register');
        },
      });
    } else {
      this.snackBar.open(
        '⚠️ Please fill all required fields correctly.',
        'Close',
        {
          duration: 4000,
          panelClass: ['warn-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
    }
  }

  private showRegisterError(message: string): void {
    this.snackBar.open(`⚠️ ${message}`, 'Close', {
      duration: 4000,
      panelClass: ['warn-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  private handleError(
    err: HttpErrorResponse,
    context: 'login' | 'register'
  ): void {
    let errorMessage = `An unexpected error occurred during ${context}.`;
    console.error(err);

    if (err.error instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorObj = JSON.parse(reader.result as string);
          errorMessage = errorObj.message || errorObj.error || errorMessage;
        } catch (e) {
          errorMessage = (reader.result as string) || errorMessage; // Fallback to raw text if not JSON
        }
        if (context === 'login') {
          this.showLoginError(errorMessage);
        } else {
          this.showRegisterError(errorMessage);
        }
      };
      reader.readAsText(err.error);
    } else if (typeof err.error === 'string') {
      try {
        const errorObj = JSON.parse(err.error);
        errorMessage = errorObj.message || errorObj.error || errorMessage;
      } catch (e) {
        errorMessage = err.error; // Not a JSON string, use as is
      }
      if (context === 'login') {
        this.showLoginError(errorMessage);
      } else {
        this.showRegisterError(errorMessage);
      }
    } else if (err.error && typeof err.error === 'object') {
      errorMessage = err.error.message || err.error.error || errorMessage;
      if (context === 'login') {
        this.showLoginError(errorMessage);
      } else {
        this.showRegisterError(errorMessage);
      }
    } else if (err.message) {
      errorMessage = err.message;
      if (context === 'login') {
        this.showLoginError(errorMessage);
      } else {
        this.showRegisterError(errorMessage);
      }
    }
    // If it's a Blob, the FileReader onload will call showLoginError/showRegisterError
    // Otherwise, it's already called in the else if blocks above
  }
}
