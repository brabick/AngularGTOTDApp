import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output('onLogin') onLogin = new EventEmitter();

  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  e = false;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
        email: '',
        password: '',
      }
    )
  }
  submit(){
    this.authService.login(this.form.getRawValue()).subscribe({
        next: (res: any) => {
          this.onLogin.emit(res)
        },
        error: err => {
          this.e = true;
        }
      }
    );
  }

}
