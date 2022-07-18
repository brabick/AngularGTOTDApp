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
      next: res => {
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
      }

    )
  }

}
