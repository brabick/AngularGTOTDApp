import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  profiles(body: any) {
    return this.http.get(`${environment.api}/profile?id=${body}`);
  }
  individual_profile(id: any, user: any) {
    return this.http.get(`${environment.api}/profile?id=${id}&u=${user}`);
  }
}
