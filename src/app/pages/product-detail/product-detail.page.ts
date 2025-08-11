import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
  <div class="product-shell" *ngIf="product(); else loadingTpl">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a routerLink="/products" [queryParams]="product()?.categoryId ? { category: product()!.categoryId } : null">Productos</a>
      <span aria-hidden="true">/</span>
      <span class="current" [innerText]="product()!.title"></span>
    </nav>

    <div class="detail">
      <div class="media-col">
        <div class="media-frame">
          <img class="image" [src]="product()!.image" [alt]="product()!.title" />
        </div>
      </div>
      <div class="info">
        <h1 class="title">{{ product()!.title }}</h1>
        <p class="desc" *ngIf="product()!.description">{{ product()!.description }}</p>
        <div class="price-row">
          <span class="price">{{ product()!.price | currency:'GTQ':'symbol':'1.2-2' }}</span>
          <span class="vat-note">IVA incluido</span>
        </div>
        <div class="purchase">
          <div class="qty-picker" aria-label="Cantidad">
            <button type="button" (click)="decQty()" [disabled]="qty() === 1" aria-label="Disminuir cantidad">−</button>
            <input aria-label="Cantidad" [value]="qty()" (input)="onQtyInput($any($event.target).value)" />
            <button type="button" (click)="incQty()" aria-label="Incrementar cantidad">+</button>
          </div>
          <button mat-raised-button color="primary" class="add-btn" (click)="addToCart()">
            <mat-icon>add_shopping_cart</mat-icon>
            Añadir al carrito
          </button>
          <a mat-button routerLink="/products" [queryParams]="product()?.categoryId ? { category: product()!.categoryId } : null">Volver</a>
        </div>
        <section class="extra" aria-label="Detalles adicionales">
          <h2>Detalles</h2>
          <ul>
            <li><strong>ID:</strong> {{ product()!.id }}</li>
            <li *ngIf="product()!.categoryId"><strong>Categoría:</strong> {{ product()!.categoryId }}</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
  <ng-template #loadingTpl>
    <div class="loading-skel">
      <div class="pulse img"></div>
      <div class="pulse line w60"></div>
      <div class="pulse line w40"></div>
    </div>
  </ng-template>
  `,
  styles: [`
    .product-shell { display: grid; gap: 32px; }
    .breadcrumb { font-size: .8rem; display: flex; align-items: center; gap: 6px; color: #436453; }
    .breadcrumb a { color: var(--brand-primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .detail { display: grid; grid-template-columns: minmax(320px,480px) 1fr; gap: 56px; align-items: start; }
    .media-col { position: relative; }
    .media-frame { position: sticky; top: 90px; border-radius: 32px; background: linear-gradient(155deg,#ffffff,#f1f6f3); padding: 40px 40px 56px; box-shadow: 0 20px 60px -18px rgba(0,0,0,.25), 0 4px 16px -2px rgba(0,0,0,.12); }
    .image { width: 100%; max-height: 520px; object-fit: contain; display: block; filter: drop-shadow(0 8px 24px rgba(0,0,0,.18)); }
    .info { display: flex; flex-direction: column; gap: 16px; }
    .title { margin: 0; font-size: clamp(1.9rem,2.6vw,2.6rem); font-family: 'Poppins'; line-height: 1.1; }
    .desc { margin: 0; font-size: 1rem; line-height: 1.5; color: #2f4038; max-width: 60ch; }
    .price-row { display: flex; align-items: baseline; gap: 16px; margin-top: 4px; }
    .price { font-size: 2.2rem; font-weight: 600; background: linear-gradient(90deg,var(--brand-primary),var(--brand-primary-alt)); -webkit-background-clip: text; background-clip: text; color: var(--brand-primary); line-height: 1.15; display: inline-block; padding-bottom: 4px; }
    /* Fallback for browsers that clip descenders on gradient text */
    @supports (-webkit-background-clip:text) {
      .price { color: transparent; }
    }
    .vat-note { font-size: .7rem; letter-spacing: .5px; text-transform: uppercase; color: #5c6f64; font-weight: 600; }
    .purchase { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 8px; }
    .qty-picker { display: inline-flex; align-items: stretch; background: #fff; border: 1px solid #d9e5df; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
    .qty-picker button { background: #f2f7f4; border: 0; width: 40px; font-size: 20px; cursor: pointer; display: grid; place-items: center; color: #1e362b; font-weight: 600; }
    .qty-picker button:hover:not(:disabled) { background: #e7f1ec; }
    .qty-picker button:disabled { opacity: .3; cursor: not-allowed; }
    .qty-picker input { width: 56px; text-align: center; border: 0; outline: none; font-size: 16px; font-weight: 600; background: transparent; }
    .add-btn mat-icon { margin-right: 4px; }
    .extra { margin-top: 8px; background: #fff; padding: 20px 24px 24px; border-radius: 20px; box-shadow: 0 4px 18px -4px rgba(0,0,0,.15); }
    .extra h2 { margin: 0 0 12px; font-size: 1.1rem; font-family: 'Poppins'; }
    .extra ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; font-size: .9rem; }
    .extra li strong { color: #264736; font-weight: 600; }
    .loading-skel { display: grid; gap: 16px; max-width: 480px; margin: 40px auto; }
    .pulse { position: relative; overflow: hidden; background: linear-gradient(90deg,#e9f0ec,#f4f8f6,#e9f0ec); background-size: 200% 100%; animation: pulse 2s linear infinite; border-radius: 12px; }
    .pulse.img { height: 280px; border-radius: 24px; }
    .pulse.line { height: 20px; }
    .pulse.w60 { width: 60%; }
    .pulse.w40 { width: 40%; }
    @keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 1100px) { .detail { gap: 40px; } }
    @media (max-width: 900px) { .detail { grid-template-columns: 1fr; } .media-frame { position: relative; top: 0; } }
  `]
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private products = inject(ProductsService);
  private cart = inject(CartService);

  product = signal<Product | undefined>(undefined);
  qty = signal<number>(1);

  async ngOnInit() {
    if (!this.products.products().length) await this.products.loadAll();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.product.set(this.products.getProduct(id));
  }

  addToCart() { const p = this.product(); if (p) this.cart.add(p, this.qty()); }
  incQty() { this.qty.set(this.qty() + 1); }
  decQty() { if (this.qty() > 1) this.qty.set(this.qty() - 1); }
  onQtyInput(v: string) { const n = Math.max(1, Math.min(999, Number(v) || 1)); this.qty.set(n); }
}
