import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterializedViewComponent } from './materialized-view.component';

describe('MaterializedViewComponent', () => {
  let component: MaterializedViewComponent;
  let fixture: ComponentFixture<MaterializedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterializedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterializedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
