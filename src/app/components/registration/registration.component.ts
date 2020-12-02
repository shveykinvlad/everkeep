import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RegistrationRequest } from '../../models/registration-request';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  isCompleted: boolean;
  form: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.isCompleted = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      matchingPassword: new FormControl(),
    });
  }

  register(): void {
    const requestPayload: RegistrationRequest = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      matchingPassword: this.form.get('matchingPassword').value
    };
    this.userService.register(requestPayload)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }

  resendToken(): void {
    const email: string = this.form.get('email').value;
    this.userService.resendToken(email)
      .subscribe();
  }
}
