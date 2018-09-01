import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMailFileComponent } from './view-mail-file.component';

describe('ViewMailFileComponent', () => {
  let component: ViewMailFileComponent;
  let fixture: ComponentFixture<ViewMailFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMailFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMailFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
