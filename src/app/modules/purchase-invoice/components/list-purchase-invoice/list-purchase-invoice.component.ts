import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-list-purchase-invoice",
  templateUrl: "./list-purchase-invoice.component.html",
  styleUrls: ["./list-purchase-invoice.component.scss"]
})
export class ListPurchaseInvoiceComponent implements OnInit {
  purchaseForm: FormGroup;
  constructor(
    private purchaseService: PurchaseInvoiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildListPurchaseInvoiceForm();
  }

  buildListPurchaseInvoiceForm() {
    this.purchaseForm = this.fb.group({
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
