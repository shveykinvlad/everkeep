import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../models/auth-request';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      matchingPassword: new FormControl(),
    });
  }

  login(): void {
    const requestPayload: AuthRequest = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    };

    this.userService.authenticate(requestPayload)
      .subscribe(() => this.router.navigateByUrl(''));
  }
}
