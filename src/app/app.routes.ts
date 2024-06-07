import { Routes } from '@angular/router';
import { ProductdetailsComponent } from './Components/productdetails/productdetails.component';
import { ProductsComponent } from './Components/products/products.component';
import { CartComponent } from './Components/cart/cart.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

export const routes: Routes = [
    {
        path:'',
        component:ProductsComponent
    },
    {
        path:'products/:id',
        component:ProductdetailsComponent
    },
    {
        path:'cart',
        component:CartComponent
    },
    {
        path:'**',
        component:PagenotfoundComponent
    }
];
