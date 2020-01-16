import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProductService } from "../../services/product.service";
const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: "accSwift-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.scss"]
})
export class ListProductComponent implements OnInit {
  @Output("selectedItem") selectedItem = new EventEmitter();
  selectedProductGroupTab: boolean;
  selectedProductTab: boolean;
  productListForm: FormGroup;
  productTreeList: any;
  productListView: any;
  productTreeNode: any;
  treeViewLoading: boolean;
  listViewLoading: boolean;
  //for Expanding the tree view
  public expandedKeys: any[] = ["Root", "Ac Stand"];

  constructor(
    public _fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.selectedProductGroupTab = true;
    this.getProductTreeView();
  }

  selectedNode(dataItem): void {
    if (dataItem.TypeOf === 0) {
      this.selectedItem = dataItem;
      this.selectedProductGroupTab = true;
      this.selectedProductTab = false;
    } else {
      this.selectedItem = dataItem;
      this.selectedProductTab = true;
      this.selectedProductGroupTab = false;
    }
  }

  getProductTreeView(): void {
    this.treeViewLoading = true;
    this.productService.getProductTree().subscribe(
      res => {
        this.productTreeNode = res.Node;
        this.productTreeList = res.Tree;
        this.treeViewLoading = false;
      },
      error => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
  }

  loadLedgerlistView(): void {
    this.listViewLoading = true;
    this.productService.getProductList().subscribe(
      res => {
        this.productListView = res;
      },
      error => {
        this.listViewLoading = false;
      },
      () => {
        this.listViewLoading = false;
      }
    );
  }

  public onTabSelect(e) {
    if (e.index == 1) {
      this.loadLedgerlistView();
    }
  }

  public colorGroupOrLedger({ Title, TypeOf }: any): any {
    return {
      "tree-group": TypeOf == 1,
      "tree-ledger": TypeOf == 0
    };
  }

  expandAllNode(): void {
    this.expandedKeys = this.productTreeNode;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }
}
