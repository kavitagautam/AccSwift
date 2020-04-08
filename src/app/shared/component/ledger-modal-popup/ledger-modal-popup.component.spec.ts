import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LedgerModalPopupComponent } from "./ledger-modal-popup.component";

describe("LedgerModalPopupComponent", () => {
  let component: LedgerModalPopupComponent;
  let fixture: ComponentFixture<LedgerModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerModalPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
