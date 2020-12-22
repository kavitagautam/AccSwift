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
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorsService implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    // const authToken =
    //   "mmdWKrQzhr-5IcSFY57JJ4YvZXR3Gvz0ZlZ9m9EKCdUwC5H7sJAIt5E60EAcUv6Gx4xPCbzV3u3vIpjDcevd9PrY2Xn4UE1CbXG06x9x7gijUdAfnYk3SbtH55KljZU-zGMeNhVrtAOeYvcAU22E75OUWNuICyGWn38H5S7QqDNgkLb5Wmxis-e1fCzzqwnqcMVUJabKugOOP7Xb2kAzExV254qjoMwwHDmwZANoAf1fH4fcccQYsdqc3LAWse7DXywstQGIYlZ6E4T2RGJavbKcdNRDfVqbh7945wvi5zl2zQUlU6tuWbxMjqbEYGdIReSTGjQwFj4GcL_u5eqlRA76Rpx3D2sSI_yWPzipVe7dWLlxEA_QSkqQEv3OYAuDZPpVuxoMTBFtsra0GsRqdSwO3iU89M_udfyUcZHbJiNHJOB4";
    //
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
          this.toastr.error(
            JSON.stringify("You are not an authentic user, please login.")
          );

          this.authService.logout();
          // this.router.navigate(["/login"]);
        }
        //use error dialog services
        return throwError(error);
      })
    );
  }
}
