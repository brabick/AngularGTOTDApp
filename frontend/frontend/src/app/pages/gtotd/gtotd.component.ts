import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: ''
      }
    )
  }
  submit(){
    this.authService.register(this.form.getRawValue()).subscribe(
      () => this.router.navigate(['/login'])
    );
  }
}
