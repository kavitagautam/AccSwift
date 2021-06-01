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

  checkValidityADBS()
  {
    var testdate=document.getElementById('adToBs').value;
    console.log(testdate);
    var date_regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/ ;
    if(date_regex.test(testdate)) return 
    {
      console.log(this.getAdToBs(testdate));
      this.getAdToBs(testdate)
    }
  }

  checkValidityBSAD()
  {
    var testdate=document.getElementById('bsToAd').value;
    console.log(testdate);
    var date_regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/ ;
    if(date_regex.test(testdate)) return 
    {
      console.log(this.getBsToAd(testdate));
      this.getBsToAd(testdate)
    }
  }

  getAdToBs(inputValue)
  {
    // To convert AD to BS

    inputValue = this.datePipe.transform(inputValue, "yyyy/MM/dd");
    console.log(inputValue);
    let dateObject = adbs.ad2bs(inputValue);
    console.log(dateObject)
    let nepaliDate =  `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
    console.log(nepaliDate);
    this.journalVouchForm.get("Date").patchValue(nepaliDate);
    // document.getElementById("bsToAd").replaceWith(nepaliDate);
    document.getElementById('bsToAd').value = nepaliDate;
    return nepaliDate;
  }

  getBsToAd(inputValue)
  {
    //To convert BS to AD
  
    inputValue = this.datePipe.transform(inputValue, "yyyy/MM/dd");
    console.log(inputValue);
    let dateObject = adbs.bs2ad(inputValue);
    console.log(dateObject)
    let engDate =  `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    console.log(engDate);
    this.journalVouchForm.get("Date").patchValue(engDate);
    // document.getElementById("adToBs").replaceWith(engDate);
    document.getElementById('adToBs').value = engDate;
    return engDate;
  }
  

  public onCancel(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

}
