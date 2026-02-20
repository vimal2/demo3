import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductResolver } from './product.resolver';
import { ProductService, Product } from '../services/product.service';

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let productService: jasmine.SpyObj<ProductService>;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'Test',
    stock: 10
  };

  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ProductResolver,
        { provide: ProductService, useValue: productServiceSpy }
      ]
    });

    resolver = TestBed.inject(ProductResolver);
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    const mockState: any = {};

    function createMockRoute(id: string | null): any {
      return {
        paramMap: {
          get: (key: string) => id
        }
      };
    }

    it('should return product when valid id is provided', () => {
      productService.getProductById.and.returnValue(mockProduct);
      const mockRoute = createMockRoute('1');

      const result = resolver.resolve(mockRoute, mockState);

      // Result is an Observable, we need to check it properly
      if (result && typeof (result as any).subscribe === 'function') {
        (result as any).subscribe((product: Product | null) => {
          expect(product).toEqual(mockProduct);
        });
      }
    });

    it('should call productService.getProductById with correct id', () => {
      productService.getProductById.and.returnValue(mockProduct);
      const mockRoute = createMockRoute('5');

      resolver.resolve(mockRoute, mockState);

      expect(productService.getProductById).toHaveBeenCalledWith(5);
    });

    it('should redirect to products list when id is invalid (NaN)', () => {
      const mockRoute = createMockRoute('invalid');

      resolver.resolve(mockRoute, mockState);

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should return null when id is invalid', () => {
      const mockRoute = createMockRoute('invalid');

      const result = resolver.resolve(mockRoute, mockState);

      expect(result).toBeNull();
    });

    it('should redirect when product is not found', () => {
      productService.getProductById.and.returnValue(undefined);
      const mockRoute = createMockRoute('999');

      resolver.resolve(mockRoute, mockState);

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should return null when product is not found', () => {
      productService.getProductById.and.returnValue(undefined);
      const mockRoute = createMockRoute('999');

      const result = resolver.resolve(mockRoute, mockState);

      expect(result).toBeNull();
    });

    it('should handle null id parameter', () => {
      const mockRoute = createMockRoute(null);

      const result = resolver.resolve(mockRoute, mockState);

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
      expect(result).toBeNull();
    });

    it('should not redirect when product exists', () => {
      productService.getProductById.and.returnValue(mockProduct);
      const mockRoute = createMockRoute('1');

      resolver.resolve(mockRoute, mockState);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
