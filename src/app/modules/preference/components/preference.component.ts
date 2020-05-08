import { Component, OnInit } from "@angular/core";
import { PreferenceService } from "../services/preference.service";

@Component({
  selector: "accSwift-preference",
  templateUrl: "./preference.component.html",
  styleUrls: ["./preference.component.scss"],
})
export class PreferenceComponent implements OnInit {
  private toggler = document.getElementsByClassName("boxes");
  nodeName: string;

  constructor(private preferenceService: PreferenceService) {
    this.preferenceService.getPerference();
  }

  ngOnInit(): void {
    this.buildMenuItem();
    this.nodeName = "options";
  }

  selectedNode(item): void {
    this.nodeName = item;
  }

  buildMenuItem(): void {
    for (let i = 0; i < this.toggler.length; i++) {
      this.toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("check-boxes");
      });
    }
  }
}
