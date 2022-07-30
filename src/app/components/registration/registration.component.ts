import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../models/registration-request';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  isCompleted: boolean;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    matchingPassword: ['', [Validators.required]]
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.isCompleted = false;
  }

  register(): void {
    const requestPayload: RegistrationRequest = {
      email: this.form.value.email,
      password: this.form.value.password,
      matchingPassword: this.form.value.matchingPassword
    };
    this.userService.register(requestPayload)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }

  resendConfirmation(): void {
    const email: string = this.form.value.email;
    this.userService.resendConfirmation(email)
      .subscribe();
  }
}
