import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePoolComponent } from './node-pool.component';

describe('NodePoolComponent', () => {
  let component: NodePoolComponent;
  let fixture: ComponentFixture<NodePoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodePoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
