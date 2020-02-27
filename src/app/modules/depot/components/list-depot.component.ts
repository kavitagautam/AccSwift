import { DepotList } from "../models/depot.model";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { DepotService } from "../services/depot.service";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";

@Component({
  selector: "accSwift-list-depot",
  templateUrl: "./list-depot.component.html",
  styleUrls: ["./list-depot.component.scss"]
})
export class ListDepotComponent implements OnInit {
  depotForm: FormGroup;
  editMode: boolean = false;
  depotMode: boolean = false;
  listLoading: boolean;
  submitted: boolean;
  public allowUnsort = true;

  submitButton: string;
  modalTitle: string;

  depotList: DepotList[];
  searchFilterList: Array<any> = [];
  filterList: Array<any> = [];

  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  orderByKey = "";
  depotNameSearchKey = "";
  dirKey = "asc";
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  //sorting kendo data

  modalRef: BsModalRef;
  config = {
    // modal config to unhide modal when clicked outside
    backdrop: true,
    ignoreBackdropClick: true
  };
  depotID: any;

  constructor(
    private _fb: FormBuilder,
    public depotService: DepotService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildDepotForm();
    this.getDepotList();
  }

  buildDepotForm(): void {
    this.depotForm = this._fb.group({
      DepotName: this.depotMode ? ["", [Validators.required]] : [""],
      City: [""],
      Telephone: [""],
      ContactPerson: [""],
      LicenceNo: [""],
      DepotAddress: [""],
      PostalCode: [""],
      Mobile: [""],
      RegNo: [""],
      Remarks: [""]
    });
  }

  searchForm(): void {
    this.searchFilterList = [];
    if (this.depotForm.invalid) return;
    for (const key in this.depotForm.value) {
      if (this.depotForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.depotForm.value[key]
        });
      }
    }
    this.getDepotList();
  }

  public filterChange(filter): void {
    this.depotNameSearchKey = "";
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filtersArray = [];
      filter.filters.forEach(function(item) {
        filtersArray.push({
          Field: item.field,
          Operator: item.operator,
          Value: item.value
        });
      });
      this.filterList = filtersArray;
    }
    this.getDepotList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getDepotList();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    if (event.skip == 0) {
      this.skip = event.skip;
      this.currentPage = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.currentPage = pageNo;
    }
    this.getDepotList();
  }

  getDepotList(): void {
    this.listLoading = true;
    const filterArray = this.searchFilterList.concat(this.filterList);
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: filterArray
    };

    this.depotService.getDepotList(obj).subscribe(
      response => {
        this.depotList = response.Entity.Entity;
        this.gridView = {
          data: this.depotList,
          total: response.Entity.TotalItemsAvailable
        };
      },
      error => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  openConfirmationDialogue(dataItem): void {
    const depotId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Depot " + dataItem.depotId;
    this.modalRef.content.action = "delete ";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteDepotById(depotId.id);
      }
    });
  }

  public deleteDepotById(id): void {
    this.depotService.deleteDepotById(id).subscribe(
      response => {
        this.getDepotList();
      },
      error => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Depot deleted successfully");
      }
    );
  }

  // Modal Part......//

  addDepotModal(template: TemplateRef<any>): void {
    this.depotMode = true;
    this.depotForm.reset();
    this.submitButton = "Save ";
    this.modalTitle = "Add Depot ";
    this.modalRef = this.modalService.show(template, this.config);
  }

  editDepotModal(template, dataItem): void {
    this.editMode = true;
    this.depotMode = true;
    this.modalTitle = "Edit Depot ";
    this.submitButton = "Save ";
    dataItem["id"] = dataItem.ID;
    this.depotID = dataItem.ID;
    this.depotForm.patchValue(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitDepot(): void {
    if (this.depotForm.invalid) return;
    if (this.editMode == true) {
      this.editDepotForm();
    } else {
      this.addDepotForm();
    }
  }

  editDepotForm(): void {
    const obj = {
      ID: this.depotID,
      DepotName: this.depotForm.get("DepotName").value,
      City: this.depotForm.get("City").value,
      Telephone: this.depotForm.get("Telephone").value,
      ContactPerson: this.depotForm.get("ContactPerson").value,
      LicenceNo: this.depotForm.get("LicenceNo").value,
      DepotAddress: this.depotForm.get("DepotAddress").value,
      PostalCode: this.depotForm.get("PostalCode").value,
      Mobile: this.depotForm.get("Mobile").value,
      RegNo: this.depotForm.get("RegNo").value,
      Remarks: this.depotForm.get("Remarks").value
    };
    this.depotService.updateDepot(obj).subscribe(
      response => {
        this.router.navigate(["/depot"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.errorMessage));
      },
      () => {
        this.modalRef.hide();
        this.depotForm.reset();
        this.toastr.success("Depot edited successfully");
        this.getDepotList();
      }
    );
  }

  addDepotForm(): void {
    this.depotService.saveDepot(this.depotForm.value).subscribe(
      response => {
        this.router.navigate(["/depot"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.errorMessage));
      },
      () => {
        this.modalRef.hide();
        this.toastr.success("Depot added successfully");
        this.getDepotList();
      }
    );
  }

  onCancel(): void {
    this.modalRef.hide();
    this.depotMode = false;
    this.buildDepotForm();
  }
}
