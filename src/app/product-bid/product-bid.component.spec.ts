import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBidComponent } from './product-bid.component';

describe('ProductBidComponent', () => {
  let component: ProductBidComponent;
  let fixture: ComponentFixture<ProductBidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBidComponent]
    });
    fixture = TestBed.createComponent(ProductBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
