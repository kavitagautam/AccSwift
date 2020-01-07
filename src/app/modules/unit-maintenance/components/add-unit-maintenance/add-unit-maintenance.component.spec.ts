import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitMaintenanceComponent } from './add-unit-maintenance.component';

describe('AddUnitMaintenanceComponent', () => {
  let component: AddUnitMaintenanceComponent;
  let fixture: ComponentFixture<AddUnitMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
