import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthenticationService } from "@accSwift-modules/auth/login/services/authentication.service";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.cookieService.get("access_token");
    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    } else {
      return true;
    }
  }
}
