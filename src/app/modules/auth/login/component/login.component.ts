import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  username: string;
  password: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  login() {
    this.authenticationService
      .login(this.username, this.password)
      .pipe(first())
      .subscribe(
        data => {
          localStorage.setItem("access_token", data["access_token"]);
          localStorage.setItem("token_type", data["token_type"]);
          localStorage.setItem("expires_in", data["expires_in"]);
          this.router.navigate([""]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error));
        },
        () => {
          this.toastr.success("Login Successful!");
        }
      );
  }
}
