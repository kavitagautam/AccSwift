import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { CompoundUnitService } from "../../services/compound-unit.service";
import { CompoundUnit } from "../../models/compound.model";
import { throwToolbarMixedModesError } from "@angular/material";

@Component({
  selector: "accSwift-compound-unit",
  templateUrl: "./compound-unit.component.html",
  styleUrls: ["./compound-unit.component.scss"]
})
export class CompoundUnitComponent implements OnInit {
  compoundUnitForm: FormGroup;
  compoundUnitList: CompoundUnit[];
  listLoading: boolean;
  private toastr: ToastrService;
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  public filter: CompositeFilterDescriptor;
  filterList: Array<any> = [];
  compoundNameSearchKey = "";
  orderByKey = "";
  dirKey = "asc";
  modalRef: BsModalRef;
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];
  //For Modal Part
  modalTitle: string;
  submitButton: string;
  editableForm: boolean = false;
  editMode: boolean = false;
  compoundUnitId: number;

  constructor(
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public compoundUnitService: CompoundUnitService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildCompoundUnitForm();
    this.getCompoundUnits();
  }

  buildCompoundUnitForm() {
    this.compoundUnitForm = this._fb.group({
      FirstUnitID: ["1"],
      FirstUnitName: [null],
      SecondUnitID: [""],
      SecondUnitName: [null],
      RelationValue: [""],
      Remarks: [""]
    });
  }

  getCompoundUnits(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.filterList
    };
    this.compoundUnitService.getCompoundUnitList(obj).subscribe(
      response => {
        this.compoundUnitList = response.Entity.Entity;
        console.log(this.compoundUnitList);
        this.gridView = {
          data: this.compoundUnitList,
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

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getCompoundUnits();
  }

  public filterChange(filter): void {
    this.compoundNameSearchKey = "";
    if (filter.filters.length > 0) {
      const filterArray = [];
      filter.filters.forEach(function(item) {
        console.log(filter);
        filterArray.push({
          Field: item.field,
          Operator: item.operator,
          Value: item.value
        });
      });
      this.filterList = filterArray;
    }
    this.getCompoundUnits();
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
    this.getCompoundUnits();
  }

  openConfirmationDialogue(dataItem) {
    const compoundUnitId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Compound Unit";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteCompoundUnitById(compoundUnitId.id);
      }
    });
  }

  deleteCompoundUnitById(id): void {
    this.compoundUnitService.deleteCompoundUnitByID(id).subscribe(
      response => {
        this.getCompoundUnits();
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Compound Unit deleted successfully");
      }
    );
  }

  // Modal part started here
  openAddModal(template: TemplateRef<any>): void {
    this.compoundUnitForm.reset();
    this.modalTitle = "Add New Compound Unit";
    this.submitButton = "Save";
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(template: TemplateRef<any>, dataItem): void {
    this.editMode = true;
    this.modalTitle = "Edit Compound Unit";
    this.submitButton = "Save";
    dataItem["id"] = dataItem.ID;
    this.compoundUnitId = dataItem.ID;
    this.compoundUnitForm.patchValue(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitCompoundUnit(): void {
    if (this.compoundUnitForm.invalid) return;
    if (this.editMode === true) {
      this.editCompoundUnit();
    } else {
      this.addCompoundUnit();
    }
  }

  editCompoundUnit(): void {
    const obj = {
      ID: this.compoundUnitId,
      FirstUnitID: this.compoundUnitForm.get("FirstUnitID").value,
      FirstUnitName: this.compoundUnitForm.get("FirstUnitName").value,
      SecondUnitID: this.compoundUnitForm.get("SecondUnitID").value,
      SecondUnitName: this.compoundUnitForm.get("SecondUnitName").value,
      RelationValue: this.compoundUnitForm.get("RelationValue").value,
      Remarks: this.compoundUnitForm.get("Remarks").value
    };
    this.compoundUnitService.updateCompoundUnit(obj).subscribe(
      response => {
        console.log(response);
        this.router.navigate(["/compound-unit"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Compound Unit edited successfully");
      }
    );
  }

  addCompoundUnit(): void {
    const obj = {
      FirstUnitID: this.compoundUnitForm.get("FirstUnitID").value,
      FirstUnitName: this.compoundUnitForm.get("FirstUnitName").value,
      SecondUnitID: this.compoundUnitForm.get("SecondUnitID").value,
      SecondUnitName: this.compoundUnitForm.get("SecondUnitName").value,
      RelationValue: this.compoundUnitForm.get("RelationValue").value,
      Remarks: this.compoundUnitForm.get("Remarks").value
    };
    this.compoundUnitService.saveCompoundUnit(obj).subscribe(
      response => {
        this.router.navigate(["/compound-unit"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Compound unit added successfully");
      }
    );
  }

  close(): void {
    this.modalRef.hide();

    this.buildCompoundUnitForm();
  }
}
