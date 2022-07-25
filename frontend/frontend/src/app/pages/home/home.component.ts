import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";

interface Gtotd {
  id: Number;
  title: string;
  body: string;
  date_created: string;
  user: Number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message = '';
  gtotds: Gtotd[] = [];
  constructor(
    private authService: AuthService,
    private gtotdService: GtotdService,
  ) {

  }

  ngOnInit(): void {
    this.getGtotds();
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

  getGtotds() {
    this.gtotdService.allGtotds().subscribe({
      next: (res:any) => {
        for(let i = 0; i < res.length; i++) {
          this.gtotds.push(res[i])
        }
        this.gtotds = res;
    }
    })
  }

}
