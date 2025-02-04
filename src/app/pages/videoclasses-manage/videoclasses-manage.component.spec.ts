import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoclassesManageComponent } from './videoclasses-manage.component';

describe('VideoclassesManageComponent', () => {
  let component: VideoclassesManageComponent;
  let fixture: ComponentFixture<VideoclassesManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoclassesManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoclassesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
