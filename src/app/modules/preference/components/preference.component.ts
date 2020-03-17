import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-preference",
  templateUrl: "./preference.component.html",
  styleUrls: ["./preference.component.scss"]
})
export class PreferenceComponent implements OnInit {
  private toggler = document.getElementsByClassName("boxes");
  nodeName: string;

  constructor() {}

  ngOnInit() {
    this.buildMenuItem();
  }

  selectedNode(item): void {
    this.nodeName = item;
  }

  buildMenuItem(): void {
    for (let i = 0; i < this.toggler.length; i++) {
      this.toggler[i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("check-boxes");
      });
    }
  }
}
