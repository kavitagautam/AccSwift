import { Router } from "@angular/router";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-add-stock-transfer",
  templateUrl: "./add-stock-transfer.component.html",
  styleUrls: ["./add-stock-transfer.component.scss"]
})
export class AddStockTransferComponent implements OnInit {
  addStockTransferForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.buildAddStockForm();
  }

  buildAddStockForm() {
    this.addStockTransferForm = this._fb.group({
      series: [null],
      voucherNo: ["", [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromDepotLoc: [null],
      toDepotLoc: [null],
      remarks: [""]
    });
  }

  public save(): void {
    if (this.addStockTransferForm.valid) {
      this.router.navigate(["/stock-transfer"]);
    }
  }

  public cancel(): void {
    this.addStockTransferForm.reset();
    this.router.navigate(["/stock-transfer"]);
  }
}
