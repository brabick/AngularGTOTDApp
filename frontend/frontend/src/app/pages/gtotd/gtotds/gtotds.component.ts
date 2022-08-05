import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ForgotService} from "../../../services/forgot.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GtotdService} from "../../../services/gtotd.service";


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

  gtotds: Gtotd[] = [];
  comments: Comment[] = [];
  response = false;
  comment = false;
  constructor(
    private formBuilder: FormBuilder,
    private forgotService: ForgotService,
    private route: ActivatedRoute,
    private router: Router,
    private gtotdService: GtotdService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        password: '',
        password_confirm: '',
      }
    )
    this.getGtotd();
  }

  submit(){
    const formData = this.form.getRawValue();

    const data = {
      ...formData,
      token: this.route.snapshot.params['id']
    }
    this.forgotService.reset(data).subscribe(() => this.router.navigate(['/login']));
  }

  getGtotd(): void {
    this.gtotdService.singleGtotd(this.route.snapshot.params['id']).subscribe({
      next: (res: any) => {
        this.gtotds.push(res);
        this.response = true;
        console.log(this.gtotds);
        this.getComments()
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
