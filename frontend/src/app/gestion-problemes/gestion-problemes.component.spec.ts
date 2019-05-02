import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProblemesComponent } from './gestion-problemes.component';

describe('GestionProblemesComponent', () => {
  let component: GestionProblemesComponent;
  let fixture: ComponentFixture<GestionProblemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionProblemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionProblemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
