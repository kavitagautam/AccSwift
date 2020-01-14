import { SeriesList } from "./../../bank-payment/models/bank-payment.model";
import { HttpParams } from "@angular/common/http";
import {
  SalesInvoiceMaster,
  ProjectList
} from "./../components/models/sales-invoice.model";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SalesInvoiceService {
  api = environment.baseAPI;
  seriesList: SeriesList;
  projectList: ProjectList;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getSeriesList();
    this.getProjectList();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SALES");
    this.httpService
      .get(`${this.api}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesList = res;
      });
  }

  getProjectList(): void {
    this.httpService.get(`${this.api}project`).subscribe((res: ProjectList) => {
      this.projectList = res;
    });
  }

  getSalesInvoiceMaster(): Observable<SalesInvoiceMaster> {
    return this.httpService.get(`${this.api}SalesInvoiceMaster`);
  }

  getSalesInvoiceDetails(id: any): Observable<SalesInvoiceMaster> {
    return this.httpService.get(`${this.api}SalesInvoiceMaster/${id}`);
  }
}
