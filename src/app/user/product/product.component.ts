import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductComponent>
  ) {
    this.productForm = this.fb.group({
      name: [''],
      image: [''],
      description: [''],
    });
  }

  saveProduct() {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: this.productForm.value.name,
      image: this.productForm.value.image,
      description: this.productForm.value.description,
    };

    this.dialogRef.close(newProduct);
  }
}
