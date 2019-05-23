import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEntrantesComponent } from './video-entrantes.component';

describe('VideoEntrantesComponent', () => {
  let component: VideoEntrantesComponent;
  let fixture: ComponentFixture<VideoEntrantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoEntrantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoEntrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
