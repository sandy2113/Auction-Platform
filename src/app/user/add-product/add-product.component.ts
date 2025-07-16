import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/login/authservice';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  product: any = {
    name: '',
    startingBid: 0,
    status: 'Upcoming',
    endTime: ''
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient,private authservice:AuthService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitProduct() {
    if (!this.selectedFile) {
      alert('Please select an image.');
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const sellerId = user.userId;
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('startingBid', this.product.startingBid.toString());
    formData.append('status', this.product.status);
    formData.append('endTime', this.product.endTime);
    formData.append('image', this.selectedFile);
    formData.append('startTime', this.product.startTime);
    formData.append('sellerId',sellerId);

    this.http.post(this.authservice.baseServiceUrl+'api/auction-products', formData).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert('Something went wrong.');
      }
    });
  }

  resetForm() {
    this.product = {
      name: '',
      startingBid: 0,
      status: 'Upcoming',
      endTime: ''
    };
    this.selectedFile = null;
  }
}
