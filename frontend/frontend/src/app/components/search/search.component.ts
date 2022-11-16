import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
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
    private router: Router,
  ) {
    router.events.subscribe((val) => {
     if (val instanceof NavigationStart == false) {
       // This is pretty sketch, but it works. We check the route to see
       // If stuff has changed, if so we check the param again and run getGtotds
       this.param = window.location.href.slice(environment.media.length + 8)
       this.getGtotds();
     }
    })
  }

  ngOnInit(): void {
    this.getGtotds();
  }

  getGtotds(): void {

    this.gtotdService.searchGtotd(this.param).subscribe({
      next: (res: any) => {
        while(this.gtotds.length > 0) {
          this.gtotds.pop();
        }
        while(this.users.length > 0) {
          this.users.pop();
        }
        for(let i = 0; i < res.gtotds.length; i++) {
          let gtotd = res.gtotds[i];
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
