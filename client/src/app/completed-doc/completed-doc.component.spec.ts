import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedDocComponent } from './completed-doc.component';

describe('CompletedDocComponent', () => {
  let component: CompletedDocComponent;
  let fixture: ComponentFixture<CompletedDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
