import { Component,
  OnInit,
  ViewChild,
  ElementRef} from "@angular/core";
  import { BudgetMinListView, BudgetMinListViewRootModel
  } from "@accSwift-modules/budget/models/budget-model";
  import { BudgetService } from "../../services/budget.service";
 

@Component({
  selector: "budget-allocation",
  templateUrl: "./budget-allocation.component.html",
  styleUrls: ["./budget-allocation.component.scss"]
})

export class BudgetAllocationComponent implements OnInit {
  BudgetMinListView: any;
  listViewLoading: boolean;

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
  constructor(private BudgetService: BudgetService) {}

  ngOnInit() {
    
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

  expandAllNode(): void {
    this.expandedKeys = this.Budget;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }

}
