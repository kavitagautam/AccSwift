import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { Router } from "@angular/router";
import { Users, UserRootModel, UserNavigate } from "@accSwift-modules/user/models/user.model";
import { UserService } from '@accSwift-modules/user/services/user.service';

@Component({
  selector: "accswift-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.defaultImagePath;
  selectedLanguage: string;
  users: Users;
  userName: any;

  constructor(private router: Router, public userService: UserService) {}

  ngOnInit() {
    this.getProfile();
  }

  getProfile():void {
    this.userService.getUserProfile().subscribe(
      (response) => {
        this.users = response.Entity;
      },
    );
  }

  userProfile()
  {
    this.router.navigate(["/user/profile",this.users.UserID]);
  }

  
  navigateToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}
