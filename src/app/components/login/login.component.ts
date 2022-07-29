import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionRequest } from '../../models/session-request';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl(),
      password: new UntypedFormControl(),
      matchingPassword: new UntypedFormControl(),
    });
  }

  login(): void {
    const requestPayload: SessionRequest = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    };

    this.sessionService.create(requestPayload)
      .subscribe(() => this.router.navigateByUrl(''));
  }
}
