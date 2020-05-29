import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  toggler = document.getElementsByClassName("boxes");
  nodeName: string;
  public i: any;

  constructor() {}

  ngOnInit() {
    this.buildMenuItem();
    this.nodeName = "options";
  }
  selectedNode(item): void {
    this.nodeName = item;
  }

  buildMenuItem(): void {
    for (this.i = 0; this.i < this.toggler.length; this.i++) {
      this.toggler[this.i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("check-boxes");
      });
    }
  }
}
