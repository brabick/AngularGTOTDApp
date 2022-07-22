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
  user = this.authService.user();

  ngOnInit(): void {

    this.form = this.formBuilder.group({
        title: '',
        body: '',
        user: this.authService.user(),
        date_created: '',
      }
    )
  }
  submit(){

    this.gtotdService.gtotd(this.form.getRawValue()).subscribe(
      () => this.router.navigate(['/'])
    );
  }
}
