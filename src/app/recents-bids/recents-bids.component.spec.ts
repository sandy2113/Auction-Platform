import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentsBidsComponent } from './recents-bids.component';

describe('RecentsBidsComponent', () => {
  let component: RecentsBidsComponent;
  let fixture: ComponentFixture<RecentsBidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentsBidsComponent]
    });
    fixture = TestBed.createComponent(RecentsBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
