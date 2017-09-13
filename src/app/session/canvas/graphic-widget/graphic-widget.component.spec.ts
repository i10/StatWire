import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicWidgetComponent } from './graphic-widget.component';

describe('GraphicWidgetComponent', () => {
  let component: GraphicWidgetComponent;
  let fixture: ComponentFixture<GraphicWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
