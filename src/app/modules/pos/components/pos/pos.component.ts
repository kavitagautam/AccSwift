import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  productOrGroupList: ProductOrGroup[] = [];

  constructor(private posServices: PosService) {}

  ngOnInit() {
    this.getProductGroup();
  }

  getProductGroup(): void {
    this.posServices.getProductOrGroup(null).subscribe((response) => {
      this.productOrGroupList = response.Entity;
    });
  }

  productClick(product): void {
    if (product.TypeOf == 0) {
      this.posServices.getProductOrGroup(product.ID).subscribe((response) => {
        this.productOrGroupList = response.Entity;
      });
    }
  }
}
