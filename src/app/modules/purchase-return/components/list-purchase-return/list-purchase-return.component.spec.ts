import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseReturnComponent } from './list-purchase-return.component';

describe('ListPurchaseReturnComponent', () => {
  let component: ListPurchaseReturnComponent;
  let fixture: ComponentFixture<ListPurchaseReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPurchaseReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
