import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "../interceptors/auth.interceptor";
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ResetComponent } from './pages/reset/reset.component';
import { FormComponent } from './pages/login/form/form.component';
import { AuthenticatorComponent } from './pages/login/authenticator/authenticator.component';
import { GtotdComponent } from './pages/gtotd/gtotd.component';
import { GtotdsComponent } from './pages/gtotd/gtotds/gtotds.component';
import {DatePipe} from "@angular/common";
import { ProfileComponent } from './components/profile/profile.component';
import { MatSliderModule } from '@angular/material/slider';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatGridListModule} from "@angular/material/grid-list";
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavComponent,
    ForgotComponent,
    ResetComponent,
    FormComponent,
    AuthenticatorComponent,
    GtotdComponent,
    GtotdsComponent,
    ProfileComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatGridListModule,
  ],
  exports: [
    MatSliderModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
