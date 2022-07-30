import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  isCompleted: boolean;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.isCompleted = false;
  }

  resetPassword(): void {
    const email: string = this.form.value.email;
    this.userService.resetPassword(email)
      .subscribe(() => {
        this.isCompleted = true;
      });
  }
}
