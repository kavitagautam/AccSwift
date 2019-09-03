import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { environment } from "@env/environment";
@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"]
})
export class TopbarComponent implements OnInit {
  defaultImagePath = environment.defaultImageUrl;
  selectedLanguage: string;

  constructor() {}

  ngOnInit() {}

  toogleSideNav() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  }
}
