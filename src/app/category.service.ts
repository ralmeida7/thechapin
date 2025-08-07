import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, of} from 'rxjs';
import { Category } from './models';
import categories from '../assets/categories.json'; // Assuming categories.json is in the same directory

const typedCategories: Category[] = categories as Category[];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return of(typedCategories);
    // return this.http.get<{ categories: Category[] }>('assets/categories.json')
    //   .pipe(map(data => data.categories));
  }
}
{
}

