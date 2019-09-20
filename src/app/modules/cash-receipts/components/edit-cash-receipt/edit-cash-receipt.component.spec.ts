import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashReceiptComponent } from './edit-cash-receipt.component';

describe('EditCashReceiptComponent', () => {
  let component: EditCashReceiptComponent;
  let fixture: ComponentFixture<EditCashReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCashReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCashReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
