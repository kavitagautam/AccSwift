import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankReconciliationComponent } from './add-bank-reconciliation.component';

describe('AddBankReconciliationComponent', () => {
  let component: AddBankReconciliationComponent;
  let fixture: ComponentFixture<AddBankReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
