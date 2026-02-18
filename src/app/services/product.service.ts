import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro 15',
      description: 'High-performance laptop with 15-inch display, perfect for professionals.',
      price: 1299.99,
      category: 'Electronics',
      stock: 25
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking.',
      price: 49.99,
      category: 'Electronics',
      stock: 150
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with Cherry MX switches.',
      price: 129.99,
      category: 'Electronics',
      stock: 75
    },
    {
      id: 4,
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support and adjustable armrests.',
      price: 349.99,
      category: 'Furniture',
      stock: 30
    },
    {
      id: 5,
      name: 'Standing Desk',
      description: 'Electric height-adjustable standing desk with memory presets.',
      price: 599.99,
      category: 'Furniture',
      stock: 20
    },
    {
      id: 6,
      name: 'Monitor 27"',
      description: '4K Ultra HD monitor with HDR support and USB-C connectivity.',
      price: 449.99,
      category: 'Electronics',
      stock: 40
    },
    {
      id: 7,
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature.',
      price: 79.99,
      category: 'Accessories',
      stock: 100
    },
    {
      id: 8,
      name: 'Webcam HD',
      description: '1080p HD webcam with built-in microphone and auto-focus.',
      price: 89.99,
      category: 'Electronics',
      stock: 60
    },
    {
      id: 9,
      name: 'Notebook Set',
      description: 'Premium notebook set with 3 different sizes for all your needs.',
      price: 24.99,
      category: 'Accessories',
      stock: 200
    }
  ];

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }
}
