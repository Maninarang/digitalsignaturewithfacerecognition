import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmailtranferComponent } from './readmailtranfer.component';

describe('ReadmailtranferComponent', () => {
  let component: ReadmailtranferComponent;
  let fixture: ComponentFixture<ReadmailtranferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadmailtranferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadmailtranferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
