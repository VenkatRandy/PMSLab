import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    });
    //console.log(request);
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error.data.responseDescription) {
            console.error(error.error.data.responseDescription);
          } else {
            console.log(error.error);
          }
          // if (request.url.includes('forget/password')) {
          //   //return next.handle(request);
          //   if (error.status == 403) {
          //     return next.handle(request);
          //   }
          // }

          let errorMessage = '';
          if (error.status == 401 || error.status == 403) {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            sessionStorage.clear();
            localStorage.clear();
            //window.location.href = 'http://localhost:4200/login';
            window.location.href = 'http://pmsqa.encoress.com/login';
            //window.location.href = 'https://app.encoress.com/login';
          } else if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          }
          return throwError(error);
        })
      );
  }
}