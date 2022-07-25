import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GtotdService {

  constructor(private http:HttpClient) {

  }

  gtotd(body: any) {
    return this.http.post(`${environment.api}/gtotd`, body);
  }

  allGtotds() {
    return this.http.get(`${environment.api}/gtotds`);
  }

  reset(body: any) {
    return this.http.post(`${environment.api}/reset`, body);
  }
}
