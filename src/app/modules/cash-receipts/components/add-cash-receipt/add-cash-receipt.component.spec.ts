import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashReceiptComponent } from './add-cash-receipt.component';

describe('AddCashReceiptComponent', () => {
  let component: AddCashReceiptComponent;
  let fixture: ComponentFixture<AddCashReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCashReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCashReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
