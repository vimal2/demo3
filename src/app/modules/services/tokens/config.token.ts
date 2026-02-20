import { InjectionToken } from '@angular/core';

// Interface for app configuration
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    darkMode: boolean;
    analytics: boolean;
  };
}

// InjectionToken for non-class dependency injection
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Default configuration
export const DEFAULT_APP_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Demo',
  version: '1.0.0',
  features: {
    darkMode: true,
    analytics: false
  }
};

// Alternative configuration for testing
export const TEST_APP_CONFIG: AppConfig = {
  apiUrl: 'http://test-api.example.com',
  appName: 'Angular Demo (Test)',
  version: '1.0.0-test',
  features: {
    darkMode: false,
    analytics: false
  }
};

// Factory function example
export function configFactory(isProd: boolean): AppConfig {
  return isProd ? {
    apiUrl: 'https://api.production.com',
    appName: 'Angular Demo',
    version: '1.0.0',
    features: {
      darkMode: true,
      analytics: true
    }
  } : DEFAULT_APP_CONFIG;
}
