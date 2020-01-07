import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitMaintenanceComponent } from './edit-unit-maintenance.component';

describe('EditUnitMaintenanceComponent', () => {
  let component: EditUnitMaintenanceComponent;
  let fixture: ComponentFixture<EditUnitMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUnitMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
