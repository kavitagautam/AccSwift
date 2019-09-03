import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private _url = "http://accswift.bentrayhosting.com/journalmaster";
  
  constructor(private http: HttpClient) { }

  
  
  getMasterJournal(){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
       }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };
    console.log("Service Called ");

    this.http.get(this._url, {headers: headerDict}).subscribe((res)=>{
      console.log(res);
  });
 // return this.http.get(this._url, {headers: headerDict });
  }
}
