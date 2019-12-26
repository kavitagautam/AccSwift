import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerModelPopupComponent } from './ledger-model-popup.component';

describe('LedgerModelPopupComponent', () => {
  let component: LedgerModelPopupComponent;
  let fixture: ComponentFixture<LedgerModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
