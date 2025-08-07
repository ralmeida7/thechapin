import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list.component';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ReturnPolicyComponent } from './return-policy.component';

export const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'return-policy', component: ReturnPolicyComponent }
];
