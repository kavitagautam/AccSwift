import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankReconciliationComponent } from './edit-bank-reconciliation.component';

describe('EditBankReconciliationComponent', () => {
  let component: EditBankReconciliationComponent;
  let fixture: ComponentFixture<EditBankReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
