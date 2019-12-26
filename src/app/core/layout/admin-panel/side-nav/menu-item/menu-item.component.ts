import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "accswift-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.scss"]
})
export class MenuItemComponent implements OnInit {
  @Input() navItems;
  expanded: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }
    });
  }
}
