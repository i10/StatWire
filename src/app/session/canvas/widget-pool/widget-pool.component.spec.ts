import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPoolComponent } from './widget-pool.component';

describe('WidgetPoolComponent', () => {
  let component: WidgetPoolComponent;
  let fixture: ComponentFixture<WidgetPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
