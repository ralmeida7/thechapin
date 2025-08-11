import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'products' },
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
	{ path: '**', redirectTo: 'products' }
];
