import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramPage } from './diagram-page';

describe('DiagramPage', () => {
  let component: DiagramPage;
  let fixture: ComponentFixture<DiagramPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
