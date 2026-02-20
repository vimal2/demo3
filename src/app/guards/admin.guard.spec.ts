import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    // Suppress alert in tests
    spyOn(window, 'alert');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canMatch', () => {
    const mockRoute: any = {};
    const mockSegments: any[] = [];

    it('should return true when user is logged in and is admin', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(true);

      const result = guard.canMatch(mockRoute, mockSegments);

      expect(result).toBe(true);
    });

    it('should redirect to login when user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);

      const result = guard.canMatch(mockRoute, mockSegments) as UrlTree;

      expect(result instanceof UrlTree).toBe(true);
      expect(result.toString()).toContain('/login');
    });

    it('should include returnUrl when redirecting to login', () => {
      authService.isLoggedIn.and.returnValue(false);

      const result = guard.canMatch(mockRoute, mockSegments) as UrlTree;

      expect(result.queryParams['returnUrl']).toBe('/admin');
    });

    it('should redirect to dashboard when logged in but not admin', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(false);

      const result = guard.canMatch(mockRoute, mockSegments) as UrlTree;

      expect(result instanceof UrlTree).toBe(true);
      expect(result.toString()).toContain('/dashboard');
    });

    it('should show alert when access is denied', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(false);

      guard.canMatch(mockRoute, mockSegments);

      expect(window.alert).toHaveBeenCalledWith('Access Denied: Admin privileges required');
    });

    it('should not show alert when user is admin', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(true);

      guard.canMatch(mockRoute, mockSegments);

      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should not check isAdmin if not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);

      guard.canMatch(mockRoute, mockSegments);

      expect(authService.isAdmin).not.toHaveBeenCalled();
    });

    it('should check isAdmin only when logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(true);

      guard.canMatch(mockRoute, mockSegments);

      expect(authService.isAdmin).toHaveBeenCalled();
    });
  });
});
