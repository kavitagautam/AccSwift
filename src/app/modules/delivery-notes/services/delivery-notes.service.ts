import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { DeliveryNotesNavigateRootModel, DeliveryNotesRootModel } from '../models/delivery-notes.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNotesService {
   _api_URL = environment.baseAPI;

  constructor( private httpService: HttpClientService,
    private http: HttpClient) { }


    getDeliveryNotesNavigate(body): Observable<DeliveryNotesNavigateRootModel> {
      return this.httpService.post(
        `${this._api_URL}DeliveryNotes/navigate`,
        body
      );
    }

    addDeliveryNotes(body): Observable<any> {
      return this.httpService.post(`${this._api_URL}DeliveryNotes`, body);
    }

    updateDeliveryNotes(body): Observable<any> {
      return this.httpService.put(`${this._api_URL}DeliveryNotes`, body);
    }

    getDeliveryNotesById(id: any): Observable<DeliveryNotesRootModel> {
      return this.httpService.get(`${this._api_URL}DeliveryNotes/${id}`);
    }
  }