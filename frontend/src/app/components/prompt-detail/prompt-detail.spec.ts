import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptDetail } from './prompt-detail';

describe('PromptDetail', () => {
  let component: PromptDetail;
  let fixture: ComponentFixture<PromptDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
