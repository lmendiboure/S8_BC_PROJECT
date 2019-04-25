import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementComponent } from './suivre.component';

describe('SuivreComponent', () => {
  let component: SuivreComponent;
  let fixture: ComponentFixture<SuivreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuivreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
