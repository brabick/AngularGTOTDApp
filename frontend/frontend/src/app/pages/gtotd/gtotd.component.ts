import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {GtotdService} from "../../services/gtotd.service";

@Component({
  selector: 'app-gtotd',
  templateUrl: './gtotd.component.html',
  styleUrls: ['./gtotd.component.css']
})
export class GtotdComponent implements OnInit {

  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private gtotdService: GtotdService,

  ) { }

  user_id = '';
  show_message = false;
  message = '';

  ngOnInit(): void {

    this.form = this.formBuilder.group({
        title: '',
        body: '',
        user: '',
        date_created: '',
      }
    )
  }
  getId(): void {
    this.authService.user().subscribe({
      next: (res: any) => {
        this.form.getRawValue().user = res.id;
        this.user_id = res.id;

        return res;
      },
      error: (err: any) => {
        this.form.getRawValue().user = err.id;
        this.user_id = err.id;
        console.log(this.user_id)
        return err;
      }
    }

    )
  }

  submit(): void{
    this.authService.user().subscribe({
        next: (res: any) => {
          let new_form = {
            title: this.form.getRawValue().title,
            body: this.form.getRawValue().body,
            user: res.id,
            date_created: this.form.getRawValue().date_created,
          }
          this.message = "Nice!"
          this.show_message = true;
          this.gtotdService.gtotd(new_form).subscribe(
            () => this.router.navigate(['/'])
          );
        },
        error: (err: any) => {
          this.message = "Hold on there buddy! Are you logged in?"
          this.show_message = true;
          this.form.getRawValue().user = err.id;
          this.user_id = err.id;
          return err;
        }
      }

    )

  }

  /*submit(){
    //console.log(this.form);
    let car = this.getId();

    console.log(this.user_id)
    console.log(this.form.getRawValue().user)
    this.gtotdService.gtotd(this.form.getRawValue()).subscribe(
      () => this.router.navigate(['/'])
    );
  }*/
}
