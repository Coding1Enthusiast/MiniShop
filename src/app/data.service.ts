import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  useJsonServer: boolean = true;
  useStaticArray: boolean = false;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount();
  }

  updateCartCount(): void {
    //  ********* STATIC ARRAY ********* //
    if (this.useStaticArray) this.cartCountSubject.next(this.arr.length);
    else {
      this.getItemsFromCart().subscribe((data) => {
        this.cartCountSubject.next(data.length);
      });
    }

    //  ********* JSON SERVER ********* //
  }

  getAllItems(): Observable<any> {
    return this.http.get(
      `https://impaproductcartapi.azurewebsites.net/api/products`
    );
  }

  getItemById(id: any): Observable<any> {
    return this.http
      .get(`https://impaproductcartapi.azurewebsites.net/api/products/${id}`)
      .pipe(
        catchError(() => {
          console.log('Error');

          return of(null);
        })
      );
  }

  addTocart(productDetails: any): Observable<any> {
    return this.http.post(`http://localhost:3000/cart`, productDetails);
  }

  getItemsFromCart(): Observable<any> {
    return this.http
      .get<any>(`http://localhost:3000/cart`)
      .pipe(
        map((products: any[]) =>
          products.sort(
            (a, b) =>
              new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
          )
        )
      );
  }

  getItemFromCart(id: any) {
    return this.http.get(`http://localhost:3000/cart/${id}`);
  }

  deleteItemFromCart(id: any) {
    return this.http.delete<any>(`http://localhost:3000/cart/${id}`);
  }

  updateCart(productDetails: any) {
    return this.http.put(
      `http://localhost:3000/cart/${productDetails.id}`,
      productDetails
    );
  }

  // Local Array
  arr: any = [];

  isExisting = false;
  updateArray(arr: any) {
    const isExisting = this.arr.find((item: any) => item.id === arr.id);
    if (isExisting) {
      const quantity = arr.quantity + isExisting.quantity>5 ? 5 : arr.quantity + isExisting.quantity
      this.updateExistingArray(arr.id, quantity);
    } else {
      this.arr.push(arr);
      this.updateCartCount();
    }
  }

  updateExistingArray(id: any, quantity: any) {
    this.arr = this.arr.map((item: any) => {
      if (item.id === id) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
  }
}
