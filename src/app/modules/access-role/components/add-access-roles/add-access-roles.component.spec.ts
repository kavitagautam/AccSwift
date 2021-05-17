import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessRolesComponent } from './add-access-roles.component';

describe('AddAccessRolesComponent', () => {
  let component: AddAccessRolesComponent;
  let fixture: ComponentFixture<AddAccessRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccessRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
