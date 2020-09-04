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
    // if (this.router.url.indexOf("/journal") > -1) {
    //   this.voucherType = "JRNL";
    //   const data = JSON.parse(localStorage.getItem("journal"));
    //   if (data) {
    //     //  this.journalDetails = data.Journaldetails;
    //   }
    // }
    // if (this.router.url.indexOf("/sales-invoice") > -1) {
    //   this.voucherType = "SALES";
    //   // localStorage.setItem(
    //   //   "invoices",
    //   //   JSON.stringify(this.form.get("InvoiceDetails").value)
    //   // );
    //   //const data = JSON.parse(localStorage.getItem("invoices"));
    //   // if (data) {
    //   // this.invoiceDetails = data.InvoiceDetails;
    //   // this.calculateTotal(this.invoiceDetails);
    //   //}
    // }
    // if (this.router.url.indexOf("/cash-receipt") > -1) {
    //   this.voucherType = "CASH_RCPT";
    //   const data = JSON.parse(localStorage.getItem("CashReceiptDetails"));
    //   if (data) {
    //     //this.cashDetails = data.CashReceiptDetails;
    //   }
    // }
    // if (this.router.url.indexOf("/cash-payment") > -1) {
    //   this.voucherType = "CASH_PMNT";
    //   const data = JSON.parse(localStorage.getItem("CashPaymentDetailsList"));
    //   if (data) {
    //     // this.cashDetails = data.CashPaymentDetailsList;
    //   }
    // }
    // if (this.router.url.indexOf("/bank-receipt") > -1) {
    //   this.voucherType = "BANK_RCPT";
    //   const data = JSON.parse(localStorage.getItem("BankReceiptDetailsList"));
    //   if (data) {
    //     // this.bankDetails = data.BankReceiptDetailsList;
    //   }
    // }
    // if (this.router.url.indexOf("/bank-payment") > -1) {
    //   this.voucherType = "BANK_PMNT";
    //   const data = JSON.parse(localStorage.getItem("BankPaymentDetailsList"));
    //   if (data) {
    //     //  this.bankDetails = data.BankPaymentDetailsList;
    //   }
    // }
  }

  ngOnInit() {}

  invoiceBilling(): void {
    if (this.voucherType == "SALES") {
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
    if (this.voucherType == "BANK_RCPT") {
      this.router.navigate(
        [`/bank-receipt/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("BankReceiptDetailsList").value,
        }
      );
    }
    if (this.voucherType == "BANK_PMNT") {
      this.router.navigate(
        [`/bank-payment/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("BankPaymentDetailsList").value,
        }
      );
    }
    if (this.voucherType == "CASH_PMNT") {
      this.router.navigate(
        [`/cash-payment/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("CashPaymentDetailsList").value,
        }
      );
    }
    if (this.voucherType == "CASH_RCPT") {
      this.router.navigate(
        [`/cash-receipt/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("CashReceiptDetails").value,
        }
      );
    }
    if (this.voucherType == "JRNL") {
      this.router.navigate(
        [`/journal/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("Journaldetails").value,
        }
      );
    }
  }

  exportToCSV() {
    var fileName: string;
    var data = [];
    if (this.voucherType == "SALES") {
      data = this.form.get("InvoiceDetails").value;
      fileName = "Sales Invoice ";
    }
    if (this.voucherType == "JRNL") {
      data = this.form.get("Journaldetails").value;
      fileName = "Journal ";
    }
    if (this.voucherType == "CASH_RCPT") {
      data = this.form.get("CashReceiptDetails").value;
      fileName = "Cash Receipt ";
    }
    if (this.voucherType == "CASH_PMNT") {
      data = this.form.get("CashPaymentDetailsList").value;
      fileName = "Cash Payment ";
    }
    if (this.voucherType == "BANK_PMNT") {
      data = this.form.get("BankPaymentDetailsList").value;
      fileName = "Bank Payment ";
    }
    if (this.voucherType == "BANK_RCPT") {
      data = this.form.get("BankReceiptDetailsList").value;
      fileName = "Bank Receipt ";
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
    a.download = fileName + ".csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
