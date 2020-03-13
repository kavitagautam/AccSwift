import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLedgerMoreDetailsComponent } from './account-ledger-more-details.component';

describe('AccountLedgerMoreDetailsComponent', () => {
  let component: AccountLedgerMoreDetailsComponent;
  let fixture: ComponentFixture<AccountLedgerMoreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLedgerMoreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLedgerMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
