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
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";
import { Ledgers } from "@accSwift-modules/ledger/models/ledger.models";
import { AnyTxtRecord } from "dns";

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

  mainGroups:LedgerGroup[]=[];
  ledgersOfGroups:Ledgers[]=[];
  ledgers = [];

  modalRef: BsModalRef;

  ledgerData: any;

  branchArray: any;

  groupArrays: any;
  groupArray: any;

  assetsHtml: string;
  assetsData: any;
  currentAssets:any;
  fixedAssets:any;

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
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.selectedGroupTab = true;
    this.loadLedgerTreeView();
    // this.loadLedgerGroupList();
    this.groupLedgerTreeItems();
    this.getMajorGroups();
    this.getLedgerByID();
    // this.parseTree();
    // this.hierarchialLedger();
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
    let assets,liabilities,income,expenditure;
    ledgerTree.map(function(item){
      if (item.Title==="Assets"){
        assets=item;
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
  }


  // loadLedgerGroupList(): void //To access only Main Groups Details by using ParentGroupID among all groups
  // {
  //   this.ledgerService.getLedgerGroupList().subscribe((response)=> {
  //       this.ledgerGroupList = response.Entity;
  //       console.log(this.ledgerGroupList);
  //   })
  // }

  
  getMajorGroups()
  {
    const ledgerTree = this.ledgerData;
    console.log(ledgerTree);
    const groupArray = [];
    const branchArray = [];
    for (const item of ledgerTree) //Display main branch details
    {
      console.log(item);
      branchArray.push(item);
      for (const item1 of item["Child"]) //Display main group details
      {
        groupArray.push(item1); 
        this.groupArray = groupArray;
        // this.groupArray = groupArray.filter(s=>s.Title === item1.Title);       
      }
    }
    this.groupArrays = groupArray;
    this.branchArray = branchArray;
  }

  
 ledgerList:any = {};
  getLedgerByID(): void {
    console.log(this.groupArrays);
    var groupArray = this.groupArrays;
    for (const item of groupArray) { 
      console.log(item)
      const param = item.ID;
      this.ledgerService
      .getLedgersById(param)
      .subscribe((res) => {
        this.ledgerList[param] = res.Entity;
        this.ledgersOfGroups = res.Entity;
        console.log(this.ledgersOfGroups);
      });
      console.log(this.ledgerList);
    }
  }
  

  hierarchialLedger()
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
              console.log(val1.Title); //Current Assets, Fixed Assets
              if (val1["TypeOf"] === 1)
              {
                this.fixedAssets.push(val1);
                // this.fixedAssets.push("("+val1["Code"]+")"+" "+val1["Title"]); //Access Ledgers of Fixed Assets
              }
              if(val1.hasOwnProperty('Child') && val1["Child"]) //Child of Current, Fixed Assets
              {
                for(const val2 of val1["Child"])
                {
                  if (val2["TypeOf"]=== 1)
                  {
                    if(val1["Title"] === "Current Assets")
                    {
                      this.currentAssets.push(val2);
                      // this.currentAssets.push("("+val2["Code"]+")"+" "+val2["Title"]);
                    }
                    else if(val1["Title"] === "Fixed Assests")
                    {
                      this.fixedAssets.push(val2);
                      // this.fixedAssets.push("("+val2["Code"]+")"+" "+val2["Title"]);
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
                            this.currentAssets.push(val3);
                            // this.currentAssets.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Fixed Assests")
                          {
                            this.fixedAssets.push(val3);
                            // this.fixedAssets.push("("+val3["Code"]+")"+" "+val3["Title"]);
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
                                  this.currentAssets.push(val4);
                                  // this.currentAssets.push("("+val4["Code"]+")"+" "+val4["Title"]);
                                }
                              else if(val1["Title"] === "Fixed Assests")
                                {    
                                  this.fixedAssets.push(val4);
                                  // this.fixedAssets.push("("+val4["Code"]+")"+" "+val4["Title"]);
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
                            this.currentLiability.push(val3);
                            // this.currentLiability.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Owners Fund")
                          {
                            this.ownerFund.push(val3);
                            // this.ownerFund.push("("+val3["Code"]+")"+" "+val3["Title"]);
                          }
                        else if(val1["Title"] === "Loan Funds")
                          {
                            this.loanFund.push(val3);
                            // this.loanFund.push("("+val3["Code"]+")"+" "+val3["Title"]);
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
                    this.directIncome.push(val2);
                    // this.directIncome.push("("+val2["Code"]+")"+" "+val2["Title"]);
                  }
                  if (val2.hasOwnProperty("Child") && val2["Child"])
                  {
                    for (const val3 of val2["Child"])
                    {
                      if (val1["Title"] === "DirectIncome")
                      {
                        this.directIncome.push(val3);
                        // this.directIncome.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                      else if (val1["Title"] === "Indirect Income")
                      {
                        this.indirectIncome.push(val3);
                        // this.indirectIncome.push("("+val3["Code"]+")"+" "+val3["Title"]);
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
                        this.directExpense.push(val3);
                        // this.directExpense.push("("+val3["Code"]+")"+" "+val3["Title"]);
                      }
                      else if (val1["Title"] === "Indirect Expenses")
                      {
                        this.indirectExpense.push(val3);
                        // this.indirectExpense.push("("+val3["Code"]+")"+" "+val3["Title"]);
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

  //Recursive Fuction

  parseTree() {
    let html = [""];
    const assets = [this.assetsData];
    console.log(assets);
    this.setupData(assets, html);
  }
  
  setupData(assets, html) { 
    console.log(assets);
    // console.log(html);
    this.assetsHtml = "";
    // console.log(Array.isArray(assets) && assets.length);
    if (Array.isArray(assets) && assets.length) {
      for (const val of assets){
        // console.log(val); //Display Main Branch Object Details
        console.log(val.Title);
        const child = val.Child;
        console.log(child); //Display all n objects(Main Groups Details) inside main branch
        html.push (`<div class="group-tabs">
        <h2 class="group-name">${val.Title}</h2>
        <button
          class="btn btn-primary pull-left"
          (click)="addNewerLedger()"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add New
          Ledger
        </button>
        </div>`);
        this.setupGroup(child, html);
        this.setupData(child, html);  //Iterate over all Groups and Ledgers hierarchy inside assets in a linear form
      }
      this.assetsHtml = html.join(""); //Returns array as a string
      console.log(this.assetsHtml);
    } return;
  }

  
  setupGroup(child,html)
  {
    // console.log(child);
    if (Array.isArray(child) && child.length) {
        for (const item of child)
        {
          const ledgerDetails = item.Child; //Display all groups and ledgers details inside main groups(Siblings)
          console.log("*******Main Groups********")
          console.log(item.Title); //Should Display only Main Groups Title but not due to recursion
          console.log("#######ledgers#######")
          console.log(ledgerDetails);
          this.setupGroup(ledgerDetails,html); // Iterate over all groups and ledgers hierarchy inside main groups(Childs) 
        }
      }return;
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
      console.log(this.selectedItem);
      this.selectedItem = dataItem;
      console.log(this.selectedItem);
      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountGroupComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      console.log(componentRef);
      componentRef.instance.selectedItem = dataItem;
      console.log(componentRef.instance.selectedItem);
    } else {
      this.selectedItem = dataItem;
      console.log(this.selectedItem)
      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        AccountLedgerComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      console.log(componentRef);
      componentRef.instance.selectedItem = dataItem;
    }
  }

  editNewLedger(ledger): void {
    console.log(ledger);
    console.log(this.selectedItem);
    this.selectedItem = ledger;
    console.log(this.selectedItem);
    const initialState = {selectedItem: this.selectedItem, groupArrays: this.groupArray};
    this.modalRef = this.modalService.show(AccountLedgerComponent, {initialState});
    this.modalRef.content.selectedItem = ledger;
    console.log(this.modalRef);
    console.log(this.modalRef.content);
  }

  editNewGroup(group):void {
    console.log(group);
    console.log(this.selectedItem);
    this.selectedItem = group;
    console.log(this.selectedItem);
    const initialState = {selectedItem: this.selectedItem, branchArray: this.branchArray};
    this.modalRef = this.modalService.show(AccountGroupComponent, {initialState});
    this.modalRef.content.selectedItem = group;
    console.log(this.modalRef);
    console.log(this.modalRef.content);
  }

  addNewLedger(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AccountLedgerComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedItem = null;
    console.log(componentRef.instance.selectedItem);
  }

  addNewerLedger():void 
  {
    const initialState = { groupArrays: this.groupArray };
    this.modalRef = this.modalService.show(AccountLedgerComponent, {initialState});
    this.modalRef.content.selectedItem = null;
    console.log(this.modalRef.content.selectedItem = null);
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
    const initialState = {branchArray: this.branchArray};
    this.modalRef = this.modalService.show(AccountGroupComponent, {initialState});
    this.modalRef.content.selectedItem = null;
  }

  deleteAccountLedger(ledger): void {
    this.selectedItem = ledger;
    const initialState = { selectedItem: this.selectedItem};
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent, {initialState}
      
    );
    this.modalRef.content.data = "Ledger Account";
    this.modalRef.content.action = "delete";
    console.log(this.modalRef.content.selectedItem.ID);
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAccountLedgertByID(this.modalRef.content.selectedItem.ID);
      }
    });
  }
  
  public deleteAccountLedgertByID(id): void {
    this.ledgerService.deleteLedgerById(id).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Account Ledger deleted successfully");
      }
    );
  }


  deleteLedgerGroup(group): void {
    this.selectedItem = group;
    const initialState = { selectedItem: this.selectedItem};
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,{initialState}
    );
    this.modalRef.content.data = "Ledger group";
    this.modalRef.content.action = "delete ";
    console.log(this.modalRef.content.selectedItem.ID);
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteLedgerGroupByID(this.modalRef.content.selectedItem.ID);
      }
    });
  }

  public deleteLedgerGroupByID(id): void {
    this.ledgerService.deleteLedgerGroupByID(id).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Ledger Group deleted successfully");
      }
    );
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


