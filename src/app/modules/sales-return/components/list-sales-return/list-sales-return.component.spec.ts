import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesReturnComponent } from './list-sales-return.component';

describe('ListSalesReturnComponent', () => {
  let component: ListSalesReturnComponent;
  let fixture: ComponentFixture<ListSalesReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
