import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ForgotService} from "../../../services/forgot.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GtotdService} from "../../../services/gtotd.service";
import {AuthService} from "../../../services/auth.service";
import { DatePipe } from '@angular/common';
import {environment} from "../../../../environments/environment";

// The naming sucks, this is the component for the single Gtotd
interface Gtotd {
  id: Number;
  title: string;
  body: string;
  date_created: string;
  user: Number;
}

interface Comment {
  id: Number;
  body: string;
  date_created: string;
  user: string;
  gtotd: Number;
}

@Component({
  selector: 'app-gtotds',
  templateUrl: './gtotds.component.html',
  styleUrls: ['./gtotds.component.css']
})
export class GtotdsComponent implements OnInit {
  form!: FormGroup;
  date = new Date();
  image = '';
  gtotds: Gtotd[] = [];
  comments: Comment[] = [];
  response = false;
  comment = false;
  authenticated = false;
  user_id = '';
  message = '';
  show_message = false;

  constructor(
    private formBuilder: FormBuilder,
    private forgotService: ForgotService,
    private route: ActivatedRoute,
    private router: Router,
    private gtotdService: GtotdService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.authService.user().subscribe({
      next: (res: any) => {
        if(res.id){
          this.authenticated = true;
          this.user_id = res.id;

        }

      },
    })
    this.form = this.formBuilder.group({
      body: '',
      date_created: '',
      user: '',
      id: '',
      }
    )
    this.getGtotd();
  }

  submit(){
     this.authService.user().subscribe({
      next: (res: any) => {
        let new_form = {
          gtotd: this.route.snapshot.params['id'],
          body: this.form.getRawValue().body,
          user: res.id,
          date_created: this.datePipe.transform(this.date, 'yyyy-MM-dd'),
        }

        this.gtotdService.postGtotdComment(new_form).subscribe(
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
    })
  }

  getGtotd(): void {
    this.gtotdService.singleGtotd(this.route.snapshot.params['id']).subscribe({
      next: (res: any) => {
        this.gtotds.push(res['gtotd']);
        this.image = environment.media + res['image'];
        this.response = true;
        console.log(this.gtotds);
        if (res['comments'].length > 0) {
          this.comment = true;
          for (let i = 0; i < res['comments'].length; i++) {
            console.log(res['comments'][i])
            this.comments.push(res['comments'][i])
          }
        }
        console.log(this.comments)
        return res;

      },
      error: (err: any) => {

        console.log("error")
        return err;
      }
    })
  }

  getComments(): void {
    this.gtotdService.gtotdComments(this.route.snapshot.params['id']).subscribe({
      next: (res: any) => {
        for(let i = 0; i < res.length; i++) {
          this.comments.push(res[i])
        }
        this.comment = true;
        console.log(this.comments);
        return res;
      },
      error: (err: any) => {
        console.log("error")
        return err;
      }
    })
  }

}
