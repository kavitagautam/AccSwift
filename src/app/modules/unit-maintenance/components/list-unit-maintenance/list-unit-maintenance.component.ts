import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { UnitMaintenanceService } from "../../services/unit-maintenance.service";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { Units } from "../../models/unit-maintenance.model";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-unit-maintenance",
  templateUrl: "./list-unit-maintenance.component.html",
  styleUrls: ["./list-unit-maintenance.component.scss"]
})
export class ListUnitMaintenanceComponent implements OnInit {
  unitSearchForm: FormGroup;
  unitLists: Units[];
  filterList: Array<any> = [];
  searchFilterList: Array<any> = [];

  unitNameSearchKey = "";
  orderByKey = "";
  dirKey = "asc";
  listLoading: boolean;
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
      dir: "asc"
    }
  ];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
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
    this.unitSearchForm = this._fb.group({
      unit: [""],
      symbol: [""],
      remarks: [""]
    });
  }

  searchForm(): void {
    if (this.unitSearchForm.invalid) return;
    if (this.unitSearchForm.get("unit").value) {
      this.searchFilterList.push({
        Field: "UnitName",
        Operator: "=",
        Value: this.unitSearchForm.get("unit").value
      });

      if (this.unitSearchForm.get("symbol").value) {
        this.searchFilterList.push({
          Field: "Symbol",
          Operator: "=",
          Value: this.unitSearchForm.get("symbol").value
        });
      }

      if (this.unitSearchForm.get("remarks").value) {
        this.searchFilterList.push({
          Field: "Remarks",
          Operator: "=",
          Value: this.unitSearchForm.get("remarks").value
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

  public filterChange(filter): void {
    this.unitNameSearchKey = "";
    if (filter.filters.length > 0) {
      const filters = [];
      filter.filters.forEach(function(item) {
        filters.push({
          Field: item.field,
          Operator: item.operator,
          Value: item.value
        });
      });
      this.filterList = filters;
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
      FilterList: arrayFilter
    };
    this.unitService.getUnitList(obj).subscribe(
      response => {
        this.unitLists = response.Entity.Entity;
        this.gridView = {
          data: this.unitLists,
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

  public editUnit(item): void {
    this.router.navigate(["/unit-maintenance/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem): void {
    const unitId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Unit" + dataItem.UnitName;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteJournalByID(unitId.id);
      }
    });
  }

  public deleteJournalByID(id): void {
    this.unitService.deleteUnitById(id).subscribe(
      response => {
        this.getUnits();
      },
      error => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Units deleted successfully");
      }
    );
  }
}
