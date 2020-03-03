import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { CompoundUnitService } from "../../services/compound-unit.service";
import { CompoundUnit } from "../../models/compound.model";

@Component({
  selector: "accSwift-compound-unit",
  templateUrl: "./compound-unit.component.html",
  styleUrls: ["./compound-unit.component.scss"]
})
export class CompoundUnitComponent implements OnInit {
  compoundUnitForm: FormGroup;
  compoundUnitList: CompoundUnit[];
  listLoading: boolean;
  modalTitle: string;
  submitButton: string;

  compoundUnitId: number;
  editableForm: boolean = false;
  editMode: boolean = false;
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  public filter: CompositeFilterDescriptor;
  filterList: Array<any> = [];
  filterArraySearch: Array<any> = [];
  compoundNameSearchKey = "";
  orderByKey = "";
  dirKey = "asc";

  modalRef: BsModalRef;
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-lg"
  };

  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  constructor(
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public compoundUnitService: CompoundUnitService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildCompoundUnitForm();
    this.getCompoundUnits();
  }

  buildCompoundUnitForm(): void {
    this.compoundUnitForm = this._fb.group({
      firstUnitValue: ["1"],
      FirstUnitID: this.editableForm ? ["", [Validators.required]] : [null],
      SecondUnitID: this.editableForm ? ["", [Validators.required]] : [null],
      RelationValue: this.editableForm ? ["", [Validators.required]] : [""],
      Remarks: [""]
    });
  }

  getCompoundUnits(): void {
    this.listLoading = true;
    const arrayFilter = this.filterArraySearch.concat(this.filterList);
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: arrayFilter
    };
    this.compoundUnitService.getCompoundUnitList(obj).subscribe(
      response => {
        this.compoundUnitList = response.Entity.Entity;
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

  searchForm(): void {
    this.filterArraySearch = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.compoundUnitForm.invalid) return;
    for (const key in this.compoundUnitForm.value) {
      if (this.compoundUnitForm.value[key]) {
        this.filterArraySearch.push({
          Field: key,
          Operator: "contains",
          Value: this.compoundUnitForm.value[key]
        });
      }
    }
    this.getCompoundUnits();
  }

  public filterChange(filter): void {
    this.compoundNameSearchKey = "";
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filterArray = [];
      filter.filters.forEach(function(item) {
        filterArray.push({
          Field: item.field,
          Operator: item.operator,
          Value: item.value
        });
      });
      this.filterList = filterArray;
    } else {
      this.filterList = [];
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

  openConfirmationDialogue(dataItem): void {
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
    this.editableForm = true;
    this.buildCompoundUnitForm();
    this.modalTitle = "New Unit";
    this.submitButton = "Save";
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(template: TemplateRef<any>, dataItem): void {
    this.editMode = true;
    this.editableForm = true;
    this.buildCompoundUnitForm();
    this.modalTitle = "Edit " + dataItem.FirstUnitName;
    this.submitButton = "Save";
    this.compoundUnitId = dataItem.ID;
    this.compoundUnitForm
      .get("RelationValue")
      .patchValue(dataItem.RelationValue);
    this.compoundUnitForm.get("FirstUnitID").patchValue(dataItem.FirstUnitID);
    this.compoundUnitForm.get("SecondUnitID").patchValue(dataItem.SecondUnitID);
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
      SecondUnitID: this.compoundUnitForm.get("SecondUnitID").value,
      RelationValue: this.compoundUnitForm.get("RelationValue").value,
      Remarks: this.compoundUnitForm.get("Remarks").value
    };
    this.compoundUnitService.updateCompoundUnit(obj).subscribe(
      response => {
        this.getCompoundUnits();
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.buildCompoundUnitForm();
        this.toastr.success("Compound Unit edited successfully");
      }
    );
  }

  addCompoundUnit(): void {
    const obj = {
      FirstUnitID: this.compoundUnitForm.get("FirstUnitID").value,
      SecondUnitID: this.compoundUnitForm.get("SecondUnitID").value,
      RelationValue: this.compoundUnitForm.get("RelationValue").value,
      Remarks: this.compoundUnitForm.get("Remarks").value
    };
    this.compoundUnitService.saveCompoundUnit(obj).subscribe(
      response => {
        this.getCompoundUnits();
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.toastr.success("Compound unit added successfully");
      }
    );
  }

  close(): void {
    this.modalRef.hide();
    this.editableForm = false;
    this.buildCompoundUnitForm();
  }
}
