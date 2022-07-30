import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {

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
