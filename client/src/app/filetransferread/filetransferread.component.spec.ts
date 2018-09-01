import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiletransferreadComponent } from './filetransferread.component';

describe('FiletransferreadComponent', () => {
  let component: FiletransferreadComponent;
  let fixture: ComponentFixture<FiletransferreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiletransferreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiletransferreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
