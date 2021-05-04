import { Component, OnInit } from '@angular/core';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { BsModalRef } from 'ngx-bootstrap';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { DeliveryNotes } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';

@Component({
  selector: 'accSwift-list-delivery-notes',
  templateUrl: './list-delivery-notes.component.html',
  styleUrls: ['./list-delivery-notes.component.scss']
})
export class ListDeliveryNotesComponent implements OnInit {

  listLoading: Boolean;
  deliveryNotes: DeliveryNotes[];
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
    public deliveryNotesService: DeliveryNotesService
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
        this.deliveryNotes = response.Entity.Entity;
        console.log(JSON.stringify(this.deliveryNotes))
        this.gridView = {
          data: this.deliveryNotes,
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

}
