import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  Product,
  ProductGroup,
  ProjectList,
  StockStatusList,
} from "../models/stock.models";
import { ReportsService } from "../../services/reports.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "accSwift-stock-status",
  templateUrl: "./stock-status.component.html",
  styleUrls: ["./stock-status.component.scss"],
})
export class StockStatusComponent implements OnInit {
  stockStatusFroms: FormGroup;
  @ViewChild("stockStatusSettings") stockStatusSettings;

  active: boolean;
  listLoading: boolean;
  productList: Product[];
  productGroupList: ProductGroup[];
  projectList: ProjectList[] = [];
  stockStatusList: StockStatusList[] = [];
  totalQty: number;
  totalAmount: number;
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
    private reportService: ReportsService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildStockStatusForms();
    this.getProduct();
    this.getProject();
    this.getProductGroup();
    this.modalRef = this.modalService.show(
      this.stockStatusSettings,
      this.config
    );
  }

  buildStockStatusForms(): void {
    this.stockStatusFroms = this._fb.group({
      ProductID: [null],
      ProductGroupID: [null],
      DepotID: [null],
      ToDate: [""],
      FromDate: [""],
      ShowZeroQunatity: [false],
      ProjectID: [null],
      IsClosingQtyRange: [false],
      FromQtyRange: [""],
      IsFromRangeMin: [false],
      IsToRangeMax: [false],
      ToQtyRange: [""],
    });
  }
  getProduct(): void {
    this.reportService.getProductMin().subscribe((response) => {
      this.productList = response.Entity;
    });
  }
  getProject(): void {
    this.reportService.getProjectLists().subscribe((response) => {
      this.projectList = response.Entity;
    });
  }

  getProductGroup(): void {
    this.reportService.getProductGroup().subscribe((response) => {
      this.productGroupList = response.Entity;
    });
  }
  allProduct(event): void {
    this.stockStatusFroms.get("ProductID").setValue(null);
    this.stockStatusFroms.get("ProductGroupID").setValue(null);
  }

  quantityRange(): void {
    this.stockStatusFroms.get("FromQtyRange").enable();
    this.stockStatusFroms.get("IsFromRangeMin").enable();
    this.stockStatusFroms.get("IsToRangeMax").enable();
    this.stockStatusFroms.get("ToQtyRange").enable();
  }

  openStockSettings(template: TemplateRef<any>): void {
    this.buildStockStatusForms();

    this.modalRef = this.modalService.show(template, this.config);
  }
  singleProduct(event): void {}
  productGroup(event): void {}

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
