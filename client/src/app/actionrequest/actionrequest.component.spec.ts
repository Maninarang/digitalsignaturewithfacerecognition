import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionrequestComponent } from './actionrequest.component';

describe('ActionrequestComponent', () => {
  let component: ActionrequestComponent;
  let fixture: ComponentFixture<ActionrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
