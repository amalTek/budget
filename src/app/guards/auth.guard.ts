import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/authService.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier si la route nécessite le rôle ADMIN
    if (route.data['requiresAdmin']) {
      if (!this.authService.hasRole('ADMIN')) {
        // Rediriger vers le dashboard si l'utilisateur n'est pas admin
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }
}
