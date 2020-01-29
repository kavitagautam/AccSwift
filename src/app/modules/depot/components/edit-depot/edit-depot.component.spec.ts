import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDepotComponent } from './edit-depot.component';

describe('EditDepotComponent', () => {
  let component: EditDepotComponent;
  let fixture: ComponentFixture<EditDepotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDepotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
