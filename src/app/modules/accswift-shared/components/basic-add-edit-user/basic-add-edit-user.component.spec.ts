import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicAddEditUserComponent } from './basic-add-edit-user.component';

describe('BasicAddEditUserComponent', () => {
  let component: BasicAddEditUserComponent;
  let fixture: ComponentFixture<BasicAddEditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicAddEditUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAddEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
