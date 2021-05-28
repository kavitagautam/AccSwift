import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { observable } from 'rxjs';
var adbs = require("ad-bs-converter");

@Component({
  selector: 'accSwift-date-converter',
  templateUrl: './date-converter.component.html',
  styleUrls: ['./date-converter.component.scss'],
  providers: [DatePipe]
})
export class DateConverterComponent implements OnInit {
   
  @Input() journalVouchForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private modalRef: BsModalRef,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {}

  getChangedDate(value)
  {
    //To send while save/submit Form
    // let date = this.dateConverter.adToBsInObject(
    //   this.journalVoucherForms.value.Date
    // );
    // let dateInEnglish = this.adToBsInStrng(date);
    // this.journalVoucherForms.get("Date").patchValue(dateInEnglish);
    // this.journalVoucherForms.value.Date = this.datePipe.transform(
    //   this.journalVoucherForms.value.Date,
    //   "yyyy-MM-dd"
    // );
    // console.log(dateInEnglish);


    //To convert AD to BS
    // value = this.datePipe.transform(value, "yyyy/MM/dd");
    // console.log(value);
    // let dateObject = adbs.ad2bs(value);
    // console.log(dateObject)
    // // this.journalVoucherForms.get("Date").patchValue(dateObject);
    // let resultDate =  `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
    // console.log(resultDate);
    // return resultDate;
    
    //To convert BS to AD
    value = this.datePipe.transform(value, "yyyy/MM/dd");
    console.log(value);
    let dateObject = adbs.bs2ad(value);
    console.log(dateObject)
    let resultDate =  `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    console.log(resultDate);
    this.journalVouchForm.get("Date").patchValue(resultDate);
    return resultDate;
  }


  // bsToAdInStrng(dateInBs)
  // {
  //   console.log(dateInBs);
  //   return this.dateConverter.bsToAdInString(dateInBs);
  // }

  // adToBsInStrng(dateInAd)
  // {
  //   console.log(dateInAd);
  //   return this.dateConverter.adToBsDateInString(dateInAd);
  // }


  public onCancel(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }


}
