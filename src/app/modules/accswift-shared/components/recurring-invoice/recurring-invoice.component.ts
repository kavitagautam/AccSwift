import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-recurring-invoice',
  templateUrl: './recurring-invoice.component.html',
  styleUrls: ['./recurring-invoice.component.scss']
})
export class RecurringInvoiceComponent implements OnInit {

  constructor(public modalRef:BsModalRef) {}

  ngOnInit() {
  }

  onCancel():void {
    this.modalRef.hide();
  }

}
