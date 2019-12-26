import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesInvoiceComponent } from './list-sales-invoice.component';

describe('ListSalesInvoiceComponent', () => {
  let component: ListSalesInvoiceComponent;
  let fixture: ComponentFixture<ListSalesInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
