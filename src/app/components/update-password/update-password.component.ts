import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegistrationRequest } from 'src/app/models/registration-request';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {

  isCompleted: boolean;
  email: string;
  token: string;

  form = this.formBuilder.group({
    password: ['', [Validators.required]],
    matchingPassword: ['', [Validators.required]]
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.isCompleted = false;
  }

  updatePassword(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const requestPayload: RegistrationRequest = {
      email: this.route.snapshot.queryParamMap.get('email'),
      password: this.form.value.password,
      matchingPassword: this.form.value.matchingPassword
    };
    this.userService.updatePassword(requestPayload, token)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }
}
