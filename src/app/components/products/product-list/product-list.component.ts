import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.categories = this.productService.getCategories();

    // Read query parameters from URL
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.filterProducts();
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.updateQueryParams();
  }

  onCategoryChange(): void {
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    // Programmatic navigation with query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        category: this.selectedCategory || null
      },
      queryParamsHandling: 'merge'
    });
  }

  viewProduct(productId: number): void {
    // Programmatic navigation to product detail
    this.router.navigate(['/products', productId]);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
