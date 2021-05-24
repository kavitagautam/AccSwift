import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
var adbs = require("ad-bs-converter");

@Injectable({
  providedIn: 'root'
})
export class DateConverterService {
  _api_URL=environment.baseAPI;

  constructor(
    private httpClientService: HttpClientService,
    private httlClient: HttpClient,
    private datePipe: DatePipe
  ) { }

  bsToAdInString(dateInBs)
  {
    dateInBs = this.dateStringFormatter(dateInBs); // because adbs only accepts yyyy/MM/dd format
    let dateObject = adbs.bs2ad(dateInBs);
    return `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
  }

  adToBsDateInString(dateInAd)
  {
    dateInAd = this.dateStringFormatter(dateInAd);
    let dateObject = adbs.ad2bs(dateInAd);
    return `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`
  }

  getNepali(date)
  {
    return `${date.en.year}/${parseInt(date.en.month) + 1}/${date.en.day}`;
  }
  
  getEnglish(date)
  {
    let dateInAd = this.dateStringFormatter(date);
    let dateObject = adbs.bs2ad(dateInAd);
    let dateEnglish = {
      year:dateObject.year,
      month: dateObject.month - 1,
      day: dateObject.day
    };
    return dateEnglish;
  }


  // formats yyyy-MM-dd to yyyy/MM/dd
  dateStringFormatter(dateInString)
  {
    let regex  = /-/gi;
    let result = dateInString.replace(regex, "/");
  }
}
