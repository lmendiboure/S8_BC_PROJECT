import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDiffusionVideoComponent } from './manage-diffusion-video.component';

describe('ManageDiffusionVideoComponent', () => {
  let component: ManageDiffusionVideoComponent;
  let fixture: ComponentFixture<ManageDiffusionVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDiffusionVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDiffusionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
