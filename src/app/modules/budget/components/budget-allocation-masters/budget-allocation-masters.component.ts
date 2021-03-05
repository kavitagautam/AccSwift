import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-budget-allocation-masters",
  templateUrl: "./budget-allocation-masters.component.html",
  styleUrls: ["./budget-allocation-masters.component.scss"],
})
export class BudgetAllocationMastersComponent implements OnInit {
  @Input() budgetMaster: FormGroup;
  constructor() {}

  ngOnInit() {}
}
