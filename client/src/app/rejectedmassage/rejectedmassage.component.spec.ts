import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedmassageComponent } from './rejectedmassage.component';

describe('RejectedmassageComponent', () => {
  let component: RejectedmassageComponent;
  let fixture: ComponentFixture<RejectedmassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedmassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedmassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
