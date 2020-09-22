import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { ProductGroup } from "@accSwift-modules/product/models/product-group.models";
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

  productClick(id): void {
    console.log("product ID" + id);
    this.posServices.getProductOrGroup(id).subscribe((response) => {
      console.log("this product List" + JSON.stringify(response));
      this.productOrGroupList = response.Entity;
    });
  }
}
