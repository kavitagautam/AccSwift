import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEntryGridComponent } from './details-entry-grid.component';

describe('DetailsEntryGridComponent', () => {
  let component: DetailsEntryGridComponent;
  let fixture: ComponentFixture<DetailsEntryGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEntryGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEntryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
