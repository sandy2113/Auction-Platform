import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBidsDetailsComponent } from './product-bids-details.component';

describe('ProductBidsDetailsComponent', () => {
  let component: ProductBidsDetailsComponent;
  let fixture: ComponentFixture<ProductBidsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBidsDetailsComponent]
    });
    fixture = TestBed.createComponent(ProductBidsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
