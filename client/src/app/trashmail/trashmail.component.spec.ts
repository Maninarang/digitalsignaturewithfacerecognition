import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashmailComponent } from './trashmail.component';

describe('TrashmailComponent', () => {
  let component: TrashmailComponent;
  let fixture: ComponentFixture<TrashmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
