import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAllocationMastersComponent } from './budget-allocation-masters.component';

describe('BudgetAllocationMastersComponent', () => {
  let component: BudgetAllocationMastersComponent;
  let fixture: ComponentFixture<BudgetAllocationMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetAllocationMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAllocationMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
