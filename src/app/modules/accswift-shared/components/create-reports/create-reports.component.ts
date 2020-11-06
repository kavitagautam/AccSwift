import { Component, OnInit, Input, Inject } from "@angular/core";
import { environment } from "@env/environment";
import { IconConst } from "@app/shared/constants/icon.constant";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { SalesInvoiceService } from "@accSwift-modules/sales-invoice/services/sales-invoice.service";
import { HttpResponse } from "@angular/common/http";
import { saveAs } from "file-saver";
import { DOCUMENT } from "@angular/common";

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
  constructor(
    private router: Router,
    private salesInvoiceService: SalesInvoiceService,
    @Inject(DOCUMENT) private document: Document
  ) {
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
      localStorage.setItem(
        "invoices",
        JSON.stringify(this.form.get("InvoiceDetails").value)
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
    if (this.voucherType == "PURCH") {
      this.router.navigate(
        [`/purchase-invoice/edit/${this.form.get("ID").value}/invoice-billing`],
        {
          state: this.form.get("PurchInvoiceDetails").value,
        }
      );
      localStorage.setItem(
        "purchInvoices",
        JSON.stringify(this.form.get("PurchInvoiceDetails").value)
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

  downloadPDF(): void {
    if (this.voucherType == "SALES") {
      this.salesInvoiceService
        .getSalesInvoicePDF(this.form.get("ID").value)
        .subscribe((response) => {
          var url = response.Entity;
          // var url = "http://api.accswift.com/sales_invoice_15321.pdf";
          //  saveAs(url, "salesInvoive.pdf");

          window.open(url, "_blank");
          //  window.print();
          //      window.close();

          // const link = this.document.createElement("a");
          // link.target = "_blank";
          // link.href = url;
          // link.click();
          // link.remove();
          console.log("url " + JSON.stringify(url));
          // var xhr = new XMLHttpRequest();
          // xhr.open("GET", url, true);
          // xhr.responseType = "blob";
          // xhr.onload = function () {
          //   var file = new Blob([xhr.response], { type: "application/pdf" });
          //   saveAs(file, "invoice.pdf");
          // };
          // xhr.send();
        });
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
    if (this.voucherType == "PURCH") {
      data = this.form.get("PurchInvoiceDetails").value;
      fileName = "Purchase Invoice ";
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
