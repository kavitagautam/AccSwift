import { Component, OnInit, HostListener } from "@angular/core";

@Component({
  selector: "simpliflysaas-cycle",
  templateUrl: "./cycle.component.html",
  styleUrls: ["./cycle.component.scss"]
})
export class CycleComponent implements OnInit {
  x0: number;
  y0: number;

  x1: number;
  y1: number;

  x2: number;
  y2: number;

  x3: number;
  y3: number;

  x4: number;
  y4: number;

  x5: number;
  y5: number;

  x6: number;
  y6: number;

  x7: number;
  y7: number;

  contentWidth: number;
  contentHeight: number;
  imageHeight: number;
  simpliflyLogoImageHeight: number;
  fontSize: number = 16;
  textPosition: number = -20;

  constructor() {}

  ngOnInit() {
    this.imageHeight = 94;

    // reduce 40px padding from the width of the div
    this.contentWidth = document.getElementById("cycle").offsetWidth - 40;
    if (this.contentWidth < 420) {
      this.contentHeight = this.contentWidth;
    } else {
      // when the content width is bigger that 420px,
      this.contentHeight = 420;
      this.contentWidth = 420;
    }

    this.onResize();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    // when the content width is less thant 420px i.e col-sm-3 & col-sm-4
    if (this.contentWidth < 420) {
      this.simpliflyLogoImageHeight = 109;
      this.imageHeight = 60;
      this.fontSize = 13;
      this.textPosition = -30;
    }

    // when the content width is less thant 280px especially for mobile devices
    if (this.contentWidth < 280) {
      this.simpliflyLogoImageHeight = 55;
      this.imageHeight = 30;
      this.fontSize = 10;
      this.textPosition = -45;
    }

    // simpliflysaas logo at the center.
    this.y0 = this.contentHeight / 2 - this.imageHeight / 2;
    this.x0 = this.contentWidth / 2 - this.imageHeight / 2;

    // CMS
    this.x1 = this.x0;
    this.y1 = 0;

    //candidates
    this.x3 = 0; // right: 0px;
    this.y3 = this.y0 + this.imageHeight / 3;

    // invoice-billing
    this.x6 = 0; // left: 0px;
    this.y6 = this.y3;

    //applicants
    this.x2 = this.x1 + (this.x0 - this.x6) - this.imageHeight / 2;
    this.y2 = this.y1 + (this.y3 - this.y1) / 2 - this.imageHeight / 2;

    // job order
    this.x5 = this.x1 - (this.x0 - this.x6) / 2;
    this.y5 = this.contentHeight - this.imageHeight - 10;

    // prospect
    this.x4 = this.x1 + (this.x0 - this.x6) - this.imageHeight; // bring the icon more to the left side
    this.y4 = this.y5; // same y-axis as in job order

    // reports
    this.x7 = this.x1 - (this.x0 - this.x6) + this.imageHeight / 2;
    this.y7 = this.y2;

    if (this.contentWidth < 280) {
      this.x0 = 80;
      this.y0 = 65;
    }

    // bring the simpliflysaas logo at the center in small devices
    if (this.contentWidth < 150) {
      this.x0 = 50;
      this.y0 = 30;
    }
  }
}
