import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicomviewComponent } from './dicomview.component';

describe('DicomviewComponent', () => {
  let component: DicomviewComponent;
  let fixture: ComponentFixture<DicomviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicomviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicomviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
