import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router) { }

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
