import { Component, Inject, Optional } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
import { ConsoleLoggerService } from '../../services/console-logger.service';
import { APP_CONFIG, AppConfig, DEFAULT_APP_CONFIG } from '../../tokens/config.token';

// Interface for demonstrating component-level providers
interface LogEntry {
  timestamp: Date;
  source: string;
  message: string;
}

@Component({
  selector: 'app-di-demo',
  templateUrl: './di-demo.component.html',
  styleUrls: ['./di-demo.component.css'],
  // Component-level provider - new instance for this component
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ]
})
export class DiDemoComponent {
  logs: LogEntry[] = [];
  activeTab = 'providedIn';

  // Code snippets for display
  codeSnippets = {
    providedInRoot: `// Singleton - one instance for entire app
@Injectable({
  providedIn: 'root'  // Tree-shakable singleton
})
export class CounterService {
  private count = 0;

  increment() { this.count++; }
  getCount() { return this.count; }
}`,

    providedInAny: `// Per-module instance
@Injectable({
  providedIn: 'any'  // New instance per lazy module
})
export class AnalyticsService {
  private events: string[] = [];

  track(event: string) {
    this.events.push(event);
  }
}`,

    componentLevel: `// Component-level provider
@Component({
  selector: 'app-logger-demo',
  providers: [
    // New instance for each component
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ]
})
export class LoggerDemoComponent {
  constructor(private logger: LoggerService) {
    // Gets fresh instance, not the root singleton
  }
}`,

    useClass: `// Substitute implementation
@NgModule({
  providers: [
    // When LoggerService is requested,
    // provide ConsoleLoggerService instead
    {
      provide: LoggerService,
      useClass: ConsoleLoggerService
    }
  ]
})`,

    useFactory: `// Factory function for complex creation
@NgModule({
  providers: [
    {
      provide: LoggerService,
      useFactory: (config: AppConfig) => {
        if (config.features.analytics) {
          return new AnalyticsLoggerService();
        }
        return new ConsoleLoggerService();
      },
      deps: [APP_CONFIG]  // Inject dependencies
    }
  ]
})`,

    useValue: `// Provide a constant value
export const API_URL = new InjectionToken<string>('api.url');

@NgModule({
  providers: [
    {
      provide: API_URL,
      useValue: 'https://api.example.com'
    }
  ]
})

// Usage in component
constructor(@Inject(API_URL) private apiUrl: string) {}`,

    injectionToken: `// For non-class dependencies
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  features: { darkMode: boolean; };
}

// Create the token
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Provide in module
@NgModule({
  providers: [
    { provide: APP_CONFIG, useValue: DEFAULT_CONFIG }
  ]
})

// Inject in component
constructor(@Inject(APP_CONFIG) private config: AppConfig) {}`
  };

  diPatterns = [
    {
      name: 'providedIn: root',
      description: 'Creates a singleton instance shared across the entire application. Tree-shakable.',
      useCase: 'Global services like AuthService, HttpClient wrappers',
      icon: '🌍'
    },
    {
      name: 'providedIn: any',
      description: 'Creates a new instance for each lazy-loaded module. Useful for module-specific state.',
      useCase: 'Module-scoped analytics, feature-specific caching',
      icon: '📦'
    },
    {
      name: 'Component providers',
      description: 'Creates a new instance for each component. Instance is destroyed with component.',
      useCase: 'Form handlers, component-specific state',
      icon: '🧩'
    },
    {
      name: 'useClass',
      description: 'Substitutes one class for another. Great for testing and swapping implementations.',
      useCase: 'Mock services in tests, environment-specific implementations',
      icon: '🔄'
    },
    {
      name: 'useFactory',
      description: 'Creates instances using a factory function. Allows complex initialization logic.',
      useCase: 'Conditional service creation, services needing async setup',
      icon: '🏭'
    },
    {
      name: 'useValue',
      description: 'Provides a static value or object directly.',
      useCase: 'Configuration objects, API URLs, feature flags',
      icon: '📝'
    },
    {
      name: 'InjectionToken',
      description: 'Token for injecting non-class values like strings, numbers, or interfaces.',
      useCase: 'Configuration, constants, third-party library instances',
      icon: '🔑'
    }
  ];

  constructor(
    private logger: LoggerService,
    @Inject(APP_CONFIG) public config: AppConfig
  ) {
    this.addLog('DiDemoComponent', 'Component initialized');
    this.addLog('DiDemoComponent', `Logger type: ${logger.constructor.name}`);
    this.addLog('DiDemoComponent', `Config loaded: ${config.appName} v${config.version}`);
  }

  addLog(source: string, message: string): void {
    this.logs.unshift({
      timestamp: new Date(),
      source,
      message
    });
    // Keep only last 10 logs
    if (this.logs.length > 10) {
      this.logs.pop();
    }
  }

  testLogger(level: 'info' | 'warn' | 'error'): void {
    const message = `Test ${level} message at ${new Date().toLocaleTimeString()}`;

    switch (level) {
      case 'info':
        this.logger.log(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      case 'error':
        this.logger.error(message);
        break;
    }

    this.addLog('Logger', `${level.toUpperCase()}: ${message}`);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  clearLogs(): void {
    this.logs = [];
    this.addLog('System', 'Logs cleared');
  }
}
