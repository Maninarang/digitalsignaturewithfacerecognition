import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentuserdetailsComponent } from './documentuserdetails.component';

describe('DocumentuserdetailsComponent', () => {
  let component: DocumentuserdetailsComponent;
  let fixture: ComponentFixture<DocumentuserdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentuserdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentuserdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
