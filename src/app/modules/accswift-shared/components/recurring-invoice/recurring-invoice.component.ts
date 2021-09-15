import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-recurring-invoice',
  templateUrl: './recurring-invoice.component.html',
  styleUrls: ['./recurring-invoice.component.scss']
})
export class RecurringInvoiceComponent implements OnInit {

  daily:boolean = true;
  everyday:boolean = true;
  weekly:boolean = false;
  monthly:boolean = false;
  yearly:boolean = false;
  
  constructor(public modalRef:BsModalRef) {}

  ngOnInit() {
  }

  dailyReoccur():void 
  {
    this.daily = true;
    this.everyday = true;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
  }

  weeklyReoccur():void 
  {
    this.daily = true;
    this.everyday = false;
    this.weekly = true;
    this.monthly = false;
    this.yearly = false;
  }

  monthlyReoccur():void 
  {
    this.daily = true;
    this.everyday = false;
    this.weekly = false;
    this.monthly = true;
    this.yearly = false;
  }

  yearlyReoccur():void 
  {
    this.daily = true;
    this.everyday = false;
    this.weekly = false;
    this.monthly = false;
    this.yearly = true;
  }

  onCancel():void {
    this.modalRef.hide();
  }

}
