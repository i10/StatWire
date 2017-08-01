import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatletGroupComponent } from './statletgroup.component';

describe('StatletGroupComponent', () => {
  let component: StatletGroupComponent;
  let fixture: ComponentFixture<StatletGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatletGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatletGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
