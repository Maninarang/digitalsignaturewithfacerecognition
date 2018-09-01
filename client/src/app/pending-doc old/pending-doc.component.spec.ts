import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDocComponent } from './pending-doc.component';

describe('PendingDocComponent', () => {
  let component: PendingDocComponent;
  let fixture: ComponentFixture<PendingDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
