import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateConverterService } from '@app/shared/services/dateConverter/date-converter.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
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
  public selectedDate:string ='';

  constructor(
    private _fb: FormBuilder,
    private modalRef: BsModalRef,
    public datePipe: DatePipe,
    public dateConverterService: DateConverterService,
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit() {this.selectedDate= this.localStorageService.getLocalStorageItem(
    "SelectedDate");}

  checkValidityADBS()
  {
    var testdate=(document.getElementById('adToBs')as HTMLInputElement).value;
    console.log(testdate);
    var date_regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/ ;
    if(date_regex.test(testdate)) return 
    {
      this.getAdToBs(testdate);
    }
  }

  checkValidityBSAD()
  {
    var testdate=(document.getElementById('bsToAd')as HTMLInputElement).value;
    console.log(testdate);
    var date_regex = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/ ;
    if(date_regex.test(testdate)) return 
    {
      this.getBsToAd(testdate);
    }
  }

  getAdToBs(inputValue)
  {
    // To convert AD to BS

    inputValue = this.datePipe.transform(inputValue, "yyyy/MM/dd");
    console.log(inputValue);
    let dateObject = adbs.ad2bs(inputValue);
    console.log(dateObject);
    var monthPad = dateObject.en.month;
    var monthPadded = monthPad.toString().padStart(2,0);
    var dayPad = dateObject.en.day;
    var dayPadded = dayPad.toString().padStart(2,0);
    let nepaliDate =  `${dateObject.en.year}-${monthPadded}-${dayPadded}`;
    console.log(nepaliDate);
    // this.journalVouchForm.get("Date").patchValue(nepaliDate);
    // document.getElementById("bsToAd").replaceWith(nepaliDate);
    (document.getElementById('bsToAd') as HTMLInputElement).value = nepaliDate;
    return nepaliDate;
  }

  getBsToAd(inputValue)
  {
    //To convert BS to AD
  
    inputValue = this.datePipe.transform(inputValue, "yyyy/MM/dd");
    console.log(inputValue);
    let dateObject = adbs.bs2ad(inputValue);
    console.log(dateObject);
    var monthPad = dateObject.month;
    var monthPadded = monthPad.toString().padStart(2,0);
    var dayPad = dateObject.day;
    var dayPadded = dayPad.toString().padStart(2,0);
    let engDate =  `${dateObject.year}-${monthPadded}-${dayPadded}`;
    console.log(engDate);
    // this.journalVouchForm.get("Date").patchValue(engDate);
    // document.getElementById("adToBs").replaceWith(engDate);
    // document.getElementById('adToBs').value = engDate;
    (document.getElementById('adToBs') as HTMLInputElement).value = engDate;
    return engDate;
  }
  
  public onOkay() {
    if (this.selectedDate == 'Nepali')
    {
      this.journalVouchForm.get("Date").patchValue((document.getElementById('bsToAd')as HTMLInputElement).value);
    }
    else if (this.selectedDate == 'English')
    {
      this.journalVouchForm.get("Date").patchValue((document.getElementById('adToBs')as HTMLInputElement).value);
    }
    this.modalRef.hide();
    this.modalRef = null;
  }

  public onCancel(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

}
