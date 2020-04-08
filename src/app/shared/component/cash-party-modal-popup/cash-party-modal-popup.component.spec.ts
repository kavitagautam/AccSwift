import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPartyModalPopupComponent } from './cash-party-modal-popup.component';

describe('CashPartyModalPopupComponent', () => {
  let component: CashPartyModalPopupComponent;
  let fixture: ComponentFixture<CashPartyModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashPartyModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPartyModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
