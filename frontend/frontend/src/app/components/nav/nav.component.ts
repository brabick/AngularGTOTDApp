import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GtotdService} from "../../services/gtotd.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authenticated = false;
  form!: FormGroup;
  user_id = sessionStorage.getItem('userId');
  search: string = '';
  url: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private gtotdService: GtotdService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    AuthService.authEmitter.subscribe(authenticated => {
      this.authenticated = authenticated;
    });
    this.form = this.formBuilder.group({
        search: '',
      }
    )
  }

  logout() {
    this.authService.logout().subscribe(()=> {
      this.authService.accessToken = '';
      AuthService.authEmitter.emit(false);
    })
  }

  submit(): void {
    /*this.gtotdService.searchGtotd(this.form.getRawValue().search).subscribe({
      next: (res: any) => {
        I gotta implement this eventually
        for(let i = 0; i < res.length; i++) {
          this.comments.push(res[i])
        }
        this.comment = true;
        console.log(this.comments);
        return res;
        console.log(res);
        console.log(sessionStorage.getItem('userId'));
      },
      error: (err: any) => {
        console.log("error")
        return err;
      }
    }) */
  }

  searchButton() {
    console.log(this.search);
    this.url = this.router.url;
  }

}
