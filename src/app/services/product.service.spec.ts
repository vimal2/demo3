import { TestBed } from '@angular/core/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return an array of products', () => {
      const products = service.getProducts();

      expect(products).toBeTruthy();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return products with required properties', () => {
      const products = service.getProducts();
      const product = products[0];

      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.stock).toBeDefined();
    });

    it('should return products with valid price values', () => {
      const products = service.getProducts();

      products.forEach(product => {
        expect(product.price).toBeGreaterThan(0);
        expect(typeof product.price).toBe('number');
      });
    });

    it('should return products with non-negative stock', () => {
      const products = service.getProducts();

      products.forEach(product => {
        expect(product.stock).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product when valid id is provided', () => {
      const product = service.getProductById(1);

      expect(product).toBeTruthy();
      expect(product?.id).toBe(1);
    });

    it('should return the correct product data', () => {
      const product = service.getProductById(1);

      expect(product?.name).toBe('Laptop Pro 15');
      expect(product?.category).toBe('Electronics');
    });

    it('should return undefined for non-existent id', () => {
      const product = service.getProductById(999);

      expect(product).toBeUndefined();
    });

    it('should return undefined for negative id', () => {
      const product = service.getProductById(-1);

      expect(product).toBeUndefined();
    });

    it('should return undefined for zero id', () => {
      const product = service.getProductById(0);

      expect(product).toBeUndefined();
    });

    it('should find different products by their ids', () => {
      const product1 = service.getProductById(1);
      const product2 = service.getProductById(2);

      expect(product1).toBeTruthy();
      expect(product2).toBeTruthy();
      expect(product1?.id).not.toBe(product2?.id);
      expect(product1?.name).not.toBe(product2?.name);
    });
  });

  describe('getCategories', () => {
    it('should return an array of categories', () => {
      const categories = service.getCategories();

      expect(categories).toBeTruthy();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should return unique categories', () => {
      const categories = service.getCategories();
      const uniqueCategories = [...new Set(categories)];

      expect(categories.length).toBe(uniqueCategories.length);
    });

    it('should include Electronics category', () => {
      const categories = service.getCategories();

      expect(categories).toContain('Electronics');
    });

    it('should include Furniture category', () => {
      const categories = service.getCategories();

      expect(categories).toContain('Furniture');
    });

    it('should include Accessories category', () => {
      const categories = service.getCategories();

      expect(categories).toContain('Accessories');
    });

    it('should only contain categories from existing products', () => {
      const categories = service.getCategories();
      const products = service.getProducts();
      const productCategories = products.map(p => p.category);

      categories.forEach(category => {
        expect(productCategories).toContain(category);
      });
    });
  });

  describe('data integrity', () => {
    it('should have unique product ids', () => {
      const products = service.getProducts();
      const ids = products.map(p => p.id);
      const uniqueIds = [...new Set(ids)];

      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have non-empty product names', () => {
      const products = service.getProducts();

      products.forEach(product => {
        expect(product.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions', () => {
      const products = service.getProducts();

      products.forEach(product => {
        expect(product.description.length).toBeGreaterThan(0);
      });
    });
  });
});
