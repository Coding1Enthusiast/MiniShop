// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from '../../data.service';
// import { error, log } from 'console';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-productdetails',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './productdetails.component.html',
//   styleUrl: './productdetails.component.css',
// })
// export class ProductdetailsComponent {
//   variants = [];
//   productId: any;
//   product: any;
//   variant: any;
//   price: any;

//   productNotFound: boolean = false;

//   constructor(
//     private activeRoute: ActivatedRoute,
//     private service: DataService,
//     private route: Router
//   ) {
//     this.activeRoute.paramMap.subscribe((params) => {
//       this.productId = params.get('id');
//       this.productNotFound=!this.productId.match(/^[0-9]*$/)
//       if(this.productId && !this.productNotFound){
//         this.service.getItemById(this.productId).subscribe(
//           (data) => {
//             if(data){

//               if (data.variants && data.variants.length > 0) {
//                 this.product = data;
//                 this.variant = this.product.variants[0].variant;
//                 this.variants = this.product.variants;
//                 this.price = this.product.variants[0].price;
//               } else {
//                 this.productNotFound = true;
//             }
//           }
//           },
//           (error) => {
//             this.productNotFound = true
//             console.log("Error : ",error);

//           }
//         );
//       }
//     });
//   }

//   //selected variant
//   v: any;
//   setPrice() {
//     this.product.variants.map((item: any) => {
//       if (item.variant === this.variant) this.price = item.price * this.count;
//     });
//   }

//   // Quantity of Product
//   count = 1;
//   increaseQuantity() {
//     if (this.count === 5) return;
//     this.count += 1;
//     this.setPrice();
//   }
//   decreaseQuantity() {
//     if (this.count === 1) return;
//     this.count -= 1;
//     this.setPrice();
//   }

//   //Add to cart
//   addToCart(product: any) {
//     this.service.getItemsFromCart().subscribe((data) => {
//       if (data.some((item: any) => item.id === product.id + this.variant)) {
//         console.log('product already added');
//         return;
//       } else {
//         this.price = this.price / this.count;
//         const cartData = {
//           id: product.id + this.variant,
//           model: product.model,
//           image: product.image,
//           variant: this.variant,
//           price: this.price,
//           quantity: this.count,
//           dateAdded: new Date(),
//         };

//         this.service.addTocart(cartData).subscribe(() => {});
//         this.service.updateCartCount();
//         this.route.navigate(['/']);
//       }
//     });
//   }

//   goHome(){
//     this.route.navigateByUrl('/');
//   }
// }
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { error, log } from 'console';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css',
})
export class ProductdetailsComponent {
  useJsonserver: boolean = this.service.useJsonServer;
  useStaticArray: boolean = this.service.useStaticArray;

  variants = [];
  productId: any;
  product: any;
  variant: any;
  price: any;

  singleProductPrice: any;

  localArray: any = [];

  productNotFound: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private service: DataService,
    private route: Router,
    private spinner:NgxSpinnerService
  ) {

    this.spinner.show();
    this.activeRoute.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      this.productNotFound = !this.productId.match(/^[0-9]*$/);
      if (this.productId && !this.productNotFound) {
        this.service.getItemById(this.productId).subscribe(
          (data) => {
            if (data) {
              if (data.variants && data.variants.length > 0) {
                this.product = data;
                this.variant = this.product.variants[0].variant;
                this.variants = this.product.variants;
                this.price = this.product.variants[0].price;
                this.singleProductPrice = this.price;

                this.spinner.hide();
                } else {
                  this.productNotFound = true;
                  this.spinner.hide();
                  }
                  }
                  },
                  (error) => {
                    this.productNotFound = true;
                    console.log('Error : ', error);
                    this.spinner.hide();
          }
        );
      }
    });
  }

  //selected variant
  setPrice() {
    this.product.variants.map((item: any) => {
      if (item.variant === this.variant) {
        this.price = item.price * this.count;

        this.singleProductPrice = item.price;
      }
    });
  }

  // Quantity of Product
  count = 1;
  increaseQuantity() {
    if (this.count === 5) return;
    this.count += 1;
    this.setPrice();
  }
  decreaseQuantity() {
    if (this.count === 1) return;
    this.count -= 1;
    this.setPrice();
  }

  //Add to cart
  addToCart(product: any) {
    this.price = this.price / this.count;
    const cartData = {
      id: product.id + this.variant,
      model: product.model,
      image: product.image,
      variant: this.variant,
      price: this.price,
      quantity: this.count,
      dateAdded: new Date(),
    };

    //  ********* STATIC ARRAY ********* //
    if (this.useStaticArray) {
      this.service.updateArray(cartData);
      this.navigateToHome();
    }

    //  ********* JSON SERVER ********* //
    if (this.useJsonserver) {
      this.service.getItemsFromCart().subscribe((data) => {
        const isExisting = data.find(
          (item: any) => item.id === product.id + this.variant
        );
        if (isExisting) {
          cartData.quantity += isExisting.quantity;

          console.log(cartData.quantity);

          this.service.updateCart(cartData).subscribe();
          console.log('product already added');
          this.route.navigate(['/']);
          return;
        } else {
          this.service.addTocart(cartData).subscribe(() => {});
          this.service.updateCartCount();
          this.route.navigate(['/']);
        }
      });
    }
  }

  navigateToHome() {
    this.route.navigateByUrl('/');
  }
}
