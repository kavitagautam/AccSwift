import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankReceiptComponent } from './add-bank-receipt.component';

describe('AddBankReceiptComponent', () => {
  let component: AddBankReceiptComponent;
  let fixture: ComponentFixture<AddBankReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
