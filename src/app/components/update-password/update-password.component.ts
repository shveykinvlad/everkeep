import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { RegistrationRequest } from 'src/app/models/registration-request';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  isCompleted: boolean;
  form: UntypedFormGroup;
  email: string;
  token: string;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.isCompleted = false;
  }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      password: new UntypedFormControl(),
      matchingPassword: new UntypedFormControl(),
    });
  }

  updatePassword(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const requestPayload: RegistrationRequest = {
      email: this.route.snapshot.queryParamMap.get('email'),
      password: this.form.get('password').value,
      matchingPassword: this.form.get('matchingPassword').value
    };
    this.userService.updatePassword(requestPayload, token)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }
}
