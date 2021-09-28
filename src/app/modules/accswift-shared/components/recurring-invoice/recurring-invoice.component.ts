import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-recurring-invoice',
  templateUrl: './recurring-invoice.component.html',
  styleUrls: ['./recurring-invoice.component.scss']
})
export class RecurringInvoiceComponent implements OnInit {

  reoccuranceForm: FormGroup;
  daily:boolean = true;
  everyday:boolean = true;
  weekly:boolean = false;
  monthly:boolean = false;
  yearly:boolean = false;
  
  constructor(public modalRef:BsModalRef, public _fb: FormBuilder) {}

  ngOnInit() {
   this.buildReoccuranceForm();
  }

  buildReoccuranceForm(): void {
    this.reoccuranceForm = this._fb.group({
      StartDate: [new Date()],
      EndDate: [new Date()],
      NeverEnd: []
    });
  }

  dailyReoccur():void 
  {
    this.daily = true;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
  }

  weeklyReoccur():void 
  {
    this.daily = true;
    this.weekly = true;
    this.monthly = false;
    this.yearly = false;
  }

  monthlyReoccur():void 
  {
    this.daily = true;
    this.weekly = false;
    this.monthly = true;
    this.yearly = false;
  }

  yearlyReoccur():void 
  {
    this.daily = true;
    this.weekly = false;
    this.monthly = false;
    this.yearly = true;
  }

  neverEnd():void {
    if (this.reoccuranceForm.get("NeverEnd").value)
    {
      this.reoccuranceForm.get("EndDate").enable();
    }
    else {
      this.reoccuranceForm.get("EndDate").reset();
      this.reoccuranceForm.get("EndDate").disable();
    }
  }

  onCancel():void {
    this.modalRef.hide();
  }

}
