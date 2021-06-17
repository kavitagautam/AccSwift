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

  ledgerData: any;

  assetsData: any;
  currentAssets = [];
  fixedAssets = [];

  liabilityData: any;
  currentLiability: any;
  ownerFund: any;
  loanFund: any;

  incomeData: any;
  expenditureData: any;
  


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
    this.groupLedgerTreeItems();
    this.recursiveLedger();
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
    console.log(ledgersData);

    const assets = [this.assetsData];
    this.currentAssets = [];
    this.fixedAssets = [];

    const liabilities = [this.liabilityData];
    this.currentLiability = [];
    this.ownerFund = [];
    this.loanFund = [];

    // console.log("This is assets data")
    // console.log(assets);
    for (const ledger of ledgersData)
    {
      console.log(ledger)
      if (ledger["Title"] === "Assets")
      {
        for (const val of assets){
          // console.log(val);
          if(val.hasOwnProperty('Child') && val["Child"]) //First Child Data i.e Current, Fixed Assets
          {
            console.log(val['Child']); 
            for(const val1 of val["Child"])
            {
              // console.log(val1);
              if (val1["TypeOf"] === 1)
              {
                this.fixedAssets.push("("+val1["Code"]+")"+" "+val1["Title"]); //Access Ledgers of Fixed Assets
              }
              if(val1.hasOwnProperty('Child') && val1["Child"]) //Child of Current, Fixed Assets
              {
                for(const val2 of val1["Child"])
                {
                  // console.log(val2["Title"]);
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
                      // console.log(val3["Title"]);
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
                          // console.log(val4["Title"]);
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
          // console.log(val);
          if(val.hasOwnProperty('Child') && val["Child"]) //First Child Data i.e Current, Fixed Assets
          {
            // console.log(val['Child']); 
            for(const val1 of val["Child"])
            {
              // console.log(val1);
              if(val1.hasOwnProperty('Child') && val1["Child"]) //Child of Current, Fixed Assets
              {
                for(const val2 of val1["Child"])
                {
                  // console.log(val2["Title"]);
                  if (val2.hasOwnProperty('Child') && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      // console.log(val3["Title"]);
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
                      if (val3.hasOwnProperty('Child') && val3["Child"])
                      {
                        for (const val4 of val3["Child"])
                        {
                          // console.log(val4["Title"]);
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
    }
    console.log(this.currentAssets);
    console.log(this.fixedAssets);
    console.log(this.currentLiability);
    console.log(this.ownerFund);
    console.log(this.loanFund);
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

}