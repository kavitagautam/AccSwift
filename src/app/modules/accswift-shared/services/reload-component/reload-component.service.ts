import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadComponentService {

  constructor() { }

  //Using Subject Observable
  // private _listners = new Subject<any>();
  // listen(): Observable<any> {
  //   return this._listners.asObservable();
  // }

  // filter(filterBy:string) {
  //   return this._listners.next(filterBy);
  // } 

  //Using Behaviour Subject
  public _listenEvent:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  onDataListen = () => {
    // alert("subscribe");
    return this._listenEvent.asObservable();
  }

  onDatafilter = (data)=> {
    // alert("data");
    return this._listenEvent.next(data);
  }
  

}
