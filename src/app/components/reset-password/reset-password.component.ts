import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl()
    });
  }

  resetPassword(): void {
    const email: string = this.form.get('email').value;
    this.userService.resetPassword(email)
      .subscribe();
  }
}
