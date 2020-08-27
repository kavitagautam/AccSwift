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
import { AuthenticationService } from "@accSwift-modules/auth/login/services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorsService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
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
        }
        //use error dialog services
        return throwError(error);
      })
    );
  }
}
