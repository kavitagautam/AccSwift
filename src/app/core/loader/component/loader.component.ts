import { Component, OnInit } from "@angular/core";
import { Loader } from "../model/loader";
import { LoaderService } from "../service/loader.service";
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from "@angular/router";
@Component({
  selector: "accSwift-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent implements OnInit {
  show: boolean;
  loading: boolean;
  constructor(private router: Router, private loaderService: LoaderService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  ngOnInit() {
    this.loaderService.loaderState.subscribe((state: Loader) => {
      this.loading = state.show;
    });
  }
}
