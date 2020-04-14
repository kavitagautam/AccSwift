import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SalesReturnService {
  api = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getSalesReturnMaster() {
    return this.httpService.get(`${this.api}SalesInvoiceMaster`); //SalesInvoiceMaster is subjected to change.....
  }

  getSalesReturnDetails(id: any) {
    return this.http.get(`${this.api}SalesInvoiceMaster/${id}`); //SalesInvoiceMaster is subjected to change.....
  }
}
