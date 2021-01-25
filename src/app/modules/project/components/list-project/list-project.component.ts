import { Component, OnInit, TemplateRef } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { ProjectService } from "@accSwift-modules/project/services/project.service";
import { Project } from "@accSwift-modules/accswift-shared/models/project.model";
@Component({
  selector: "accSwift-list-project",
  templateUrl: "./list-project.component.html",
  styleUrls: ["./list-project.component.scss"],
})
export class ListProjectComponent implements OnInit {
  projectMinList: Project[] = [];
  projectList: Project[] = [];
  projectForm: FormGroup;
  projectID: number;
  listLoading: boolean;
  editMode: boolean = false;
  editableMode: boolean = false;
  submitted: boolean;
  public allowUnsort = true;

  submitButton: string;
  modalTitle: string;

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
      dir: "asc",
    },
  ];

  //sorting kendo data

  modalRef: BsModalRef;
  config = {
    // modal config to unhide modal when clicked outside
    backdrop: true,
    ignoreBackdropClick: true,
  };
  constructor(
    private _fb: FormBuilder,
    public projectService: ProjectService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getProjectList();
    this.buildProjectForm();
    this.getProjectDDLists();
  }

  buildProjectForm(): void {
    this.projectForm = this._fb.group({
      ID: [null],
      EngName: this.editableMode ? ["", [Validators.required]] : [""],
      ParentProjectID: this.editableMode
        ? [null, [Validators.required]]
        : [null],
      Description: [""],
    });
  }

  getProjectList(): void {
    this.listLoading = true;
    // const filterArray = this.searchFilterList.concat(this.filterList);
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: [],
    };

    this.projectService.getProjectList(obj).subscribe(
      (response) => {
        this.projectList = response.Entity.Entity;
        this.gridView = {
          data: this.projectList,
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

  public filterChange(filter): void {
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filtersArray = [];
      filter.filters.forEach(function (item) {
        filtersArray.push({
          Field: item.field,
          Operator: item.operator,
          Value: item.value,
        });
      });
      this.filterList = filtersArray;
    }
    this.getProjectList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getProjectList();
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
    this.getProjectList();
  }

  getProjectDDLists(): void {
    this.projectService.getProjectDropDown().subscribe((response) => {
      this.projectMinList = response.Entity;
    });
  }

  openConfirmationDialogue(dataItem): void {
    const projectID = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Project " + dataItem.projectID;
    this.modalRef.content.action = "delete ";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteDepotById(projectID.id);
      }
    });
  }

  public deleteDepotById(id): void {
    this.projectService.deleteProjectById(id).subscribe(
      (response) => {
        this.getProjectList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Depot deleted successfully");
      }
    );
  }

  // Modal Part......//

  addProjectModal(template: TemplateRef<any>): void {
    this.editableMode = true;
    this.buildProjectForm();
    this.submitButton = "Save ";
    this.modalTitle = "New Project ";
    this.modalRef = this.modalService.show(template, this.config);
  }

  editProjectModal(template, dataItem): void {
    this.editMode = true;
    this.editableMode = true;
    this.buildProjectForm(); // initializing the form to make the validation work
    this.modalTitle = "Edit  " + dataItem.EngName;
    this.submitButton = "Save ";
    this.projectID = dataItem.ID;
    this.projectForm.patchValue(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitProject(): void {
    if (this.projectForm.invalid) return;
    if (this.editMode == true) {
      this.editProjectForm();
    } else {
      this.addProjectForm();
    }
  }

  editProjectForm(): void {
    this.projectService
      .updateProject(this.projectForm.value, this.projectID)
      .subscribe(
        (response) => {
          this.getProjectList();
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.errorMessage));
        },
        () => {
          this.modalRef.hide();
          this.buildProjectForm();
          this.toastr.success("Project edited successfully");
        }
      );
  }

  addProjectForm(): void {
    this.projectService.saveProject(this.projectForm.value).subscribe(
      (response) => {
        this.getProjectList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.errorMessage));
      },
      () => {
        this.modalRef.hide();
        this.toastr.success("Project added successfully");
      }
    );
  }

  onCancel(): void {
    this.modalRef.hide();
    this.editableMode = false;
    this.buildProjectForm();
  }
}
