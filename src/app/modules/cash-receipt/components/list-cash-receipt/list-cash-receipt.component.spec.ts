import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListCashReceiptComponent } from "./list-cash-receipt.component";

describe("ListCashReceiptComponent", () => {
  let component: ListCashReceiptComponent;
  let fixture: ComponentFixture<ListCashReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCashReceiptComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCashReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
