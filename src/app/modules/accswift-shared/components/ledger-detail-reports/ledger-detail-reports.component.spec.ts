import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDetailReportsComponent } from './ledger-detail-reports.component';

describe('LedgerDetailReportsComponent', () => {
  let component: LedgerDetailReportsComponent;
  let fixture: ComponentFixture<LedgerDetailReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerDetailReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerDetailReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
