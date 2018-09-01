import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitinitialsComponent } from './exitinitials.component';

describe('ExitinitialsComponent', () => {
  let component: ExitinitialsComponent;
  let fixture: ComponentFixture<ExitinitialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitinitialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitinitialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
