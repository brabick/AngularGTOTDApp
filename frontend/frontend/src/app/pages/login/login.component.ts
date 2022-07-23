import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    id: 0,
    img: ''
  }

  secret = ''

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  onLogin(data: any) {
    this.loginData = data;

    if (data.otpauth_url) {
      qrcode.toDataURL(data.secret, (err: any, img: string) => {
        this.loginData.img = img;
        console.log(img)
      })
    }
    else {
      console.log('something went wrong')
    }
  }
}
