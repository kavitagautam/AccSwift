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
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "accSwift-landing-ledger",
  templateUrl: "./landing-ledger.component.html",
  styleUrls: ["./landing-ledger.component.scss"],
  providers: [BsModalRef]
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

  modalRef: BsModalRef;

  ledgerData: any;

  assetsData: any;
  currentAssets = [];
  fixedAssets = [];

  liabilityData: any;
  currentLiability: any;
  ownerFund: any;
  loanFund: any;

  incomeData: any;
  directIncome: any;
  indirectIncome: any;

  expenditureData: any;
  directExpense: any;
  indirectExpense: any;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  
  //Expanding the tree view
  public expandedKeys: any[] = ["Assets", "Current Assets", "Banks"];
  constructor(
    public _fb: FormBuilder,
    private ledgerService: LedgerService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    // private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.selectedGroupTab = true;
    this.loadLedgerTreeView();
    this.loadLedgerGroupList();
    this.groupLedgerTreeItems();
    this.recursiveLedger();
    console.log(this.selectedItem);
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


  groupLedgerTreeItems(){
    const ledgerTree = JSON.parse(localStorage.getItem("LedgerTreeList"));
    this.ledgerData = ledgerTree;
    // console.log(ledgerTree);
    let assets,liabilities,income,expenditure;
    ledgerTree.map(function(item){
      // console.log(item);
      if (item.Title==="Assets"){
        assets=item;
        // console.log(item.Child)
      }
      else if (item.Title==="Liabilities"){
        liabilities=item;
      }
      else if (item.Title==="Income"){
        income=item;
      }
      else if(item.Title==="Expenditure"){
        expenditure=item;
      }
    })
    this.assetsData = assets;
    this.liabilityData = liabilities;
    this.incomeData = income;
    this.expenditureData = expenditure;

    // localStorage.setItem("assetsData", JSON.stringify(assets));
    // localStorage.setItem("liabilitiesData", JSON.stringify(liabilities));
    // localStorage.setItem("incomeData", JSON.stringify(income));
    // localStorage.setItem("expenditureData", JSON.stringify(expenditure));
  }

  recursiveLedger()
  {
    const ledgersData = this.ledgerData;

    const assets = [this.assetsData];
    this.currentAssets = [];
    this.fixedAssets = [];

    const liabilities = [this.liabilityData];
    this.currentLiability = [];
    this.ownerFund = [];
    this.loanFund = [];

    const income = [this.incomeData];
    this.directIncome = [];
    this.indirectIncome = [];

    const expenditure = [this.expenditureData];
    this.directExpense = [];
    this.indirectExpense = [];

    for (const ledger of ledgersData)
    {
      if (ledger["Title"] === "Assets")
      {
        for (const val of assets){
          if(val.hasOwnProperty('Child') && val["Child"]) //First Child Data i.e Current, Fixed Assets
          {
            for(const val1 of val["Child"])
            {
              if (val1["TypeOf"] === 1)
              {
                this.fixedAssets.push("("+val1["Code"]+")"+" "+val1["Title"]); //Access Ledgers of Fixed Assets
              }
              if(val1.hasOwnProperty('Child') && val1["Child"]) //Child of Current, Fixed Assets
              {
                for(const val2 of val1["Child"])
                {
                  if (val2["TypeOf"]=== 1)
                  {
                    if(val1["Title"] === "Current Assets")
                    {
                      this.currentAssets.push("("+val2["Code"]+")"+" "+val2["Title"]);
                    }
                    else if(val1["Title"] === "Fixed Assests")
                    {
                      this.fixedAssets.push("("+val2["Code"]+")"+" "+val2["Title"]);
                    }
                  }
                  if (val2.hasOwnProperty('Child') && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      if (val3["TypeOf"] === 1)
                      {
                        if(val1["Title"] === "Current Assets")
                          {
                            this.currentAssets.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Fixed Assests")
                          {
                            this.fixedAssets.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                      }
                      if (val3.hasOwnProperty('Child') && val3["Child"])
                      {
                        for (const val4 of val3["Child"])
                        {
                          if (val4["TypeOf"] === 1)
                            {
                              if(val1["Title"] === "Current Assets")
                                {
                                  this.currentAssets.push("("+val4["Code"]+")"+" "+val4["Title"]);
                                }
                              else if(val1["Title"] === "Fixed Assests")
                                {
                                  this.fixedAssets.push("("+val4["Code"]+")"+" "+val4["Title"]);
                                }
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (ledger["Title"] === "Liabilities")
      {
        for (const val of liabilities){
          if(val.hasOwnProperty('Child') && val["Child"]) //First Child Data i.e Current, Fixed Assets
          {
            for(const val1 of val["Child"])
            {
              if(val1.hasOwnProperty('Child') && val1["Child"]) //Child of Current, Fixed Assets
              {
                for(const val2 of val1["Child"])
                {
                  if (val2.hasOwnProperty('Child') && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      if (val3["TypeOf"] === 1)
                      {
                        if(val1["Title"] === "Current Liabilities")
                          {
                            this.currentLiability.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Owners Fund")
                          {
                            this.ownerFund.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Loan Funds")
                          {
                            this.loanFund.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (ledger["Title"] === "Income")
      {
        for (const val of income)
        {
          if (val.hasOwnProperty("Child") && val["Child"])
          {
            for (const val1 of val["Child"])
            {
              if (val1.hasOwnProperty("Child") && val1["Child"])
              {
                for (const val2 of val1["Child"])
                {
                  if (val2["TypeOf"] === 1)
                  {
                    this.directIncome.push("("+val2["Code"]+")"+" "+val2["Title"]);
                  }
                  if (val2.hasOwnProperty("Child") && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      if (val1["Title"] === "DirectIncome")
                      {
                        this.directIncome.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                      else if (val1["Title"] === "Indirect Income")
                      {
                        this.indirectIncome.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (ledger["Title"] === "Expenditure")
      {
        for (const val of expenditure)
        {
          if (val.hasOwnProperty("Child") && val["Child"])
          {
            for (const val1 of val["Child"])
            {
              if (val1.hasOwnProperty("Child") && val1["Child"])
              {
                for (const val2 of val1["Child"])
                {
                  if (val2.hasOwnProperty("Child") && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      if (val1["Title"] === "Direct Expenses")
                      {
                        this.directExpense.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                      else if (val1["Title"] === "Indirect Expenses")
                      {
                        this.indirectExpense.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // console.log(this.currentAssets);
    // console.log(this.fixedAssets);
    // console.log(this.currentLiability);
    // console.log(this.ownerFund);
    // console.log(this.loanFund);
    // console.log(this.indirectIncome);
    // console.log(this.directIncome);
  }

  // assetsFilter(sortedArray) {
  //   var ledgerTree = JSON.parse(localStorage.getItem("LedgerTreeList"));
  //   console.log(ledgerTree);
  //   sortedArray = ledgerTree.filter(function(val)
  //   {
  //     console.log(val.Code);
  //     console.log(val.GroupOrLedgerNo);
  //     console.log(val['Child'][0]['Title'])
  //     console.log(val.Child[0].Child[0]);
  //     localStorage.setItem("SubGroups",JSON.stringify(val.Child[0].Child[0]));
  //     if (val.Code=="fgfg" &&
  //     val.GroupOrLedgerNo == 1)
  //     return sortedArray;
  //   });
  //   localStorage.setItem("LedgerAssets", JSON.stringify(sortedArray));
  //   return sortedArray;
  // }

  // liabFilter(sortedArray) {
  //   var ledgerTree = JSON.parse(localStorage.getItem("LedgerTreeList"));
  //   console.log(ledgerTree);
  //   sortedArray = ledgerTree.filter(function(val)
  //   {
  //     console.log(val.Code);
  //     console.log(val.GroupOrLedgerNo);
  //     if (val.Code==null &&
  //     val.GroupOrLedgerNo == 2)
  //     return sortedArray;
  //   });
  //   localStorage.setItem("LedgerLiab", JSON.stringify(sortedArray));
  //   return sortedArray;
  // }


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
    console.log(dataItem);
    if (dataItem.TypeOf === 0) {
      this.selectedItem = dataItem;
      console.log(this.selectedItem)
      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountGroupComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      console.log(componentRef)
      componentRef.instance.selectedItem = dataItem;
    } else {
      this.selectedItem = dataItem;
      console.log(this.selectedItem)
      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountLedgerComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
    }
  }

  selectedNewNode(item): void {
    console.log(item);
      this.selectedItem = item;
      console.log(this.selectedItem);

      this.modalRef = this.modalService.show(AccountLedgerComponent, this.config);
      this.modalRef.content.selectedItem = item;
      console.log(this.modalRef.content);


      // const factory = this.componentFactoryResolver.resolveComponentFactory(
      //   AccountLedgerComponent
      // );
      // const componentRef = this.dynamicContentDiv.createComponent(factory);
      // componentRef.instance.selectedItem = item;
      // console.log(componentRef.instance);
      
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

  addNewerLedger():void 
  {
    this.modalRef = this.modalService.show(AccountLedgerComponent, this.config);
    this.modalRef.content.selectedItem = null;
  }

  addLedgerGroup(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AccountGroupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedItem = null;
  }

  addNewLedgerGroup():void 
  {
    this.modalRef = this.modalService.show(AccountGroupComponent, this.config);
    this.modalRef.content.selectedItem = null;
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