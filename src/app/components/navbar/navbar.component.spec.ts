import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'isAdmin',
      'getUser',
      'logout'
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    // Default mock returns
    authService.isLoggedIn.and.returnValue(false);
    authService.isAdmin.and.returnValue(false);
    authService.getUser.and.returnValue(null);

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('authService access', () => {
    it('should have public authService', () => {
      expect(component.authService).toBeTruthy();
    });

    it('should expose authService methods to template', () => {
      expect(component.authService.isLoggedIn).toBeDefined();
      expect(component.authService.isAdmin).toBeDefined();
      expect(component.authService.getUser).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to login page after logout', () => {
      component.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call logout before navigation', () => {
      let logoutCalled = false;
      authService.logout.and.callFake(() => {
        logoutCalled = true;
      });

      (router.navigate as jasmine.Spy).and.callFake(() => {
        expect(logoutCalled).toBe(true);
        return Promise.resolve(true);
      });

      component.logout();
    });
  });

  describe('template integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render navbar element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('nav')).toBeTruthy();
    });

    it('should have navbar brand', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.navbar-brand')).toBeTruthy();
    });
  });

  describe('authentication state display', () => {
    it('should show login link when not authenticated', () => {
      authService.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const loginLink = compiled.querySelector('a[routerLink="/login"]');
      expect(loginLink).toBeTruthy();
    });

    it('should show logout button when authenticated', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUser.and.returnValue({ username: 'testuser', isAdmin: false, loginTime: new Date() });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector('button.btn-outline-light');
      expect(logoutButton).toBeTruthy();
    });

    it('should display username when authenticated', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUser.and.returnValue({ username: 'testuser', isAdmin: false, loginTime: new Date() });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('testuser');
    });

    it('should show admin link when user is admin', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(true);
      authService.getUser.and.returnValue({ username: 'admin', isAdmin: true, loginTime: new Date() });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const adminLink = compiled.querySelector('a[routerLink="/admin"]');
      expect(adminLink).toBeTruthy();
    });

    it('should hide admin link for non-admin users', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.isAdmin.and.returnValue(false);
      authService.getUser.and.returnValue({ username: 'user', isAdmin: false, loginTime: new Date() });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const adminLink = compiled.querySelector('a[routerLink="/admin"]');
      expect(adminLink).toBeFalsy();
    });

    it('should show dashboard link when authenticated', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUser.and.returnValue({ username: 'user', isAdmin: false, loginTime: new Date() });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const dashboardLink = compiled.querySelector('a[routerLink="/dashboard"]');
      expect(dashboardLink).toBeTruthy();
    });
  });
});
