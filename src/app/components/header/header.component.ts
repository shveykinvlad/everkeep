import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string;
  isAuthenticated: boolean;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessionService.authenticated.subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
    this.sessionService.userEmail.subscribe((userEmail: string) => this.userEmail = userEmail);
    this.isAuthenticated = this.sessionService.isAuthenticated();
    this.userEmail = this.sessionService.getUserEmail();
  }

  logout(): void {
    this.sessionService.delete();
    this.router.navigateByUrl('/users/login');
  }
}
