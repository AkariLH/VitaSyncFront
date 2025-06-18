import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCategoryCreate } from './event-category-create';

describe('EventCategoryCreate', () => {
  let component: EventCategoryCreate;
  let fixture: ComponentFixture<EventCategoryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCategoryCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCategoryCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
