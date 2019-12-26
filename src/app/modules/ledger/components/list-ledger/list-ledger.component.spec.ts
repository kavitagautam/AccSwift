import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLedgerComponent } from './list-ledger.component';

describe('ListLedgerComponent', () => {
  let component: ListLedgerComponent;
  let fixture: ComponentFixture<ListLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
