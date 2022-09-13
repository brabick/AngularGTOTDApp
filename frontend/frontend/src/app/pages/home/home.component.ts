import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";
import {ProfileService} from "../../services/profile.service";
import {environment} from "../../../environments/environment";

interface Gtotd {
  id: Number;
  image: string;
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
  image = '';
  constructor(
    private authService: AuthService,
    private gtotdService: GtotdService,
    private profileService: ProfileService,
  ) {

  }

  ngOnInit(): void {
    this.getGtotds();
    this.authService.user().subscribe({
      next: (res: any) => {
        this.message = `Hello ${res.first_name}`;
        this.image = res.image;
        AuthService.authEmitter.emit(true);
        console.log(res);
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
          let gtotd = res[i];
          console.log(gtotd);
          gtotd['image'] = environment.media + gtotd['image'];
          this.gtotds.push(gtotd)
          console.log(this.gtotds)
        }
        this.gtotds = res;
    }
    })
  }

  onClickGtotd() {
    GtotdService.gtotdEmitter.emit()
  }

}
