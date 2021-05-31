import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateConverterService } from '@app/shared/services/dateConverter/date-converter.service';
import { BsModalRef, isDateValid } from 'ngx-bootstrap';
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
    public datePipe: DatePipe,
    public dateConverterService: DateConverterService
  ) { }

  ngOnInit() {
    console.log(this.journalVouchForm.value.Date)
  }

  getAdToBs(value)
  {
    // To convert AD to BS

    value = this.datePipe.transform(value, "yyyy/MM/dd");
    console.log(value);
    let dateObject = adbs.ad2bs(value);
    console.log(dateObject)
    let nepaliDate =  `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
    console.log(nepaliDate);
    this.journalVouchForm.get("Date").patchValue(nepaliDate);
    return nepaliDate;
  }

  getBsToAd(value)
  {
    //To convert BS to AD
  
    value = this.datePipe.transform(value, "yyyy/MM/dd");
    console.log(value);
    let dateObject = adbs.bs2ad(value);
    console.log(dateObject)
    let engDate =  `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    console.log(engDate);
    this.journalVouchForm.get("Date").patchValue(engDate);
    return engDate;
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

  //To send while save/submit Form
    // let converted = this.datePipe.transform(nepaliDate,"yyyy/MM/dd");
    // let var1 = adbs.bs2ad(converted);
    // let var2 = `${var1.year}-${var1.month}-${var1.day}`
    // this.journalVouchForm.get("Date").patchValue(var2);
    // console.log(var2);


    // let date = this.dateConverterService.adToBsInObject(
    //   this.journalVoucherForms.value.Date
    // );
    // let dateInEnglish = this.adToBsInStrng(date);
    // this.journalVoucherForms.get("Date").patchValue(dateInEnglish);
    // this.journalVoucherForms.value.Date = this.datePipe.transform(
    //   this.journalVoucherForms.value.Date,
    //   "yyyy-MM-dd"
    // );
    // console.log(dateInEnglish);


}
