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


  useJsonserver: boolean = this.service.useJsonServer;
  useStaticArray: boolean = this.service.useStaticArray;


  totalAmount = 0;
  products: any = [];

  constructor(private service: DataService) {

    //  ********* STATIC ARRAY ********* //
    if(this.useStaticArray){
      this.products=this.service.arr;
      this.totalAmount = this.getTotalAmount();
    }
  
    //  ********* JSON SERVER ********* // 
    if(this.useJsonserver){
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
    
    //  ********* JSON SERVER ********* // 
    if(this.useJsonserver){
      this.service.updateCart(product).subscribe();
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity === 1) return;
    product.quantity -= 1;
    this.totalAmount -= product.price;
    
    //  ********* JSON SERVER ********* // 
    if(this.useJsonserver){
      this.service.updateCart(product).subscribe();
    }
  }

  isBuy = false;
  buyItem() {
    this.isBuy = true;
    this.clearCart();
  }

  clearCart() {

    //  ********* JSON SERVER ********* // 
    if(this.useJsonserver){
      this.products.forEach((product: any) => {
        this.service.deleteItemFromCart(product.id).subscribe(()=>{
          this.service.updateCartCount();
        });
      });
    }

    this.products = [];
  }

  deleteItem(id: any) {
    
    //  ********* JSON SERVER ********* // 
    if(this.useJsonserver){
      this.service.deleteItemFromCart(id).subscribe(() => {
        this.products= this.products.filter((item: any) => item.id !== id);
        this.service.updateCartCount();
        this.getTotalAmount();
      });
    }

    //  ********* STATIC ARRAY ********* // 
    if(this.useStaticArray){
      const prod= this.products.filter((item: any) => item.id !== id);
        this.products=prod;
        this.service.arr=this.products;
        this.service.updateCartCount();
    }
  }

  getTotalAmount() {
    this.totalAmount=0;
      this.products.forEach((product: any) => {
        this.totalAmount += product.quantity * product.price;
      });
    return this.totalAmount;
  }
}
