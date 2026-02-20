import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      const result = service.login('testuser', 'password123');

      expect(result).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getUser()?.username).toBe('testuser');
    });

    it('should set admin flag when isAdmin is true', () => {
      service.login('admin', 'password', true);

      expect(service.isAdmin()).toBe(true);
    });

    it('should not set admin flag by default', () => {
      service.login('user', 'password');

      expect(service.isAdmin()).toBe(false);
    });

    it('should fail login with empty username', () => {
      const result = service.login('', 'password');

      expect(result).toBe(false);
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should fail login with empty password', () => {
      const result = service.login('username', '');

      expect(result).toBe(false);
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should store user data in sessionStorage', () => {
      service.login('testuser', 'password');

      const stored = sessionStorage.getItem('currentUser');
      expect(stored).toBeTruthy();

      const user = JSON.parse(stored!);
      expect(user.username).toBe('testuser');
    });

    it('should set loginTime on successful login', () => {
      service.login('testuser', 'password');

      const user = service.getUser();
      expect(user?.loginTime).toBeTruthy();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      service.login('testuser', 'password');
    });

    it('should clear user data on logout', () => {
      service.logout();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.getUser()).toBeNull();
    });

    it('should remove data from sessionStorage', () => {
      service.logout();

      expect(sessionStorage.getItem('currentUser')).toBeNull();
    });

    it('should reset admin status on logout', () => {
      service.login('admin', 'password', true);
      expect(service.isAdmin()).toBe(true);

      service.logout();
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when not logged in', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when logged in', () => {
      service.login('user', 'pass');

      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return false when not logged in', () => {
      expect(service.isAdmin()).toBe(false);
    });

    it('should return false for non-admin user', () => {
      service.login('user', 'pass', false);

      expect(service.isAdmin()).toBe(false);
    });

    it('should return true for admin user', () => {
      service.login('admin', 'pass', true);

      expect(service.isAdmin()).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should return null when not logged in', () => {
      expect(service.getUser()).toBeNull();
    });

    it('should return user object when logged in', () => {
      service.login('testuser', 'password', true);

      const user = service.getUser();
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.isAdmin).toBe(true);
    });
  });

  describe('session persistence', () => {
    it('should restore user from sessionStorage on service init', () => {
      // Setup: store user in sessionStorage
      const storedUser: User = {
        username: 'persistedUser',
        isAdmin: true,
        loginTime: new Date()
      };
      sessionStorage.setItem('currentUser', JSON.stringify(storedUser));

      // Create new service instance
      const newService = new AuthService();

      expect(newService.isLoggedIn()).toBe(true);
      expect(newService.getUser()?.username).toBe('persistedUser');
      expect(newService.isAdmin()).toBe(true);
    });
  });
});
