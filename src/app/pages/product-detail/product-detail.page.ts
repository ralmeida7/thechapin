import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
  @if (product()) {
    <div class="detail">
      <img class="image" [src]="product()!.image" [alt]="product()!.title" />
      <div class="info">
        <h2>{{ product()!.title }}</h2>
        <p>{{ product()!.description }}</p>
        <h3>{{ product()!.price | currency:'GTQ':'symbol':'1.2-2' }}</h3>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="addToCart()">
            <mat-icon>add_shopping_cart</mat-icon>
            Add to cart
          </button>
          <a mat-button routerLink="/products">Back to products</a>
        </div>
      </div>
    </div>
  } @else {
    <p>Loading...</p>
  }
  `,
  styles: [`
    .detail { display: grid; grid-template-columns: 400px 1fr; gap: 40px; align-items: start; }
    .image { width: 100%; border-radius: 20px; box-shadow: var(--brand-shadow); background: linear-gradient(145deg,#ffffff,#f1f5f2); padding: 24px; object-fit: contain; }
    h2 { margin: 0 0 8px; font-size: 2rem; font-family: 'Poppins'; }
    h3 { margin: 16px 0; color: var(--brand-primary); font-size: 1.6rem; }
    .actions { display: flex; gap: 16px; margin-top: 24px; }
    @media (max-width: 900px) {
      .detail { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private products = inject(ProductsService);
  private cart = inject(CartService);

  product = signal<Product | undefined>(undefined);

  async ngOnInit() {
    if (!this.products.products().length) await this.products.loadAll();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.product.set(this.products.getProduct(id));
  }

  addToCart() { const p = this.product(); if (p) this.cart.add(p, 1); }
}
