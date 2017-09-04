import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerNodeComponent } from './viewer-node.component';

describe('ViewerNodeComponent', () => {
  let component: ViewerNodeComponent;
  let fixture: ComponentFixture<ViewerNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
