import { Component, OnInit, Input } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Router } from "@angular/router";

@Component({
  selector: "simpliflysaas-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.scss"],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      )
    ])
  ]
})
export class MenuItemComponent implements OnInit {
  @Input() item;
  @Input() depth: number;
  expanded: boolean;

  constructor(private router: Router) {
    if (this.depth === undefined) {
      this.depth = 1;
    }
  }

  ngOnInit() {}

  onItemSelect(item) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }

    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
