import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule],
  template: `
  <h2>Your Cart</h2>
  <table mat-table [dataSource]="cart.all()" class="mat-elevation-z1 full">
    <ng-container matColumnDef="title">
      <th mat-header-cell *matHeaderCellDef>Product</th>
      <td mat-cell *matCellDef="let row">{{ row.product.title }}</td>
    </ng-container>

    <ng-container matColumnDef="price">
      <th mat-header-cell *matHeaderCellDef>Price</th>
      <td mat-cell *matCellDef="let row">{{ row.product.price | currency }}</td>
    </ng-container>

    <ng-container matColumnDef="qty">
      <th mat-header-cell *matHeaderCellDef>Qty</th>
      <td mat-cell *matCellDef="let row">
        <input matInput type="number" min="1" style="width:64px" [(ngModel)]="row.qty" (ngModelChange)="onQty(row.product.id, $event)">
      </td>
    </ng-container>

    <ng-container matColumnDef="total">
      <th mat-header-cell *matHeaderCellDef>Total</th>
      <td mat-cell *matCellDef="let row">{{ (row.qty * row.product.price) | currency }}</td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let row">
        <button mat-icon-button color="warn" (click)="remove(row.product.id)" aria-label="Remove">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <div class="summary">
    <div class="spacer"></div>
    <div class="total">Total: {{ cart.total() | currency }}</div>
    <button mat-raised-button color="primary" [disabled]="!cart.count()">Checkout</button>
  </div>
  `,
  styles: [`
  .full { width: 100%; background: var(--mat-sys-surface-container); border-radius: 12px; overflow: hidden; }
  .summary { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 12px; background: var(--mat-sys-surface-container-low); border-radius: 12px; }
    .spacer { flex: 1; }
  `]
})
export class CartPage {
  cart = inject(CartService);
  displayedColumns = ['title', 'price', 'qty', 'total', 'actions'];

  onQty(id: string, qty: number) { this.cart.update(id, Number(qty)); }
  remove(id: string) { this.cart.remove(id); }
}
