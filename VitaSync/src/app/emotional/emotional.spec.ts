import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emotional } from './emotional';

describe('Emotional', () => {
  let component: Emotional;
  let fixture: ComponentFixture<Emotional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emotional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emotional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
