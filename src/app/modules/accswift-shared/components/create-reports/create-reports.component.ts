import { Component, OnInit, Input } from "@angular/core";
import { environment } from "@env/environment";
import { IconConst } from "@app/shared/constants/icon.constant";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-create-reports",
  templateUrl: "./create-reports.component.html",
  styleUrls: ["./create-reports.component.scss"],
})
export class CreateReportsComponent implements OnInit {
  defaultImageUrl = environment.defaultImageUrl;
  @Input("formGroup")
  public form: FormGroup;
  @Input("voucherType") public voucherType: string;
  iconConst = IconConst;
  cvsList = [];
  constructor(private router: Router) {
    if (this.router.url.indexOf("/journal") > -1) {
      this.voucherType = "JRNL";
      const data = JSON.parse(localStorage.getItem("journal"));
      if (data) {
        //  this.journalDetails = data.Journaldetails;
      }
    }
    if (this.router.url.indexOf("/sales-invoice") > -1) {
      this.voucherType = "SALES";
      // localStorage.setItem(
      //   "invoices",
      //   JSON.stringify(this.form.get("InvoiceDetails").value)
      // );
      //const data = JSON.parse(localStorage.getItem("invoices"));
      // if (data) {
      // this.invoiceDetails = data.InvoiceDetails;
      // this.calculateTotal(this.invoiceDetails);
      //}
    }
    if (this.router.url.indexOf("/cash-receipt") > -1) {
      this.voucherType = "CASH_RCPT";
      const data = JSON.parse(localStorage.getItem("CashReceiptDetails"));
      if (data) {
        //this.cashDetails = data.CashReceiptDetails;
      }
    }
    if (this.router.url.indexOf("/cash-payment") > -1) {
      this.voucherType = "CASH_PMNT";

      const data = JSON.parse(localStorage.getItem("CashPaymentDetailsList"));
      if (data) {
        // this.cashDetails = data.CashPaymentDetailsList;
      }
    }
    if (this.router.url.indexOf("/bank-receipt") > -1) {
      this.voucherType = "BANK_RCPT";
      const data = JSON.parse(localStorage.getItem("BankReceiptDetailsList"));
      if (data) {
        // this.bankDetails = data.BankReceiptDetailsList;
      }
    }
    if (this.router.url.indexOf("/bank-payment") > -1) {
      this.voucherType = "BANK_PMNT";
      const data = JSON.parse(localStorage.getItem("BankPaymentDetailsList"));
      if (data) {
        //  this.bankDetails = data.BankPaymentDetailsList;
      }
    }
  }

  ngOnInit() {}

  invoiceBilling(): void {
    if (this.voucherType == "SALES") {
      console.log(this.form.getRawValue());
      this.router.navigate(
        [`/sales-invoice/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("InvoiceDetails").value,
        }
      );
      // const data = this.form.get("InvoiceDetails").value;
      // console.log(data);
      // if (data) {
      //   localStorage.setItem(
      //     "invoices",
      //     JSON.stringify(this.form.get("InvoiceDetails").value)
      //   );
      // }
    }
  }

  exportToCSV() {
    //  const data = this.salesInvoiceForm.get("InvoiceDetails").value;
    var data = [];
    if (this.voucherType == "SALES") {
      data = this.form.get("InvoiceDetails").value;
    }

    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    const csvArray = csv.join("\r\n");

    const a = document.createElement("a");
    const blob = new Blob([csvArray], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
