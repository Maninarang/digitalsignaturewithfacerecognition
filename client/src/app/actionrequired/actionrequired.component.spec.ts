import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionrequiredComponent } from './actionrequired.component';

describe('ActionrequiredComponent', () => {
  let component: ActionrequiredComponent;
  let fixture: ComponentFixture<ActionrequiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionrequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionrequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
