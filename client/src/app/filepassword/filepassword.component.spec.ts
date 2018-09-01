import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilepasswordComponent } from './filepassword.component';

describe('FilepasswordComponent', () => {
  let component: FilepasswordComponent;
  let fixture: ComponentFixture<FilepasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilepasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
