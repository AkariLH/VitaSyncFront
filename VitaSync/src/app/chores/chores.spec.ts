import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chores } from './chores';

describe('Chores', () => {
  let component: Chores;
  let fixture: ComponentFixture<Chores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
