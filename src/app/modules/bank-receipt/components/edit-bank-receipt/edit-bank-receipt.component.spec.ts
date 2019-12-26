import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankReceiptComponent } from './edit-bank-receipt.component';

describe('EditBankReceiptComponent', () => {
  let component: EditBankReceiptComponent;
  let fixture: ComponentFixture<EditBankReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
