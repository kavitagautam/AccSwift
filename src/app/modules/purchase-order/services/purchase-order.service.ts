import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ProjectList } from '../models/purchase-order.model';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  _api_URL = environment.baseAPI;
  projectList: ProjectList;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
   }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectList = res;
      });
  }

  getPurchaseOrderMaster(){
    return this.httpService.get(
      `${this._api_URL}PurchaseInvoiceMaster`
    );
  }

  getPurchaseOrderDetails(id: any)  {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }
}