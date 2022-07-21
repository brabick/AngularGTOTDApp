import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import * as qrcode from 'qrcode';

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

  ngOnInit() {
  }

  onLogin(data: any) {
    this.loginData = data;
    if(data.otpauth_url) {
      qrcode.toDataURL(data.otpauth_url, (err: any, img: string) => {
        this.loginData.img = img
      })
    }
  }
}
