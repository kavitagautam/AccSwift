import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { environment } from "./../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PurchaseInvoiceMaster } from "./../models/purchase-invoice.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PurchaseInvoiceService {
  apiUrl = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) { }

  getPurchaseInvoiceMaster(): Observable<PurchaseInvoiceMaster[]> {
    return this.http.get<PurchaseInvoiceMaster[]>(
      `${this.apiUrl}PurchaseInvoiceMaster`
    );
  }

  getPurchaseInvoiceDetails(id: any): Observable<PurchaseInvoiceMaster> {
    return this.httpService.get(`${this.apiUrl}PurchaseInvoiceMaster/${id}`);
  }
}
