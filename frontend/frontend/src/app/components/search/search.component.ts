import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  param: string = this.route.snapshot.params['q'];
  gtotds = [];
  users = [];
  constructor(
    private route: ActivatedRoute,
    private gtotdService: GtotdService,
  ) {
  }

  ngOnInit(): void {
    this.gtotdService.searchGtotd(this.param).subscribe({
      next: (res: any) => {
        this.gtotds = res.gtotds;
        this.users = res.users;
        console.log(this.users);
        console.log(this.gtotds)

        }

      },)

  }

}
