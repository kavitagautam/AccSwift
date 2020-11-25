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
  ledgerComponent: boolean = false;
  ledgerGroupComponent: boolean = false;
  treeViewLoading: boolean;
  listViewLoading: boolean;

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
  }

  loadLedgerTreeView(): void {
    this.treeViewLoading = true;
    this.ledgerService.getLedgerTreeView().subscribe(
      (response) => {
        this.ledgerTreeNode = response.Entity.Node;
        this.ledgerTreeList = response.Entity.Tree;
        this.treeViewLoading = false;
      },
      (error) => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
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
      // this.ledgerComponent = false;
      // this.ledgerGroupComponent = true;
      // this.selectedGroupTab = true;
      // this.selectedLedgerTab = false;
      console.log("dataItem" + dataItem);
      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountGroupComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
    } else {
      this.selectedItem = dataItem;
      // this.ledgerComponent = true;
      // this.ledgerGroupComponent = false;
      // this.selectedLedgerTab = true;
      // this.selectedGroupTab = false;
      console.log("dataItem" + JSON.stringify(dataItem));

      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountLedgerComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
    }
  }

  addNewLedger(): void {
    // this.selectedItem = null;
    // this.ledgerComponent = true;
    // this.ledgerGroupComponent = false;

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
    // this.selectedItem = null;
    // this.ledgerGroupComponent = true;
    // this.ledgerComponent = false;

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
}
