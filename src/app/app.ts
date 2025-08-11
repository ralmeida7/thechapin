import { Component, signal, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  imports: [RouterOutlet, RouterLink, DatePipe, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatRippleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('online-store');
  private cart = inject(CartService);
  private products = inject(ProductsService);
  private router = inject(Router);
  protected readonly today = new Date();
  @ViewChild('catScroll') private catScroll?: ElementRef<HTMLElement>;
  protected readonly showLeft = signal(false);
  protected readonly showRight = signal(false);
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
  ngAfterViewInit() {
    if (this.catScroll) {
      this.updateCatNav(this.catScroll.nativeElement);
    }
  }

  scrollCats(el: HTMLElement, dir: number) {
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: (dir || 1) * amount, behavior: 'smooth' });
    setTimeout(() => this.updateCatNav(el), 250);
  }

  updateCatNav(el: HTMLElement) {
    const { scrollLeft, clientWidth, scrollWidth } = el;
    this.showLeft.set(scrollLeft > 0);
    this.showRight.set(scrollLeft + clientWidth < scrollWidth);
  }

  preloadDept(id: string) {
    this.products.ensureDepartmentProducts(id);
  }
}
