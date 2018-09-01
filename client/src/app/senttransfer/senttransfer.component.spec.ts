import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenttransferComponent } from './senttransfer.component';

describe('SenttransferComponent', () => {
  let component: SenttransferComponent;
  let fixture: ComponentFixture<SenttransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenttransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenttransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
