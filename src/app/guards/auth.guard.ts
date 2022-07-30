import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const isAuthenticated = this.sessionService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigateByUrl('/users/login');
      return false;
    }
  }
}
