import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string;
  isAuthenticated: boolean;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.authenticated.subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
    this.userService.userEmail.subscribe((userEmail: string) => this.userEmail = userEmail);
    this.isAuthenticated = this.userService.isAuthenticated();
    this.userEmail = this.userService.getUserEmail();
  }

  logout(): void {
    this.userService.deleteSession();
    this.router.navigateByUrl('/users/login');
  }
}
