import { SalesInvoiceMaster } from './../components/models/sales-invoice.model';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from './../../../core/services/http-client/http-client.service';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceService {
  api = environment.baseAPI;
  constructor(private httpService: HttpClientService,
    private http: HttpClient) { }

  getSalesInvoiceMaster(): Observable<SalesInvoiceMaster> {
    return this.httpService.get(`${this.api}SalesInvoiceMaster`);
  }

  getSalesInvoiceDetails(id: any): Observable<SalesInvoiceMaster> {
    return this.httpService.get(`${this.api}SalesInvoiceMaster/${id}`);
  }
}
