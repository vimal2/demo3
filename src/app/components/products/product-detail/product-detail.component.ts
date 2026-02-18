import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Method 1: Using snapshot (doesn't update if param changes without navigation)
    // this.productId = +this.route.snapshot.paramMap.get('id')!;

    // Method 2: Using observable (reacts to param changes)
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });

    // Get resolved data from the route
    this.route.data.subscribe(data => {
      this.product = data['product'];
    });

  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }
}
