import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCashPaymentsComponent } from './list-cash-payments.component';

describe('ListCashPaymentsComponent', () => {
  let component: ListCashPaymentsComponent;
  let fixture: ComponentFixture<ListCashPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCashPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCashPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
