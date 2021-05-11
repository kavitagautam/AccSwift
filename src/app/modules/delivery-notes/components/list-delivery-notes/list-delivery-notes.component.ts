import { Component, OnInit } from '@angular/core';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { DeliveryNoteList } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'accSwift-list-delivery-notes',
  templateUrl: './list-delivery-notes.component.html',
  styleUrls: ['./list-delivery-notes.component.scss']
})
export class ListDeliveryNotesComponent implements OnInit {

  listLoading: Boolean;
  deliveryNoteList: DeliveryNoteList[];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  //sorting Kendo Data
  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  searchFilterList = [];
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    public deliveryNotesService: DeliveryNotesService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getDeliveryNotesList();
  }

  getDeliveryNotesList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    this.deliveryNotesService.getDeliveryNotesNavigate(obj).subscribe(
      (response) => {
        this.deliveryNoteList = response.Entity.Entity;
        console.log(JSON.stringify(this.deliveryNoteList))
        this.gridView = {
          data: this.deliveryNoteList,
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


  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getDeliveryNotesList();
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
    this.getDeliveryNotesList();
  }

  edit(item): void
  {
    this.router.navigate(["/delivery-notes/edit", item.ID]);
  }

  openConfirmationDialog(item): void 
  {
    const deliveryNotesID = { id:item.ID }
    this.modalRef = this.modalService.show(ConfirmationDialogComponent, this.config);
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteDeliveryNotes(deliveryNotesID.id);
      }
    });
  }

  deleteDeliveryNotes(id): void {
    this.deliveryNotesService.deleteDeliveryNotesById(id).subscribe(
      (response) => {
        this.getDeliveryNotesList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Invoice deleted successfully");
        this.getDeliveryNotesList();
      }
    );
  }

}
