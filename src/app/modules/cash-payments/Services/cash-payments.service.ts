import { SeriesList, ProjectList } from "./../models/cash-payments.model";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CashReceiptMaster } from "@app/modules/cash-receipts/models/cash-receipt.model";

@Injectable({
  providedIn: "root"
})
export class CashPaymentsService {
  getCashPaymentDetails(getId: any) {
    throw new Error("Method not implemented.");
  }
  data = [
    {
      ID: 2,
      VoucherNo: "00004",
      JournalDate: "2018-09-10T00:00:00",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "oooo",
      CreatedBy: "root",
      CreatedDate: "2018-09-10T00:00:00",
      ModifiedBy: "root",
      ModifiedDate: "2018-09-10T00:00:00"
    },
    {
      ID: 1002,
      VoucherNo: "00008",
      JournalDate: "2018-09-21T00:00:00",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "root",
      CreatedDate: "2019-01-14T00:00:00",
      ModifiedBy: "root",
      ModifiedDate: "2019-01-14T00:00:00"
    },
    {
      ID: 2002,
      VoucherNo: "00048",
      JournalDate: "2019-01-14T13:14:20.89",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "1",
      CreatedDate: "2019-01-14T13:14:20.89",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2003,
      VoucherNo: "00049",
      JournalDate: "2019-01-16T17:29:14.623",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "0",
      CreatedDate: "2019-01-16T17:29:14.623",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2005,
      VoucherNo: "00051",
      JournalDate: "2019-01-16T17:33:09.937",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "1",
      CreatedDate: "2019-01-16T17:33:09.937",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2006,
      VoucherNo: "00052",
      JournalDate: "2019-01-16T17:35:24.43",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "1",
      CreatedDate: "2019-01-16T17:35:24.43",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2007,
      VoucherNo: "00053",
      JournalDate: "2019-01-16T17:37:51.313",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "1",
      CreatedDate: "2019-01-16T17:37:51.313",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2008,
      VoucherNo: "00054",
      JournalDate: "2019-01-16T17:38:27.29",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "1",
      CreatedDate: "2019-01-16T17:38:27.29",
      ModifiedBy: null,
      ModifiedDate: null
    },
    {
      ID: 2009,
      VoucherNo: "00090",
      JournalDate: "2019-09-12T00:00:00",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "",
      CreatedDate: "2019-09-12T00:00:00",
      ModifiedBy: "",
      ModifiedDate: "2019-09-12T00:00:00"
    },
    {
      ID: 2010,
      VoucherNo: "00092",
      JournalDate: "2019-09-12T00:00:00",
      SeriesID: 284,
      SeriesName: "Main",
      ProjectID: 1,
      ProjectName: "All Project",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      Series: {
        ID: 284,
        EngName: "Main",
        NepName: "Main",
        VoucherType: "JNL",
        AutoNumber: 128,
        BuiltIn: false
      },
      Project: {
        ID: 1,
        ProjectNumber: 1,
        ParentProjectID: null,
        EngName: "All Project",
        NepName: "All Project",
        Description: "",
        CreatedBy: "",
        CreatedDate: null,
        ModifiedBy: "admin",
        ModifiedDate: "2013-02-15T09:06:14.02"
      },
      Journaldetails: null,
      Remarks: "",
      CreatedBy: "",
      CreatedDate: "2019-09-12T00:00:00",
      ModifiedBy: "",
      ModifiedDate: "2019-09-12T00:00:00"
    }
  ];
  seriesLists: SeriesList;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
  }
  getCashPaymentsMaster() {
    // this.httpService
    //   .get(`${this._api_URL}project`)
    //   .subscribe((res: ProjectList) => {
    //     this.projectLists = res;
    //   });.

    return this.data;
  }
  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    this.httpService
      .get(`${this._api_URL}series/journal`)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }

  getCashRecipetDetails(id): Observable<CashReceiptMaster> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster/${id}`);
  }
}
