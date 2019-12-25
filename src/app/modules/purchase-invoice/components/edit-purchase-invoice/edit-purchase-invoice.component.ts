import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-edit-purchase-invoice",
  templateUrl: "./edit-purchase-invoice.component.html",
  styleUrls: ["./edit-purchase-invoice.component.scss"]
})
export class EditPurchaseInvoiceComponent implements OnInit {
  editPurchaseForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildEditPurchaseInvoiceForm();
  }

  buildEditPurchaseInvoiceForm() {
    this.editPurchaseForm = this.fb.group({
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
