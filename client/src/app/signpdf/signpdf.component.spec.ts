import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignpdfComponent } from './signpdf.component';

describe('SignpdfComponent', () => {
  let component: SignpdfComponent;
  let fixture: ComponentFixture<SignpdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignpdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
