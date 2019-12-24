import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseInvoiceComponent } from './list-purchase-invoice.component';

describe('ListPurchaseInvoiceComponent', () => {
  let component: ListPurchaseInvoiceComponent;
  let fixture: ComponentFixture<ListPurchaseInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPurchaseInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
