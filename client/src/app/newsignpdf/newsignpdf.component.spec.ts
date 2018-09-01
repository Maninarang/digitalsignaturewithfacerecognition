import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsignpdfComponent } from './newsignpdf.component';

describe('NewsignpdfComponent', () => {
  let component: NewsignpdfComponent;
  let fixture: ComponentFixture<NewsignpdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsignpdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsignpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
