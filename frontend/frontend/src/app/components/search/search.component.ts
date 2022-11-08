import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";
import {environment} from "../../../environments/environment";

interface Gtotd {
  id: Number;
  image: string;
  title: string;
  body: string;
  date_created: string;
  user: Number;
}

interface User {
  first_name: string;
  last_name: string;
  image: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  param: string = this.route.snapshot.params['q'];
  gtotds: Gtotd[] = [];
  users: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private gtotdService: GtotdService,
  ) {
  }

  ngOnInit(): void {
    this.gtotdService.searchGtotd(this.param).subscribe({
      next: (res: any) => {

        for(let i = 0; i < res.gtotds.length; i++) {
          let gtotd = res.gtotds[i];
          console.log(gtotd);
          gtotd['image'] = environment.media + gtotd['image'];
          this.gtotds.push(gtotd)
        }

        for(let i = 0; i < res.users.length; i++) {
          let user = res.users[i];
          user['image'] = environment.media + user['image'];
          this.users.push(user)
        }
        }

      },)

  }

}
