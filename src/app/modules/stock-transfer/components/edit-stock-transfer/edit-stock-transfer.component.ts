import { StockTransferService } from "./../../services/stock-transfer.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";

@Component({
  selector: "accSwift-edit-stock-transfer",
  templateUrl: "./edit-stock-transfer.component.html",
  styleUrls: ["./edit-stock-transfer.component.scss"]
})
export class EditStockTransferComponent implements OnInit {
  editStockTransferForm: FormGroup;
  stockTransferDetails;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private stockTransferService: StockTransferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildEditStockForm();
    this.getIdFromRoute();
  }

  buildEditStockForm() {
    this.editStockTransferForm = this._fb.group({
      series: [null],
      voucherNo: ["", [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromDepotLoc: [null],
      toDepotLoc: [null],
      remarks: [""]
    });
  }

  getIdFromRoute() {
    // this.route.paramMap.subscribe(params => {
    //   const param = +params.get("id");
    //   if (param) {
    //     this.stockTransferService.get(param).subscribe(response => {
    //       this.stockTransferDetails = response;
    //       this.buildEditStockForm();
    //     });
    //   }
    // });
  }

  public save(): void {
    if (this.editStockTransferForm.valid) {
      this.router.navigate(["/stock-transfer"]);
    }
  }

  public cancel(): void {
    this.editStockTransferForm.reset();
    this.router.navigate(["/stock-transfer"]);
  }
}
