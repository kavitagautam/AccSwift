import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-purchase-return',
  templateUrl: './list-purchase-return.component.html',
  styleUrls: ['./list-purchase-return.component.scss']
})
export class ListPurchaseReturnComponent implements OnInit {
  purchaseReturnForm: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  buildListPurchaseReturnForm() {
    this.purchaseReturnForm = this.fb.group({
      series: [""],
      voucher: [""],
      date: [""],
      cashParty: [""],
      depot: [""],
      order: [""],
      purchase: [""],
      project: [""],
      remarks: [""],
    })
  }
}
