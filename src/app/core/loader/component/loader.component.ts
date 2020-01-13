import { Component, OnInit } from "@angular/core";
import { Loader } from "../model/loader";
import { LoaderService } from "../service/loader.service";

@Component({
  selector: "accSwift-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent implements OnInit {
  show: boolean;
  constructor(private loaderService: LoaderService) {
    console.log("Loader COmponent Called");
  }

  ngOnInit() {
    this.loaderService.loaderState.subscribe((state: Loader) => {
      this.show = state.show;
    });
  }
}
