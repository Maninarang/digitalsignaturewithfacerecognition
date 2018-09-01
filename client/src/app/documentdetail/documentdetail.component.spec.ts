import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentdetailComponent } from './documentdetail.component';

describe('DocumentdetailComponent', () => {
  let component: DocumentdetailComponent;
  let fixture: ComponentFixture<DocumentdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
