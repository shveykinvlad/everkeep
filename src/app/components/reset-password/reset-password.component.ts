import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isCompleted: boolean;
  form: FormGroup;

  constructor(private userService: UserService) {
    this.isCompleted = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl()
    });
  }

  resetPassword(): void {
    const email: string = this.form.get('email').value;
    this.userService.resetPassword(email)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }
}
