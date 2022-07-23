import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token');
    this.userService.applyConfirmation(token)
      .subscribe();
  }
}
