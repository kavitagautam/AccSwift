import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UnitMaintenanceService } from "../services/unit-maintenance.service";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { Units } from "../models/unit-maintenance.model";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-unit-maintenance",
  templateUrl: "./list-unit-maintenance.component.html",
  styleUrls: ["./list-unit-maintenance.component.scss"],
})
export class ListUnitMaintenanceComponent implements OnInit {
  unitForm: FormGroup;
  editableForm: boolean = false;
  editMode: boolean = false;
  submitted: boolean;
  listLoading: boolean;

  submitButton: string;
  modalTitle: string;
  unitsId: number;
  unitLists: Units[];
  filterList: Array<any> = [];
  searchFilterList: Array<any> = [];
  unitNameSearchKey = "";
  orderByKey = "";
  dirKey = "asc";

  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;

  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public unitService: UnitMaintenanceService
  ) {}

  ngOnInit() {
    this.buildUnitMaintenanceForm();
    this.getUnits();
  }

  buildUnitMaintenanceForm(): void {
    this.unitForm = this._fb.group({
      UnitName: this.editableForm ? ["", [Validators.required]] : [""],
      Symbol: this.editableForm ? ["", [Validators.required]] : [""],
      Remarks: [""],
    });
  }

  searchForm(): void {
    this.searchFilterList = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.unitForm.invalid) return;
    for (const key in this.unitForm.value) {
      if (this.unitForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.unitForm.value[key],
        });
      }
    }
    this.getUnits();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getUnits();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.unitNameSearchKey = "";
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filterArray = [];
      filter.filters.forEach(function (item) {
        filterArray.push({
          Field: item["field"],
          Operator: item["operator"],
          Value: item["value"],
        });
      });
      this.filterList = filterArray;
    } else {
      this.filterList = [];
    }
    this.getUnits();
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
    this.getUnits();
  }

  getUnits(): void {
    this.listLoading = true;
    const arrayFilter = this.searchFilterList.concat(this.filterList);
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: arrayFilter,
    };

    this.unitService.getUnitList(obj).subscribe(
      (response) => {
        this.unitLists = response.Entity.Entity;
        this.gridView = {
          data: this.unitLists,
          total: response.Entity.TotalItemsAvailable,
        };
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  openConfirmationDialogue(dataItem): void {
    const unitId = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Unit" + dataItem.UnitName;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteJournalByID(unitId.id);
      }
    });
  }

  public deleteJournalByID(id): void {
    this.unitService.deleteUnitById(id).subscribe(
      (response) => {
        this.getUnits();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Units deleted successfully");
      }
    );
  }

  // Modal part is started from Here
  openAddModal(template: TemplateRef<any>): void {
    this.editableForm = true;
    this.buildUnitMaintenanceForm();
    this.submitButton = "Save ";
    this.modalTitle = "New Unit";
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(template: TemplateRef<any>, dataItem): void {
    this.editableForm = true;
    this.editMode = true;
    this.buildUnitMaintenanceForm();
    this.submitButton = "Save ";
    this.modalTitle = "Edit " + dataItem.UnitName;
    this.unitsId = dataItem.ID;
    this.unitForm.patchValue(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitUnitMaintenance(): void {
    if (this.unitForm.invalid) return;
    if (this.editMode === true) {
      this.editUnitMaintenance();
    } else {
      this.addUnitMaintenance();
    }
  }

  editUnitMaintenance(): void {
    const obj = {
      ID: this.unitsId,
      UnitName: this.unitForm.get("UnitName").value,
      Symbol: this.unitForm.get("Symbol").value,
      Remarks: this.unitForm.get("Remarks").value,
    };
    this.unitService.updateUnit(obj).subscribe(
      (response) => {
        this.getUnits();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.buildUnitMaintenanceForm();
        this.toastr.success("Units edited successfully");
      }
    );
  }

  addUnitMaintenance(): void {
    const obj = {
      UnitName: this.unitForm.get("UnitName").value,
      Symbol: this.unitForm.get("Symbol").value,
      Remarks: this.unitForm.get("Remarks").value,
    };

    this.unitService.saveUnit(obj).subscribe(
      (response) => {
        this.getUnits();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.toastr.success("Units added successfully");
      }
    );
    this.getUnits();
  }

  close(): void {
    this.modalRef.hide();
    this.editableForm = false;
    this.buildUnitMaintenanceForm();
  }
}
