import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { SessionRequest } from '../../models/session-request';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  login(): void {
    const requestPayload: SessionRequest = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.sessionService.create(requestPayload)
      .subscribe(() => this.router.navigateByUrl(''));
  }
}
