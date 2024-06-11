import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  useStaticArray: boolean = this.service.useStaticArray;
  totalAmount:number = 0;
  products: any = [];
  isBuy:boolean = false;

  constructor(private service: DataService) {
    
    if (this.useStaticArray) {
      this.products = this.service.arr;
      this.totalAmount = this.getTotalAmount();
    } else {
      this.service.getItemsFromCart().subscribe((data) => {
        this.products = data;
        this.totalAmount = this.getTotalAmount();
      });
    }
  }

  increaseQuantity(product: any) {
    if (product.quantity === 5) return;
    product.quantity += 1;
    this.totalAmount += product.price;

    if (!this.useStaticArray) {
      this.service.updateCart(product).subscribe();
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity === 1) return;
    product.quantity -= 1;
    this.totalAmount -= product.price;

    if (!this.useStaticArray) {
      this.service.updateCart(product).subscribe();
    }
  }


  buyItem() {
    this.isBuy = true;
    this.clearCart();
  }

  clearCart() {
    if (!this.useStaticArray) {
      this.products.forEach((product: any) => {
        this.service.deleteItemFromCart(product.id).subscribe(() => {
          this.service.updateCartCount();
        });
      });
    } else {
      this.products = [];
      this.service.arr = [];
      this.service.updateCartCount();
    }
  }

  deleteItem(id: any) {
    if (this.useStaticArray) {
      const prod = this.products.filter((item: any) => item.id !== id);
      this.products = prod;
      this.service.arr = this.products;
      this.service.updateCartCount();
    } else {
      this.service.deleteItemFromCart(id).subscribe(() => {
        this.products = this.products.filter((item: any) => item.id !== id);
        this.service.updateCartCount();
        this.getTotalAmount();
      });
    }
  }

  getTotalAmount() {
    this.totalAmount = 0;
    this.products.forEach((product: any) => {
      this.totalAmount += product.quantity * product.price;
    });
    return this.totalAmount;
  }
}
