import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorsService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = sessionStorage.getItem("access_token");
    let authReq = req.clone({
      headers: req.headers
        .append("Authorization", `bearer ` + authToken)
        .append("Cache-Control", "no-cache, no-store, must-revalidate")
        .append("Pragma", "no-cache")
        .append("Expires", "0")
        .append("If-Modified-Since", "0"),
    });

    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.router.navigate([""]);
        }
        //use error dialog services
        return throwError(error);
      })
    );
  }
}
