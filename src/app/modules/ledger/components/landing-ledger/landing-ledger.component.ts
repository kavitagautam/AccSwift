import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactoryResolver,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { AccountLedgerComponent } from "../account-ledger/account-ledger.component";
import { AccountGroupComponent } from "../account-group/account-group.component";

@Component({
  selector: "accSwift-landing-ledger",
  templateUrl: "./landing-ledger.component.html",
  styleUrls: ["./landing-ledger.component.scss"],
})
export class LandingLedgerComponent implements OnInit {
  @ViewChild("dynamicContentDiv", { read: ViewContainerRef })
  dynamicContentDiv: ViewContainerRef;
  @Output("selectedItem") selectedItem = new EventEmitter();
  @Output("addNew") addNew: boolean;
  selectedGroupTab: boolean;
  selectedLedgerTab: boolean;
  ledgerTreeList: any;
  ledgerTreeNode: any;
  ledgerListView: any;
  treeViewLoading: boolean;
  listViewLoading: boolean;
  ledgerGroupList: any; 
  userType: string = localStorage.getItem("user_type");
  ledgerAssets:string = JSON.parse(localStorage.getItem("LedgerAssets"));
  ledgerLiab:string = JSON.parse(localStorage.getItem("LedgerLiab"));

  //Expanding the tree view
  public expandedKeys: any[] = ["Assets", "Current Assets", "Banks"];
  constructor(
    public _fb: FormBuilder,
    private ledgerService: LedgerService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.selectedGroupTab = true;
    this.loadLedgerTreeView();
    this.loadLedgerGroupList();
  }

  loadLedgerTreeView(): void {
    this.treeViewLoading = true;
    this.ledgerService.getLedgerTreeView().subscribe(
      (response) => {
        this.ledgerTreeNode = response.Entity.Node;
        this.ledgerTreeList = response.Entity.Tree;
        this.treeViewLoading = false;
        localStorage.setItem("LedgerTreeList", JSON.stringify(response.Entity.Tree));
      },
      (error) => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );

  }

  assetsFilter(sortedArray) {
    var ledgerTree = JSON.parse(localStorage.getItem("LedgerTreeList"));
    console.log(ledgerTree);
    sortedArray = ledgerTree.filter(function(val)
    {
      console.log(val.Code);
      console.log(val.GroupOrLedgerNo);
      console.log(val.Child);
      if (val.Code=="fgfg" &&
      val.GroupOrLedgerNo == 1)
      return sortedArray;
    });
    localStorage.setItem("LedgerAssets", JSON.stringify(sortedArray));
    return sortedArray;
  }

  liabFilter(sortedArray) {
    var ledgerTree = JSON.parse(localStorage.getItem("LedgerTreeList"));
    console.log(ledgerTree);
    sortedArray = ledgerTree.filter(function(val)
    {
      console.log(val.Code);
      console.log(val.GroupOrLedgerNo);
      if (val.Code==null &&
      val.GroupOrLedgerNo == 2)
      return sortedArray;
    });
    localStorage.setItem("LedgerLiab", JSON.stringify(sortedArray));
    return sortedArray;
  }

  loadLedgerGroupList(): void 
  {
    this.ledgerService.getLedgerGroupList().subscribe((response)=> {
        this.ledgerGroupList = response.Entity;
    })
  }

  loadLedgerlistView(): void {
    this.listViewLoading = true;
    this.ledgerService.getLedgerListView().subscribe(
      (response) => {
        this.ledgerListView = response.Entity;
      },
      (error) => {
        this.listViewLoading = false;
      },
      () => {
        this.listViewLoading = false;
      }
    );
  }

  

  public colorGroupOrLedger({ Title, TypeOf }: any): any {
    return {
      "tree-node": TypeOf == 1,
      "tree-child": TypeOf == 0,
    };
  }

  selectedNode(dataItem): void {
    if (dataItem.TypeOf === 0) {
      this.selectedItem = dataItem;

      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountGroupComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
    } else {
      this.selectedItem = dataItem;

      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountLedgerComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
    }
  }

  addNewLedger(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AccountLedgerComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedItem = null;

    // componentRef.instance.onCancel.subscribe((data) => {
    //   if (data) {
    //     this.viewProductGroup();
    //   }
    // });
  }

  addLedgerGroup(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AccountGroupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedItem = null;
  }

  public onTabSelect(e) {
    if (e.index == 1) {
      this.loadLedgerlistView();
    }
  }

  expandAllNode(): void {
    this.expandedKeys = this.ledgerTreeNode;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }

  //New COA
  onTabSelectn(e):void {
    if (e.index == 0)
    {
      this.assetsFilter(e);
      console.log(this.assetsFilter(e));
    }
    else if (e.index == 1)
    {
      this.liabFilter(e);
      console.log(this.liabFilter(e));
    }
  }
}
