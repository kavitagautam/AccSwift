import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySubLedgerComponent } from './entry-sub-ledger.component';

describe('EntrySubLedgerComponent', () => {
  let component: EntrySubLedgerComponent;
  let fixture: ComponentFixture<EntrySubLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySubLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySubLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
