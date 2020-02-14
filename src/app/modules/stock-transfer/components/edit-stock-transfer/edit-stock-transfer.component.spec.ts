import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockTransferComponent } from './edit-stock-transfer.component';

describe('EditStockTransferComponent', () => {
  let component: EditStockTransferComponent;
  let fixture: ComponentFixture<EditStockTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStockTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
