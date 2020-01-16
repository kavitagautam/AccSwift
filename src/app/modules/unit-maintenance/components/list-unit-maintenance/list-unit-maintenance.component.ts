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
  unitNameSearchKey = "";
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

  getUnits(): void {
    this.listLoading = true;
    this.unitService.getUnitList().subscribe(
      response => {
        this.unitLists = response;
        this.gridView = {
          data: this.unitLists,
          total: this.unitLists ? this.unitLists.length : 0
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

  buildUnitMaintenanceForm(): void {
    this.unitSearchForm = this._fb.group({
      unit: [""],
      symbol: [""],
      remarks: [""]
    });
  }

  searchForm(): void {
    if (this.unitSearchForm.invalid) return;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.getUnits();
  }

  public filterChange(filter): void {
    this.unitNameSearchKey = "";

    this.filter = filter;
    for (let i = 0; i < filter.filters.length; i++) {
      if (filter.filters[i].field == "UnitName") {
        this.unitNameSearchKey = filter.filters[i].value;
      }
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
