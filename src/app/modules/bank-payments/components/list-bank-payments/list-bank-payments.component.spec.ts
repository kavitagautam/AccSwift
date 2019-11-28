import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankPaymentsComponent } from './list-bank-payments.component';

describe('ListBankPaymentsComponent', () => {
  let component: ListBankPaymentsComponent;
  let fixture: ComponentFixture<ListBankPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBankPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
