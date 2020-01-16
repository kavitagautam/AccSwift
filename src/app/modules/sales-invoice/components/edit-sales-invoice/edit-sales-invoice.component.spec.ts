import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditSalesInvoiceComponent } from "./edit-sales-invoice.component";

describe("EditSalesInvoiceComponent", () => {
  let component: EditSalesInvoiceComponent;
  let fixture: ComponentFixture<EditSalesInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesInvoiceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
