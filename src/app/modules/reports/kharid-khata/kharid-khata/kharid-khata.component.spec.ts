import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KharidKhataComponent } from './kharid-khata.component';

describe('KharidKhataComponent', () => {
  let component: KharidKhataComponent;
  let fixture: ComponentFixture<KharidKhataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KharidKhataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KharidKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
