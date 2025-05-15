import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Add required imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isLogingMode :boolean =true;
  constructor(
    private userService: UserService,
    private router: Router,private builder: FormBuilder,private snackBar: MatSnackBar, private authService: AuthService,
  ) {this.formulaireForm = this.builder.group({})}
  public formulaireForm: FormGroup;
  public fieldArray :any[]=[];
  ngOnInit(){
    this.formulaireForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onLogin() {
   

    const { email, password } = this.formulaireForm.value;
  
  
    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        console.log('Login successful, token received');
        this.router.navigate(['/dashboard'])
          .then(() => console.log('Navigation successful'))
          .catch(err => console.error('Navigation error:', err));
      },
      error: (err) => {
            this.snackBar.open('⚠️ Error occurred while saving user.', 'Close', {
              duration: 4000,
              panelClass: ['warn-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
   
    
  }})
}


  redirectToSignUpPage(){
    this.isLogingMode = !this.isLogingMode
    this.formulaireForm.reset();

  }

  onRegister() {
    const val = this.formulaireForm.value;
    this.fieldArray.push(val);
    this.userService.saveUser(val)
      .subscribe(
        response => {
          this.formulaireForm.reset();
          this.isLogingMode = true;

        },
        error => {
          console.error(error);
          this.snackBar.open('⚠️ Error occurred while saving user.', 'Close', {
            duration: 4000,
            panelClass: ['warn-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        }
      );
    console.log(this.fieldArray);
  }
  
  delete() {
    this.formulaireForm.value;
    console.log(this.fieldArray)
    console.log( this.formulaireForm)

    if(this.formulaireForm.value) {
     this.fieldArray= [];
      this.formulaireForm.reset();
   
  }
    



  }
}