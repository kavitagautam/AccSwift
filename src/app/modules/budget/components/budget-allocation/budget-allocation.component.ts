import { Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentFactoryResolver } from "@angular/core";
 

@Component({
  selector: "budget-allocation",
  templateUrl: "./budget-allocation.component.html",
  styleUrls: ["./budget-allocation.component.scss"]
})

export class BudgetAllocationComponent implements OnInit {
  @ViewChild("dynamicContentDiv", { read: ViewContainerRef })
  dynamicContentDiv: ViewContainerRef;
  @Output("selectedItem") selectedItem = new EventEmitter();
  
  
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
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {}
  expandAllNode(): void {
    this.expandedKeys = this.Budget;
  }

  collapseAllNode(): void {
    this.expandedKeys = [];
  }

}
