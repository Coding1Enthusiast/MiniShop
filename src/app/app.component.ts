import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { log } from 'console';
import { CartComponent } from './Components/cart/cart.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,CartComponent,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mini Shop';
  count=0;
  constructor(private service:DataService){
    this.service.cartCount$.subscribe(count => {
      this.count = count;
    });
  }
}
