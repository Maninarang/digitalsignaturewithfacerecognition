import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposefiletransferComponent } from './composefiletransfer.component';

describe('ComposefiletransferComponent', () => {
  let component: ComposefiletransferComponent;
  let fixture: ComponentFixture<ComposefiletransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposefiletransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposefiletransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
