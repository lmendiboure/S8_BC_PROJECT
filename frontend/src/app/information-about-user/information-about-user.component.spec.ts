import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAboutUserComponent } from './information-about-user.component';

describe('InformationAboutUserComponent', () => {
  let component: InformationAboutUserComponent;
  let fixture: ComponentFixture<InformationAboutUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationAboutUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationAboutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
