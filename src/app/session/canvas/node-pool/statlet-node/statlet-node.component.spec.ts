import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatletNodeComponent } from './statlet-node.component';

describe('StatletNodeComponent', () => {
  let component: StatletNodeComponent;
  let fixture: ComponentFixture<StatletNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatletNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatletNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
