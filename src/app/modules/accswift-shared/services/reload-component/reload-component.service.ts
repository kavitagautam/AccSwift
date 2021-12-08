import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

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
    return this._listenEvent.asObservable();
  }

  onDatafilter = (data)=> {
    return this._listenEvent.next(data);
  }

  

}
