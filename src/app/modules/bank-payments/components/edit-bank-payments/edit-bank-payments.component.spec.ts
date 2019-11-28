import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankPaymentsComponent } from './edit-bank-payments.component';

describe('EditBankPaymentsComponent', () => {
  let component: EditBankPaymentsComponent;
  let fixture: ComponentFixture<EditBankPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
