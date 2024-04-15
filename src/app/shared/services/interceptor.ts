import { Inject, Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private router = inject(Router)

  constructor(@Inject(DOCUMENT) private document: Document) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.document.defaultView?.localStorage?.getItem('token')

    if (token != null) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      })
    }

    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.log("error")
        console.log(error.status)
        this.router.navigate(['a/login'])
      }

      return throwError(() => error);
    }))
  }
}