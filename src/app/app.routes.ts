import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'products?category=13' },
	{
		path: 'products',
		loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
	},
	{
		path: 'product/:id',
		loadComponent: () => import('./pages/product-detail/product-detail.page').then(m => m.ProductDetailPage)
	},
	{
		path: 'cart',
		loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage)
	},
	{
		path: 'return-policy',
		loadComponent: () => import('./return-policy.component').then(m => m.ReturnPolicyComponent)
	},
	{ path: '**', redirectTo: 'products' }
];
