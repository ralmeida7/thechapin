import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './models';
import { NgForOf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <h2>Products</h2>
    <div class="product-cards">
      <mat-card *ngFor="let product of products" class="product-card">
        <a [routerLink]="['/product', product.id]" style="text-decoration:none;color:inherit;">
          <img mat-card-image [src]="product.imageUrl" [alt]="product.name" />
          <mat-card-title>{{ product.name }}</mat-card-title>
        </a>
        <mat-card-content>
          <div class="product-details">
            <span class="product-price">$ {{ product.price }}</span>
            <p>{{ product.description }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  imports: [
    NgForOf,
    MatCardModule,
    RouterLink
  ],
  styles: [`
    .product-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .product-card {
      width: 250px;
      margin-bottom: 16px;
    }
    .product-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .product-price {
      font-weight: bold;
      color: #1976d2;
      font-size: 1.2em;
    }
    mat-card-title {
      text-align: center;
    }
    img[mat-card-image] {
      height: 180px;
      object-fit: cover;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductsByCategory(categoryId).subscribe(data => this.products = data);
  }
}
