import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";

@Injectable({
  providedIn: "root",
})
export class PurchaseReturnService {
  _api_URL = environment.baseAPI;
  projectList: Project[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectList = res.Entity;
      });
  }

  getPurchaseOrderMaster() {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster`);
  }

  getPurchaseOrderDetails(id: any) {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }
}
