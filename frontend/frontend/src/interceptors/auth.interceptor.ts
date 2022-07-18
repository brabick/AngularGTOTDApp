import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../app/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return this.authService.refresh().pipe(
          switchMap((res: any) => {
            this.authService.accessToken = res.token;

            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.authService.accessToken}`
              }
            }));
          })
        )
      }
      return throwError(() => err)
    }));
  }
}
