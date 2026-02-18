import { Injectable } from '@angular/core';

export interface User {
  username: string;
  isAdmin: boolean;
  loginTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Check if user data exists in sessionStorage
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string, isAdmin: boolean = false): boolean {
    // Mock login - in real app, this would call an API
    if (username && password) {
      this.currentUser = {
        username,
        isAdmin,
        loginTime: new Date()
      };
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    sessionStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin ?? false;
  }

  getUser(): User | null {
    return this.currentUser;
  }
}
