import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicomviewerComponent } from './dicomviewer.component';

describe('DicomviewerComponent', () => {
  let component: DicomviewerComponent;
  let fixture: ComponentFixture<DicomviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicomviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicomviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
