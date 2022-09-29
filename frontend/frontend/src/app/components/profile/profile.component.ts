import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";
import {FormBuilder} from "@angular/forms";
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private gtotdService: GtotdService,
    private profileService: ProfileService,
  ) { }

  user_id = sessionStorage.getItem('userId');
  show_message = false;
  message = '';


  ngOnInit(): void {
  }


  getId(): void {
    this.authService.user().subscribe({
        next: (res: any) => {

          this.user_id = res.id;

          this.profileService.individual_profile(this.user_id, 1).subscribe()
          console.log(res);
          return res;
        },
        error: (err: any) => {

          this.user_id = err.id;
          console.log(this.user_id)
          return err;
        }
      }

    )
  }
}
