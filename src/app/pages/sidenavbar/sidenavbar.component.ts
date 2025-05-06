import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenavbar',
  imports: [],
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.css'
})
export class SidenavbarComponent {
  constructor(
    private router: Router
  ) {}

  ngOnInit(){
    const toggleSidebar = () => document.body.classList.toggle("open");
    
  }

redirect(){
  this.router.navigate(['/dashboard']);

}

redirectToExpense(){
  this.router.navigate(['/expenses']);

}
}
