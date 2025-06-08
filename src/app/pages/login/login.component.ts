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
      error: (err) => {
        let errorMessage = 'Error occurred while logging in.';
        if (
          err.error?.error === 'Invalid credentials or account not accepted'
        ) {
          errorMessage =
            'Your account is pending approval or has been refused.';
        }
        this.snackBar.open(`⚠️ ${errorMessage}`, 'Close', {
          duration: 4000,
          panelClass: ['warn-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
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
        error: (error) => {
          console.error(error);
          this.snackBar.open('⚠️ Error occurred while saving user.', 'Close', {
            duration: 4000,
            panelClass: ['warn-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
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
}
