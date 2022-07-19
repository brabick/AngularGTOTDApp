import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message = '';
  constructor(
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (res: any) => {
        this.message = `Hello ${res.first_name}`
        AuthService.authEmitter.emit(true);
      },
      error: err => {
        this.message = 'You are not logged in';
        AuthService.authEmitter.emit(false);
      }
      }

    )
  }

}
