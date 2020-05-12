import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPreferenceComponent } from './series-preference.component';

describe('SeriesPreferenceComponent', () => {
  let component: SeriesPreferenceComponent;
  let fixture: ComponentFixture<SeriesPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
