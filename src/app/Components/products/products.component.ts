import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  data:any;
  constructor(private service:DataService,private spinner:NgxSpinnerService){

    spinner.show();
    this.service.getAllItems().subscribe((data)=>{

      spinner.hide();
      this.data=data;      
    })
  }
}
