import { DepotList } from "./../../models/depot.model";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { DepotService } from "../../services/depot.service";
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
  depotNameSearchKey = "";
  submitButton: string;
  submitted: Boolean;
  depotList: DepotList[];
  searchFilterList: Array<any> = [];
  filterList: Array<any> = [];
  listLoading: Boolean;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];
  modalRef: BsModalRef;
  config = {
    // modal config to unhide modal when clicked outside
    backdrop: true,
    ignoreBackdropClick: true
  };
  modalTitle: string;
  editMode: any;

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

  buildDepotForm() {
    this.depotForm = this._fb.group({
      DepotName: ["", [Validators.required]],
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
          Operator: "=",
          value: this.depotForm.value[key]
        });
      }
    }
    this.getDepotList();
  }

  public filterChange(filter): void {
    this.depotNameSearchKey = "";
    this.filter = filter;
    console.log(filter);
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

  // public edit(item): void {
  //   this.router.navigate(["/depot/edit", item.ID]);
  // }

  openConfirmationDialogue(dataItem): void {
    const depotId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Depot" + dataItem.depotId;
    this.modalRef.content.action = "delete";
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
    this.editMode = false;
    this.depotForm.reset();
    this.submitButton = "Create";
    this.modalTitle = "Add Depot";
    this.modalRef = this.modalService.show(template, this.config);
  }

  editDepotModal(template, dataItem) {
    this.editMode = true;
    this.modalTitle = "Edit Depot";
    this.submitButton = "Edit";
    dataItem["id"] = dataItem.dataItem_id;
    this.depotForm.patchValue(dataItem);
    console.log(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitDepot() {
    if (this.depotForm.invalid) return;
    if (this.editMode == true) {
      this.editDepotForm();
    } else {
      this.addDepotForm();
    }
  }

  editDepotForm() {
    this.depotService.updateDepot(this.depotForm.value).subscribe(
      response => {
        this.router.navigate(["/depot"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.errorMessage));
      },
      () => {
        this.toastr.success("Depot edited successfully");
      }
    );
  }

  addDepotForm() {
    this.depotService.saveDepot(this.depotForm.value).subscribe(
      response => {
        this.router.navigate(["/depot"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.errorMessage));
      },
      () => {
        this.toastr.success("Depot added successfully");
      }
    );
  }
}
