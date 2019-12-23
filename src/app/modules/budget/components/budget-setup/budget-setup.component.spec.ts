import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSetupComponent } from './budget-setup.component';

describe('BudgetSetupComponent', () => {
  let component: BudgetSetupComponent;
  let fixture: ComponentFixture<BudgetSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
