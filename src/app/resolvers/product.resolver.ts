import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { ProductService, Product } from '../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product | null> | Promise<Product | null> | Product | null {

    const id = Number(route.paramMap.get('id'));

    if (isNaN(id)) {
      // Invalid ID - redirect to products list
      this.router.navigate(['/products']);
      return null;
    }

    const product = this.productService.getProductById(id);

    if (product) {
      // Simulate API delay for demonstration
      return of(product);
    } else {
      // Product not found - redirect to products list
      this.router.navigate(['/products']);
      return null;
    }
  }
}
