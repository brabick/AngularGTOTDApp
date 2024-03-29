import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GtotdService {
  static gtotdEmitter = new EventEmitter<number>();

  constructor(private http:HttpClient) {

  }

  gtotd(body: any) {
    return this.http.post(`${environment.api}/gtotd`, body);
  }

  allGtotds() {
    return this.http.get(`${environment.api}/gtotds`);
  }

  singleGtotd(body: any) {
    return this.http.get(`${environment.api}/gtotd/?id=${body}`);
  }

  gtotdComments(body: any) {
    return this.http.get(`${environment.api}/comments?id=${body}`);
  }

  reset(body: any) {
    return this.http.post(`${environment.api}/reset`, body);
  }
  postGtotdComment(body: any) {
    return this.http.post(`${environment.api}/comments`, body);
  }
  searchGtotd(body: any) {
    return this.http.get(`${environment.api}/searchgtotd?u=${body}`);
  }
}
