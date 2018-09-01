import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashtransferComponent } from './trashtransfer.component';

describe('TrashtransferComponent', () => {
  let component: TrashtransferComponent;
  let fixture: ComponentFixture<TrashtransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashtransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashtransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
