import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { Router } from "@angular/router";

@Component({
  selector: "accswift-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.defaultImagePath;
  selectedLanguage: string;

  userInfo: any;
  userName: any;
  constructor(private router: Router) {}

  ngOnInit() {
    this.userName = "Admin";
    this.userInfo = {
      email_address: "admin@bentraytech.com"
    };
  }

  navigateToDashboard() {
    this.router.navigate(["/dashboard/admin"]);
  }
}
