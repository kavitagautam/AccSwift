import { Component, OnInit } from "@angular/core";

@Component({
  selector: "budget-allocation",
  templateUrl: "./budget-allocation.component.html",
  styleUrls: ["./budget-allocation.component.scss"]
})

export class BudgetAllocationComponent implements OnInit {
  
  public search: Array<any> = [ { text: 'Account Group', value: 1 }];
  public selectedItem = this.search[1];
  public operator: Array<string> = ['Search With'];
  constructor() {}

  ngOnInit() {}
}
