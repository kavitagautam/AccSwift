import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-preference",
  templateUrl: "./preference.component.html",
  styleUrls: ["./preference.component.scss"]
})
export class PreferenceComponent implements OnInit {
  private toggler = document.getElementsByClassName("boxes");
  nodeName: string;
  public i: any;

  constructor() {}

  ngOnInit() {
    this.treeView();
  }

  selectedNode(item): void {
    this.nodeName = item;
  }

  treeView(): void {
    for (this.i = 0; this.i < this.toggler.length; this.i++) {
      this.toggler[this.i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("check-boxes");
      });
    }
  }
}
