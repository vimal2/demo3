import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty username', () => {
      expect(component.username).toBe('');
    });

    it('should have empty password', () => {
      expect(component.password).toBe('');
    });

    it('should have isAdmin as false', () => {
      expect(component.isAdmin).toBe(false);
    });

    it('should have empty error message', () => {
      expect(component.errorMessage).toBe('');
    });

    it('should have default returnUrl', () => {
      expect(component.returnUrl).toBe('/dashboard');
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', () => {
      component.username = 'testuser';
      component.password = 'password123';
      component.isAdmin = false;
      authService.login.and.returnValue(true);

      component.login();

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123', false);
    });

    it('should navigate to returnUrl on successful login', () => {
      component.username = 'testuser';
      component.password = 'password123';
      component.returnUrl = '/dashboard';
      authService.login.and.returnValue(true);

      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should set error message on failed login', () => {
      component.username = 'testuser';
      component.password = 'wrongpass';
      authService.login.and.returnValue(false);

      component.login();

      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('should not navigate on failed login', () => {
      component.username = 'testuser';
      component.password = 'wrongpass';
      authService.login.and.returnValue(false);

      component.login();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should show error when username is empty', () => {
      component.username = '';
      component.password = 'password';

      component.login();

      expect(component.errorMessage).toBe('Please enter username and password');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      component.username = 'username';
      component.password = '';

      component.login();

      expect(component.errorMessage).toBe('Please enter username and password');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should pass isAdmin flag to authService', () => {
      component.username = 'admin';
      component.password = 'adminpass';
      component.isAdmin = true;
      authService.login.and.returnValue(true);

      component.login();

      expect(authService.login).toHaveBeenCalledWith('admin', 'adminpass', true);
    });
  });

  describe('returnUrl from query params', () => {
    it('should use returnUrl from query params when provided', async () => {
      // Create new component with custom query params
      TestBed.resetTestingModule();

      const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

      await TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule],
        declarations: [LoginComponent],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({ returnUrl: '/admin' })
            }
          }
        ]
      }).compileComponents();

      const newFixture = TestBed.createComponent(LoginComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.returnUrl).toBe('/admin');
    });
  });
});
