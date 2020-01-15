import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HttpInterceptorsService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem("access_token");
    // const authToken =
    //     "6HNFanS4-eXdGQzzfXKbf4PFZ_8gU0dYbAoWtx4bSssF42Hq4MOYSzsY1v_pr4C9t7qE3hXHtADFvkF63KiMhdvuzZlGHeDpohFDs06ZmN_8GZ1UHOYtKs0r_d--wt4eYIcegZUPTpPgZIdrdnFBhTiaIEUQFdvC3OTgHGtRxJnic52bppg_Z7IkAaFZIgD9-6MCInz49RqZzgXn5vLj7i0MVm3G_E8BvJRRTp8lSj7qhEmpPtLfmupnE5U7sFqgdBIeQh4uwAnNrFwGmDRX0ESWITVj6P11WYrgt_eFuVE";

    let authReq = req.clone({
      headers: req.headers.append("Authorization", `bearer ` + authToken)
    });

    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //     console.log("Event" + JSON.stringify(event));
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
       // console.log("error " + JSON.stringify(error));
        if (error.status == 403) {
          // localStorage.clear();
        }
        //use error dialog services
        return throwError(error);
      })
    );
  }
}
