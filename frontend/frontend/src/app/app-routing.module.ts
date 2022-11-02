import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {ForgotComponent} from "./pages/forgot/forgot.component";
import {ResetComponent} from "./pages/reset/reset.component";
import {GtotdComponent} from "./pages/gtotd/gtotd.component";
import {GtotdsComponent} from "./pages/gtotd/gtotds/gtotds.component";
import {ProfileComponent} from "./components/profile/profile.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'reset/:token', component: ResetComponent},
  {path: 'gtotd', component: GtotdComponent},
  {path: 'gtotd/:id', component: GtotdsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/:id', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
