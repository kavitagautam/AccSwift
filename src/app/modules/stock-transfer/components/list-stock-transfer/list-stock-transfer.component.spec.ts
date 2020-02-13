import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockTransferComponent } from './list-stock-transfer.component';

describe('ListStockTransferComponent', () => {
  let component: ListStockTransferComponent;
  let fixture: ComponentFixture<ListStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
