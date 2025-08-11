import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product } from '../models/models';

const STORAGE_KEY = 'online-store-cart-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.readFromStorage());

  readonly count = computed(() => this.items().reduce((sum, it) => sum + it.qty, 0));
  readonly total = computed(() => this.items().reduce((sum, it) => sum + it.qty * it.product.price, 0));
  readonly all = computed(() => this.items());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    }, { allowSignalWrites: true });
  }

  add(product: Product, qty = 1) {
    const next = [...this.items()];
    const i = next.findIndex(it => it.product.id === product.id);
    if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty };
    else next.push({ product, qty });
    this.items.set(next);
  }

  remove(productId: string) {
    this.items.set(this.items().filter(it => it.product.id !== productId));
  }

  update(productId: string, qty: number) {
    if (qty <= 0) return this.remove(productId);
    this.items.set(this.items().map(it => it.product.id === productId ? { ...it, qty } : it));
  }

  clear() {
    this.items.set([]);
  }

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }
}
