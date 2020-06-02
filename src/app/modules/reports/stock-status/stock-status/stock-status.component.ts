import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  Product,
  ProductGroup,
  ProjectList,
  StockStatusList,
  AccountClass,
} from "../models/stock.models";
import { ReportsService } from "../../services/reports.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "accSwift-stock-status",
  templateUrl: "./stock-status.component.html",
  styleUrls: ["./stock-status.component.scss"],
})
export class StockStatusComponent implements OnInit, AfterViewInit {
  stockStatusFroms: FormGroup;
  @ViewChild("stockStatusSettings") stockStatusSettings;

  isActive;
  listLoading: boolean;
  productList: Product[];
  productGroupList: ProductGroup[];
  projectList: ProjectList[] = [];
  stockStatusList: StockStatusList[] = [];
  accountLists: AccountClass[];
  totalQty: number;
  totalAmount: number;
  toDateSelect: number;
  monthList = [
    {
      name: "January",
      short: "Jan",
      number: 1,
    },
    {
      name: "February",
      short: "Feb",
      number: 2,
    },
    {
      name: "March",
      short: "Mar",
      number: 3,
    },
    {
      name: "April",
      short: "Apr",
      number: 4,
    },
    {
      name: "May",
      short: "May",
      number: 5,
    },
    {
      name: "June",
      short: "Jun",
      number: 6,
    },
    {
      name: "July",
      short: "Jul",
      number: 7,
    },
    {
      name: "August",
      short: "Aug",
      number: 8,
    },
    {
      name: "September",
      short: "Sep",
      number: 9,
    },
    {
      name: "October",
      short: "Oct",
      number: 10,
    },
    {
      name: "November",
      short: "Nov",
      number: 11,
    },
    {
      name: "December",
      short: "Dec",
      number: 12,
    },
  ];
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-md",
    height: 400,
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
    this.getAccountClass();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openStockSettings(this.stockStatusSettings), 100);
  }

  buildStockStatusForms(): void {
    this.stockStatusFroms = this._fb.group({
      AccClassID: [""],
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

  getAccountClass(): void {
    this.reportService.getAccountClass().subscribe((response) => {
      this.accountLists = response.Entity;
    });
  }

  allProduct(event): void {
    this.stockStatusFroms.get("ProductID").setValue(null);
    this.stockStatusFroms.get("ProductGroupID").setValue(null);
    this.stockStatusFroms.get("ProductID").disable();
    this.stockStatusFroms.get("ProductGroupID").disable();
  }

  quantityRange(): void {
    this.stockStatusFroms.get("FromQtyRange").enable();
    this.stockStatusFroms.get("IsFromRangeMin").enable();
    this.stockStatusFroms.get("IsToRangeMax").enable();
    this.stockStatusFroms.get("ToQtyRange").enable();
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.stockStatusFroms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.stockStatusFroms.get("AccClassID").setValue([id]);
    }
  }
  openStockSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  singleProduct(event): void {
    this.stockStatusFroms.get("ProductGroupID").setValue(null);
    this.stockStatusFroms.get("ProductGroupID").disable();
  }

  productGroup(event): void {
    this.stockStatusFroms.get("ProductID").setValue(null);
    this.stockStatusFroms.get("ProductID").disable();
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
