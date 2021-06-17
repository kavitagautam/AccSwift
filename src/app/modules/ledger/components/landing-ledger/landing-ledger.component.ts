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
  liabilityData: any;
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
    console.log(ledgerTree);
    let assets,liabilities,income,expenditure;
    ledgerTree.map(function(item){
      console.log(item);
      if (item.Title==="Assets"){
        assets=item;
        console.log(item.Child)
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
    const assets=[this.assetsData];
    let data = [];
    console.log("This is assets data")
    console.log(assets);
    for (const val of assets){
      console.log("%%%%%%%");
      console.log(val);
      console.log(val["Child"]);
      if(val.hasOwnProperty('Child') && val["Child"])
      {
        console.log("&&&&&&&&");
        console.log(val['Child']);
        for(const val1 of val["Child"])
        {
          console.log("*********")
          console.log(val1);
          console.log(val1["Title"]);
          if(val1.hasOwnProperty('Child') && val1["Child"])
          {
            for(const val2 of val1["Child"])
            {
              console.log("##############");
              console.log(val2["Title"]);
              if (val["TypeOf ===1"])
              {
                console.log("888888888")
                console.log(val2["Title"]+" "+val2["Code"]);
                data.push(val2["Title"]+" "+val2["Code"]);
              }
              if (val2.hasOwnProperty('Child') && val2["Child"])
              {
                for (const val3 of val2["Child"])
                {
                  console.log("00000000");
                  console.log(val3["Title"]);
                  data.push(val3["Title"]+" "+val3["Code"]);
                  if (val3.hasOwnProperty('Child') && val3["Child"])
                  {
                    for (const val4 of val3["Child"])
                    {
                      console.log("111111111");
                      console.log(val4["Title"]);
                      data.push(val4["Title"]+" "+val4["Code"])
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log(data);
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