import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem("access_token")) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  // canActivate(): boolean {
  //   const token = sessionStorage.getItem("access_token");
  //   if (!token) {
  //     this.router.navigate(["/login"]);
  //     return false;
  //   }
  //   return true;
  // }
}
