import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideorecComponent } from './videorec.component';

describe('VideorecComponent', () => {
  let component: VideorecComponent;
  let fixture: ComponentFixture<VideorecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideorecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideorecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
