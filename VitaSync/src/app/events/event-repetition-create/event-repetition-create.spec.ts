import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRepetitionCreate } from './event-repetition-create';

describe('EventRepetitionCreate', () => {
  let component: EventRepetitionCreate;
  let fixture: ComponentFixture<EventRepetitionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRepetitionCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRepetitionCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
