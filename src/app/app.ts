import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { CartService } from './services/cart.service';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatRippleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('online-store');
  private cart = inject(CartService);
  private products = inject(ProductsService);
  private router = inject(Router);
  cartCount() { return this.cart.count(); }
  categories() { return this.products.categories(); }
  goSearch(q: string) {
    const queryParams = q?.trim() ? { q } : {};
    this.router.navigate(['/products'], { queryParams });
  }

  async ngOnInit() {
    if (!this.products.categories().length) {
      await this.products.loadAll();
    }
  }
  scrollCats(el: HTMLElement, dir: number) {
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: (dir || 1) * amount, behavior: 'smooth' });
  }

  preloadDept(id: string) {
    this.products.ensureDepartmentProducts(id);
  }
}
