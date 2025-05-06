import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
    private router: Router,private builder: FormBuilder
  ) {this.formulaireForm = this.builder.group({})}
  public formulaireForm: FormGroup;
  public fieldArray :any[]=[];


  onLogin() {
    // Your login logic here
    let test = {
      firstName: 'manel',
      lastName: 'abbes',
      password:'rfhrklfgn',
      email:'fdsfddf'
      // compte_bancaire:'jhbfj'
    };
    this.router.navigate(['/dashboard']);

    this.userService.registerUser(
test
    ).subscribe({
      next: (response) => {
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }
  redirectToSignUpPage(){
    this.isLogingMode = !this.isLogingMode

  }

  onRegister() {
    const val = this.formulaireForm.value;
    this.fieldArray.push(val);
    this.userService.saveUser(val)
      .subscribe(
        response => {
          console.log(response);
          this.formulaireForm.reset();

        },
        error => {
          console.error(error);
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