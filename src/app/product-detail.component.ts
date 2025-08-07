import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <ng-container *ngIf="product">
      <mat-card class="product-detail-card">
        <img mat-card-image [src]="product.imageUrl" [alt]="product.name" />
        <mat-card-title>{{ product.name }}</mat-card-title>
        <mat-card-content>
          <div class="product-detail-info">
            <span class="product-detail-price">$ {{ product.price }}</span>
            <p>{{ product.description }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </ng-container>
    <ng-container *ngIf="!product">
      <p>Product not found.</p>
    </ng-container>
  `,
  styles: [`
    .product-detail-card {
      max-width: 400px;
      margin: 32px auto;
    }
    .product-detail-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .product-detail-price {
      font-weight: bold;
      color: #1976d2;
      font-size: 1.3em;
    }
    img[mat-card-image] {
      height: 250px;
      object-fit: cover;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === productId);
    });
  }
}

