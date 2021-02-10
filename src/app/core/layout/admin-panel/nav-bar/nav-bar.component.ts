import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { Router } from "@angular/router";
import { User, UserRootModel } from "@app/core/models/admin.model.ts";
import { AdminPanelService } from "@app/core/services/admin-panel/admin-panel.service.ts"

@Component({
  selector: "accswift-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.defaultImagePath;
  selectedLanguage: string;
  userInfo: User;

  constructor(private router: Router, private adminPanelService: AdminPanelService) {}

  ngOnInit() {
    this.adminPanelService.getUserInfo().subscribe((response: UserRootModel) => {
      this.userInfo = response.Entity;
    });
    
  }

  navigateToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}
