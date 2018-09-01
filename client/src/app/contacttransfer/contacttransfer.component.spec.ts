import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacttransferComponent } from './contacttransfer.component';

describe('ContacttransferComponent', () => {
  let component: ContacttransferComponent;
  let fixture: ComponentFixture<ContacttransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContacttransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContacttransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
