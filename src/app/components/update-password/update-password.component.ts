import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { RegistrationRequest } from 'src/app/models/registration-request';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  form: FormGroup;
  email: string;
  token: string;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(),
      matchingPassword: new FormControl(),
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
      .subscribe();
  }
}
