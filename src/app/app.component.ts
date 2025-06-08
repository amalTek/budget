import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavbarComponent } from './pages/sidenavbar/sidenavbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavbarComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-budget-app';
}
