import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LandingLedgerComponent } from "./landing-ledger.component";

describe("LandingLedgerComponent", () => {
  let component: LandingLedgerComponent;
  let fixture: ComponentFixture<LandingLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingLedgerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
