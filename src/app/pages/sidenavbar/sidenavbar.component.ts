import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenavbar',
  imports: [RouterLink, RouterLinkActive],
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


}
