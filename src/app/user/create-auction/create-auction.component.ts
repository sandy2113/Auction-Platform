import { Component } from '@angular/core';
import { UserService } from '../../user/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss']
})
export class CreateAuctionComponent {
   auctionForm!: FormGroup;
  products = [
    { id: 'prod1', name: 'Landscape Painting' },
    { id: 'prod2', name: 'Wireless Headphones' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAuctionComponent>,
    private dialog: MatDialog
  ) {
    this.auctionForm = this.fb.group({
      auctionName: [''],
      startDate: [''],
      endDate: [''],
      startPrice: [''],
      productId: [''],
    });
  }

  openCreateProductDialog() {
    const dialogRef = this.dialog.open(ProductComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(newProduct => {
      if (newProduct) {
        this.products.push(newProduct);
        this.auctionForm.patchValue({ productId: newProduct.id });
      }
    });
  }

  saveAuction() {
    console.log('Auction saved!', this.auctionForm.value);
    this.dialogRef.close(this.auctionForm.value);
  }

}