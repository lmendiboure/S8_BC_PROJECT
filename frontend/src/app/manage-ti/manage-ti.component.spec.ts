import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTIComponent } from './manage-ti.component';

describe('ManageTIComponent', () => {
  let component: ManageTIComponent;
  let fixture: ComponentFixture<ManageTIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
