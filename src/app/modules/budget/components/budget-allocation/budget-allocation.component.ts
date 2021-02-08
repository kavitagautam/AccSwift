import { Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactoryResolver,} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BudgetMinListView, BudgetMinListViewRootModel, BudgetDetails, BudgetDetailsRootModel
  } from "@accSwift-modules/budget/models/budget-model";
import { BudgetService } from "../../services/budget.service";
import { BudgetSetupComponent } from "../budget-setup/budget-setup.component";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
 

@Component({
  selector: "budget-allocation",
  templateUrl: "./budget-allocation.component.html",
  styleUrls: ["./budget-allocation.component.scss"]
})

export class BudgetAllocationComponent implements OnInit {
  @ViewChild("dynamicContentDiv", { read: ViewContainerRef })
  dynamicContentDiv: ViewContainerRef;
  @Output("selectedItem") selectedItem = new EventEmitter();
  BudgetMinListView: any;
  BudgetDetails: BudgetDetails;
  listViewLoading: boolean;
  selectedBudgetTab: boolean;


  public search: Array<any> = [ { text: 'Account Group', value: 1 }];

  public operator: Array<string> = ['Search With'];
  public Budget: any[] = [
    {
        text: 'Budget', items: [
            { text: 'Setup' },
            { text: 'Allocation' },
            { text: 'View' }
        ]
    }
  ];
  public expandedKeys: any[] = ["Budget"];

  constructor(
    private BudgetService: BudgetService,
    public _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver
    ) {}

  ngOnInit() {
    this.selectedBudgetTab = true;
    this.loadBudgetListView;
  }

  selectedNode({ isEdited, dataItem, rowIndex }): void {
      this.selectedItem = dataItem;

      this.dynamicContentDiv.clear();
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        BudgetSetupComponent
      );
      const componentRef = this.dynamicContentDiv.createComponent(factory);
      componentRef.instance.selectedItem = dataItem;
  }

  addNewBudget(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      BudgetSetupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedItem = null;
  }

  loadBudgetListView(): void {
    this.listViewLoading = true;
    this.BudgetService.getBudgetMinListView().subscribe(
      (response) => {
        this.BudgetMinListView = response.Entity;
      },
      (error) => {
        this.listViewLoading = false;
      },
      () => {
        this.listViewLoading = false;
      }
    );
    }

  public onTabSelect(e) {
    if (e.index == 1) {
      this.loadBudgetListView();
    }
  }

  expandAllNode(): void {
    this.expandedKeys = this.Budget;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }

}
