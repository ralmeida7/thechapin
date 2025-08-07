import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Product } from './models';
import { map } from 'rxjs/operators';
import productsData from '../assets/products.json';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log(productsData);
    return of(productsData);
    // return this.http.get<{ products: Product[] }>('assets/products.json')
    //   .pipe(map(data => data.products));
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    console.log(productsData);
    console.log(this.getProducts());
    return this.getProducts().pipe(
      map(products => products.filter(p => p.categoryId === categoryId))
    );
  }
}

