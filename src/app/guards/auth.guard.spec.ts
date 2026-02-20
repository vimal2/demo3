import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    const mockRoute: any = {};
    const mockState: any = { url: '/dashboard' };

    it('should return true when user is logged in', () => {
      authService.isLoggedIn.and.returnValue(true);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('should return UrlTree when user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result instanceof UrlTree).toBe(true);
    });

    it('should redirect to login page when not authenticated', () => {
      authService.isLoggedIn.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockState) as UrlTree;

      expect(result.toString()).toContain('/login');
    });

    it('should include returnUrl query param when redirecting', () => {
      authService.isLoggedIn.and.returnValue(false);
      const stateWithUrl: any = { url: '/dashboard' };

      const result = guard.canActivate(mockRoute, stateWithUrl) as UrlTree;

      expect(result.queryParams['returnUrl']).toBe('/dashboard');
    });

    it('should preserve different return URLs', () => {
      authService.isLoggedIn.and.returnValue(false);
      const customState: any = { url: '/admin/users' };

      const result = guard.canActivate(mockRoute, customState) as UrlTree;

      expect(result.queryParams['returnUrl']).toBe('/admin/users');
    });

    it('should call authService.isLoggedIn', () => {
      authService.isLoggedIn.and.returnValue(true);

      guard.canActivate(mockRoute, mockState);

      expect(authService.isLoggedIn).toHaveBeenCalled();
    });
  });
});
