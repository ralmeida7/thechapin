import { Component, OnInit } from '@angular/core';
import { Category } from './models';
import { CategoryService } from './category.service';
import { Router } from '@angular/router';
import {NgFor} from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-category-list',
  standalone: true,
  template: `
    <h2>Categories</h2>
    <div class="category-cards">
      <mat-card *ngFor="let category of categories" (click)="viewCategory(category)" class="category-card">
        <img mat-card-image [src]="category.imageUrl" [alt]="category.name" />
        <mat-card-title>{{ category.name }}</mat-card-title>
      </mat-card>
    </div>
  `,
  imports: [
    NgFor,
    MatCardModule
  ],
  styles: [`
    .category-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .category-card {
      width: 250px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .category-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
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
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  viewCategory(category: Category) {
    this.router.navigate(['/category', category.id]);
  }
}
