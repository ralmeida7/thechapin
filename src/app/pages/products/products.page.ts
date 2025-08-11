import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Category, Product } from '../../models/models';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatIconModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  template: `
  <div class="hero">
    <div class="hero-track">
  <div class="slide gradient-green">
        <div class="slide-content">
          <div>
    <h2 class="hero-head">¡Envío gratis en compras mayores a Q350!</h2>
    <p class="hero-sub">Aprovecha las ofertas de la semana y llena tu carrito con productos frescos.</p>
          </div>
          <img src="https://picsum.photos/seed/coffee-hero/800/200" alt="Coffee" />
        </div>
      </div>
    </div>
  </div>

  <h2 class="section-title">Productos sugeridos</h2>

    <div class="products">
      @for (p of filteredProducts(); track p.id) {
        <mat-card class="product-card">
          <img mat-card-image [src]="p.image" [alt]="p.title" />
          <mat-card-header>
            <mat-card-title>{{ p.title }}</mat-card-title>
            <mat-card-subtitle>
              <span class="price">{{ p.price | currency:'Q ':'symbol':'1.2-2' }}</span>
              <span class="price-old" *ngIf="p.oldPrice">{{ p.oldPrice | currency:'GTQ':'symbol':'1.2-2' }}</span>
              <span class="badge" *ngIf="p.oldPrice">-{{ discount(p) }}%</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ p.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="addToCart(p)">Add to cart</button>
            <a mat-button color="accent" [routerLink]="['/product', p.id]">Details</a>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .hero { margin-bottom: 24px; position: relative; }
    .hero-track { position: relative; border-radius: 24px; overflow: hidden; }
    .slide { width: 100%; min-height: 240px; display: flex; align-items: center; }
    .gradient-green { background: linear-gradient(100deg,#0c7c3d 0%,#089a4a 55%,#15b75b 100%); }
    .slide-content { display: grid; grid-template-columns: 1fr 360px; align-items: center; gap: 24px; padding: 32px 40px; color: white; }
    .slide-content img { width: 100%; height: 220px; object-fit: cover; border-radius: 16px; box-shadow: 0 12px 32px -4px rgba(0,0,0,.4); }
    .hero-head { font-size: clamp(1.6rem,3vw,2.2rem); margin: 0 0 8px; letter-spacing: .5px; }
    .hero-sub { margin: 0; font-weight: 300; font-size: 1.05rem; }
    .section-title { margin: 0 0 20px; font-weight: 600; }
  .grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
  .products { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .product-card { display: flex; flex-direction: column; transition: transform .15s ease, box-shadow .25s ease; box-shadow: 0 2px 6px -2px rgba(0,0,0,.15); position: relative; background: #ffffff; }
  .product-card img[mat-card-image] {
    height: 180px;
    width: 100%;
    object-fit: contain; /* preserve aspect ratio without cropping */
    object-position: center;
    background: linear-gradient(145deg,#ffffff,#f1f5f2);
    padding: 8px;
    box-sizing: border-box;
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -12px rgba(0,0,0,.35); }
  mat-card-content { flex: 1; background: #fafdfb; }
  .price { font-weight: 700; color: var(--mat-sys-primary); margin-right: 8px; }
  .price-old { text-decoration: line-through; opacity: .55; margin-right: 8px; }
  mat-card-content p { color: #2f4038; }
    .badge { position: absolute; top: 10px; left: 10px; background: var(--brand-accent); color: #1b1b1b; border-radius: 10px; padding: 4px 8px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
    @media (max-width: 900px) {
      .slide-content { grid-template-columns: 1fr; text-align: center; padding: 28px 24px; }
      .slide-content img { display: none; }
    }
    @media (max-width: 700px) {
      .products { gap: 14px; }
      .product-card { font-size: .8rem; }
      .product-card img[mat-card-image] { height: 150px; }
    }
    @media (max-width: 520px) {
      .hero-head { font-size: 1.35rem; }
      .hero-sub { font-size: .85rem; }
      .products { grid-template-columns: repeat(auto-fill,minmax(170px,1fr)); }
      .product-card img[mat-card-image] { height: 130px; }
    }
  `]
})
export class ProductsPage implements OnInit {
  private productsSvc = inject(ProductsService);
  private cart = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = this.productsSvc.categories;
  products = this.productsSvc.products;

  selectedCategory = signal<string>('');
  searchQuery = signal<string>('');

  filteredProducts = computed<Product[]>(() => {
    let list = this.products();
    const cat = this.selectedCategory();
    const q = this.searchQuery().trim().toLowerCase();
    if (cat) list = list.filter(p => p.categoryId === cat);
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    return list;
  });

  async ngOnInit() {
    if (!this.products().length) await this.productsSvc.loadAll();
    const categoryFromQuery = this.route.snapshot.queryParamMap.get('category');
    if (categoryFromQuery) this.selectedCategory.set(categoryFromQuery);
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) this.searchQuery.set(q);
    this.route.queryParamMap.subscribe(map => {
      const cat = map.get('category');
      const query = map.get('q');
      this.selectedCategory.set(cat || '');
      this.searchQuery.set(query || '');
  // Dynamically load products for the selected department when navigating via chips
  if (cat) this.productsSvc.ensureDepartmentProducts(cat);
    });
  // If navigated in with a category, ensure its dept products are loaded.
  if (categoryFromQuery) await this.productsSvc.ensureDepartmentProducts(categoryFromQuery);
  }

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }
  async onCategoryChange(value: string) {
    this.selectedCategory.set(value || '');
    const params: any = {};
    if (this.searchQuery()) params.q = this.searchQuery();
    if (value) params.category = value;
    this.router.navigate([], { relativeTo: this.route, queryParams: params });
    // Ensure department products are loaded for this category
    await this.productsSvc.ensureDepartmentProducts(value);
  }
  discount(p: Product & { oldPrice?: number }) {
    if (!p.oldPrice) return 0;
    return Math.round((1 - p.price / p.oldPrice) * 100);
  }
}
