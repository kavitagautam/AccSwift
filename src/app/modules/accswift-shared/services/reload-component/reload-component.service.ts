import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadComponentService {

  constructor() { }

  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  filter(filterBy:string) {
    console.log(filterBy);
    this._listners.next(filterBy);
    console.log(this._listners.next(filterBy));
  }
}
