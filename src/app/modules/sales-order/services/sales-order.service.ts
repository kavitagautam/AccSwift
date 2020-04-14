import { SalesOrderMaster } from "./../components/models/list-sales-order.model";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SalesOrderService {
  api = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getSalesOrderMaster() {
    return this.httpService.get(`${this.api}SalesInvoiceMaster`);
  }

  getSalesOrderDetails(id): Observable<SalesOrderMaster> {
    return this.httpService.get(`${this.api}SalesOrderDetails/${id}`);
  }
}
