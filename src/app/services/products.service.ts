import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Product } from '../models/models';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private readonly base = '/assets';

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  private loadedDepts = new Set<string>();

  async loadAll(): Promise<void> {
    type Dept = { id_departamento: number; titulo: string; imagen?: string | null };
    type DeptPayload = { departamentos: Dept[] };
    const [deptPayload, products] = await Promise.all([
      lastValueFrom(this.http.get<DeptPayload>(`${this.base}/departamento-tienda-completa.json`)),
      lastValueFrom(this.http.get<Product[]>(`${this.base}/products.json`)),
    ]);
    const depts = deptPayload?.departamentos ?? [];
    const mapped: Category[] = depts.map(d => {
      const img = (d.imagen || '').trim();
      let urlImage: string;
      if (!img || /^sin imagen$/i.test(img)) {
        urlImage = `https://picsum.photos/seed/${encodeURIComponent(d.titulo)}/64/64`;
      } else if (/^https?:\/\//i.test(img)) {
        urlImage = img;
      } else {
        urlImage = `/assets/${img}`;
      }
      return {
        id: String(d.id_departamento),
        name: d.titulo,
        urlImage
      } as Category;
    });
  this.categories.set(mapped);
  this.products.set(products ?? []);
  }

  getProduct(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getProductsByCategory(categoryId?: string): Product[] {
    const all = this.products();
    if (!categoryId) return all;
    return all.filter(p => p.categoryId === categoryId);
  }

  async ensureDepartmentProducts(deptId?: string): Promise<void> {
    const id = (deptId ?? '').trim();
    if (!id) return;
    if (this.loadedDepts.has(id)) return;
    try {
      const raw = await lastValueFrom(this.http.get<any>(`${this.base}/departamento_${id}.json`));
      const list: any[] = Array.isArray(raw) ? (Array.isArray(raw[0]) ? raw[0] : raw) : [];
      const mapped: Product[] = list.map((it: any) => ({
        id: String(it?.id_producto ?? it?.id ?? cryptoRandomId()),
        title: String(it?.titulo ?? it?.nombre ?? 'Producto'),
        description: String(it?.descripcion ?? ''),
        price: Number(it?.precio ?? 0),
        image: String(it?.img ?? it?.imagen ?? ''),
        categoryId: id
      }));
      if (mapped.length) this.products.set([...this.products(), ...mapped]);
      this.loadedDepts.add(id);
    } catch {
      // Mark as attempted to avoid hammering missing files repeatedly
      this.loadedDepts.add(id);
    }
  }
}

// Fallback random id generator (no crypto dependency needed)
function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}
