import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactmailComponent } from './contactmail.component';

describe('ContactmailComponent', () => {
  let component: ContactmailComponent;
  let fixture: ComponentFixture<ContactmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
