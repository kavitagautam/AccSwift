import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"]
})
export class AdminPanelComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  logout(): void {
    this.router.navigate(["/login"]);
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }
}
