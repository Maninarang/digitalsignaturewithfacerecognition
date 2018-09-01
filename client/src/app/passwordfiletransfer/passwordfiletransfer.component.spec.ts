import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordfiletransferComponent } from './passwordfiletransfer.component';

describe('PasswordfiletransferComponent', () => {
  let component: PasswordfiletransferComponent;
  let fixture: ComponentFixture<PasswordfiletransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordfiletransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordfiletransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
