import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedmailComponent } from './rejectedmail.component';

describe('RejectedmailComponent', () => {
  let component: RejectedmailComponent;
  let fixture: ComponentFixture<RejectedmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
