import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoutine } from './create-routine';

describe('CreateRoutine', () => {
  let component: CreateRoutine;
  let fixture: ComponentFixture<CreateRoutine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoutine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoutine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
