import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesOrderComponent } from './list-sales-order.component';

describe('ListSalesOrderComponent', () => {
  let component: ListSalesOrderComponent;
  let fixture: ComponentFixture<ListSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
