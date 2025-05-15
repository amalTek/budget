import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/authService.service';

@Component({
  selector: 'app-sidenavbar',
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.css'
})
export class SidenavbarComponent {
  constructor(
    private router: Router, private authService:AuthService
  ) {}

  ngOnInit(){
    const toggleSidebar = () => document.body.classList.toggle("open");
    
  }

  logout(){
    this.authService.logout();
    // this.router.navigate(['/login']);
  }
}
