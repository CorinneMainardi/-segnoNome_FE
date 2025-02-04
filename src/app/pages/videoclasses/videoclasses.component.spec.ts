import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoclassesComponent } from './videoclasses.component';

describe('VideoclassesComponent', () => {
  let component: VideoclassesComponent;
  let fixture: ComponentFixture<VideoclassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoclassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
