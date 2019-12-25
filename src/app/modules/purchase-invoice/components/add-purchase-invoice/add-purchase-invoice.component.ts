import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-purchase-invoice",
  templateUrl: "./add-purchase-invoice.component.html",
  styleUrls: ["./add-purchase-invoice.component.scss"]
})
export class AddPurchaseInvoiceComponent implements OnInit {
  addPurchaseForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private purchaseInvoiceService: PurchaseInvoiceService
  ) {}

  ngOnInit() {
    this.buildListPurchaseInvoiceForm();
  }

  buildListPurchaseInvoiceForm() {
    this.addPurchaseForm = this.fb.group({
      seriesName: "",
      cashParty: "",
      purchaseAc: "",
      voucherNo: "",
      partyBillNo: "",
      depot: "",
      project: "",
      date: "",
      orderNo: "",
      remarks: ""
    });
  }
}
