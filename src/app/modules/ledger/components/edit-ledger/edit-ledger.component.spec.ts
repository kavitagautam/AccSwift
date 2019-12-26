import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLedgerComponent } from './edit-ledger.component';

describe('EditLedgerComponent', () => {
  let component: EditLedgerComponent;
  let fixture: ComponentFixture<EditLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
