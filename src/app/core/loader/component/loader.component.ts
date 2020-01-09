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
  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.loaderState.subscribe((state: Loader) => {
      this.show = state.show;
    });
  }
}
