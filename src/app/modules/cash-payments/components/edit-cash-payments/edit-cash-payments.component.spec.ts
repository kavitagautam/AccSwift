import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashPaymentsComponent } from './edit-cash-payments.component';

describe('EditCashPaymentsComponent', () => {
  let component: EditCashPaymentsComponent;
  let fixture: ComponentFixture<EditCashPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCashPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCashPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
