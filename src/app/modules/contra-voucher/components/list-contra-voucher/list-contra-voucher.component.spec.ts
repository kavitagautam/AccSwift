import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListContraVoucherComponent } from "./list-contra-voucher.component";

describe("ListContraVoucherComponent", () => {
  let component: ListContraVoucherComponent;
  let fixture: ComponentFixture<ListContraVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListContraVoucherComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContraVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
