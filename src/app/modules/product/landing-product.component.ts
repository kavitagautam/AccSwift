import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from "./services/product.service";

const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: "accSwift-landing-product",
  templateUrl: "./landing-product.component.html",
  styleUrls: ["./landing-product.component.scss"]
})
export class LandingProductComponent implements OnInit {
  @Output("selectedProductGroup") selectedProductGroup = new EventEmitter();
  @Output("selectedProduct") selectedProduct = new EventEmitter();

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
      this.selectedProductGroup = dataItem;
      this.selectedProductGroupTab = true;
      this.selectedProductTab = false;
    } else {
      this.selectedProduct = dataItem;
      this.selectedProductTab = true;
      this.selectedProductGroupTab = false;
    }
  }

  getProductTreeView(): void {
    this.treeViewLoading = true;
    this.productService.getProductTree().subscribe(
      res => {
        this.productTreeNode = res.Entity.Node;
        this.productTreeList = res.Entity.Tree;
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

  loadProductListView(): void {
    this.listViewLoading = true;
    this.productService.getProductList().subscribe(
      response => {
        this.productListView = response.Entity;
      },
      error => {
        this.listViewLoading = false;
      },
      () => {
        this.listViewLoading = false;
      }
    );
  }

  public onTabSelect(e): void {
    if (e.index == 1) {
      this.loadProductListView();
    }
  }

  public colorGroupOrProduct({ Title, TypeOf }: any): any {
    return {
      "tree-child": TypeOf == 1,
      "tree-node": TypeOf == 0
    };
  }

  expandAllNode(): void {
    this.expandedKeys = this.productTreeNode;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }
}
