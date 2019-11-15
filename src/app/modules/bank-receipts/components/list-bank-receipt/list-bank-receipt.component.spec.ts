import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankReceiptComponent } from './list-bank-receipt.component';

describe('ListBankReceiptComponent', () => {
  let component: ListBankReceiptComponent;
  let fixture: ComponentFixture<ListBankReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBankReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
