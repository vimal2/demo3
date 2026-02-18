import { Injectable } from '@angular/core';
import {
  CanMatch,
  Route,
  UrlSegment,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not authenticated
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: '/admin' }
      });
    }

    if (!this.authService.isAdmin()) {
      // Redirect to dashboard if not admin
      alert('Access Denied: Admin privileges required');
      return this.router.createUrlTree(['/dashboard']);
    }

    return true;
  }
}
