import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { StockStatusList } from "../models/stock.models";
import { ReportsService } from "../../services/reports.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";

@Component({
  selector: "accSwift-stock-status",
  templateUrl: "./stock-status.component.html",
  styleUrls: ["./stock-status.component.scss"],
})
export class StockStatusComponent implements OnInit, AfterViewInit {
  stockStatusFroms: FormGroup;

  isActive;
  listLoading: boolean;
  projectName: string;

  stockStatusList: StockStatusList[] = [];
  totalQty: number;
  totalAmount: number;
  toDateSelect: number;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-md",
  };
  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildStockStatusForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openStockSettings(), 100);
  }

  buildStockStatusForms(): void {
    this.stockStatusFroms = this._fb.group({
      AccClassID: [""],
      ProductID: [{ value: null, disabled: true }],
      ProductGroupID: [{ value: null, disabled: true }],
      DepotID: [null],
      ToDate: [{ value: new Date(), disabled: true }],
      FromDate: [{ value: "", disabled: true }],
      ShowZeroQunatity: [false],
      ProjectID: [null],
      IsClosingQtyRange: [false],
      FromQtyRange: [""],
      IsFromRangeMin: [false],
      IsDateRange: [false],
      IsToRangeMax: [false],
      ToQtyRange: [""],
    });
  }

  openStockSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.stockStatusFroms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    // this.modalRef.content.projectName.subscribe((data) => {
    //   this.projectName = data;
    // });
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });
    //this.modalRef = this.modalService.show(template, this.config);

    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.listLoading = true;
        this.reportService.stockStatusReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.stockStatusList = response.Entity.Entity;
            this.totalQty = response.Entity.TotalClosingQty;
            this.totalAmount = response.Entity.TotalClosingAmount;
          },
          (error) => {
            this.listLoading = false;
          },
          () => {
            this.listLoading = false;
          }
        );
      }
    });

    this.modalRef.content.onClose.subscribe((data) => {
      this.showReport();
    });
  }

  showReport(): void {
    this.listLoading = true;
    this.reportService
      .stockStatusReports(this.stockStatusFroms.value)
      .subscribe(
        (response) => {
          this.stockStatusList = response.Entity.Entity;
          this.totalQty = response.Entity.TotalClosingQty;
          this.totalAmount = response.Entity.TotalClosingAmount;
        },
        (error) => {
          this.listLoading = false;
          this.modalRef.hide();
        },
        () => {
          this.listLoading = false;
          this.modalRef.hide();
        }
      );
  }

  cancel(): void {
    this.showReport();
  }
}
