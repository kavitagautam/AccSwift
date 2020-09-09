import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvoicesComponent } from './customer-invoices.component';

describe('CustomerInvoicesComponent', () => {
  let component: CustomerInvoicesComponent;
  let fixture: ComponentFixture<CustomerInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
