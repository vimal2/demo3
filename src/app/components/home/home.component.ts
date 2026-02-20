import { Component } from '@angular/core';

interface DemoFeature {
  name: string;
  description: string;
  codeRef: string;
  route?: string;
}

interface DemoSection {
  title: string;
  icon: string;
  description: string;
  route?: string;
  features: DemoFeature[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Angular Demo Application';
  subtitle = 'A comprehensive demonstration of Angular features and best practices';

  demoSections: DemoSection[] = [
    {
      title: 'Routing',
      icon: '🧭',
      description: 'Complete routing implementation with guards, resolvers, and lazy loading.',
      route: '/products',
      features: [
        {
          name: 'Basic Routing',
          description: 'routerLink, routerLinkActive directives',
          codeRef: 'src/app/app.module.ts (routes array)'
        },
        {
          name: 'Route Parameters',
          description: 'Dynamic :id params with ActivatedRoute',
          codeRef: 'src/app/components/products/product-detail/'
        },
        {
          name: 'Query Parameters',
          description: 'Search & filter with queryParams',
          codeRef: 'src/app/components/products/product-list/'
        },
        {
          name: 'Nested Routes',
          description: 'Child routes with nested router-outlet',
          codeRef: 'src/app/components/products/'
        },
        {
          name: 'Lazy Loading',
          description: 'loadChildren for feature modules',
          codeRef: 'src/app/modules/admin/, src/app/modules/forms/'
        },
        {
          name: 'Route Guards',
          description: 'CanActivate, CanDeactivate, CanMatch',
          codeRef: 'src/app/guards/'
        },
        {
          name: 'Resolvers',
          description: 'Pre-fetch data before activation',
          codeRef: 'src/app/resolvers/product.resolver.ts'
        },
        {
          name: 'Programmatic Navigation',
          description: 'Router.navigate() with params',
          codeRef: 'src/app/components/login/login.component.ts'
        }
      ]
    },
    {
      title: 'Forms',
      icon: '📝',
      description: 'Template-driven and reactive forms with validation patterns.',
      route: '/forms',
      features: [
        {
          name: 'Template-Driven Forms',
          description: 'ngModel, ngForm, template validation',
          codeRef: 'src/app/modules/forms/components/template-forms-demo/',
          route: '/forms/template'
        },
        {
          name: 'Reactive Forms',
          description: 'FormBuilder, FormGroup, FormControl',
          codeRef: 'src/app/modules/forms/components/reactive-forms-demo/',
          route: '/forms/reactive'
        },
        {
          name: 'Form Validation',
          description: 'Built-in & custom validators',
          codeRef: 'src/app/modules/forms/components/reactive-forms-demo/'
        },
        {
          name: 'Cross-Field Validation',
          description: 'Password match, group validators',
          codeRef: 'src/app/modules/forms/components/reactive-forms-demo/'
        },
        {
          name: 'FormArray',
          description: 'Dynamic form fields (add/remove)',
          codeRef: 'src/app/modules/forms/components/advanced-forms-demo/',
          route: '/forms/advanced'
        },
        {
          name: 'Async Validators',
          description: 'Server-side validation (username check)',
          codeRef: 'src/app/modules/forms/components/advanced-forms-demo/'
        }
      ]
    },
    {
      title: 'Unit Testing',
      icon: '🧪',
      description: 'Jasmine/Karma tests for services, guards, and components.',
      features: [
        {
          name: 'Service Testing',
          description: 'Testing injectable services',
          codeRef: 'src/app/services/*.spec.ts'
        },
        {
          name: 'Guard Testing',
          description: 'Testing route guards with mocks',
          codeRef: 'src/app/guards/*.spec.ts'
        },
        {
          name: 'Component Testing',
          description: 'TestBed, fixture, DOM testing',
          codeRef: 'src/app/components/**/*.spec.ts'
        },
        {
          name: 'Mocking Dependencies',
          description: 'jasmine.createSpyObj, providers',
          codeRef: 'src/app/guards/auth.guard.spec.ts'
        },
        {
          name: 'Async Testing',
          description: 'fakeAsync, tick, async/await',
          codeRef: 'src/app/components/login/login.component.spec.ts'
        }
      ]
    },
    {
      title: 'Services & RxJS',
      icon: '🔄',
      description: 'State management, dependency injection, and reactive programming patterns.',
      route: '/services',
      features: [
        {
          name: 'State Management',
          description: 'BehaviorSubject vs Angular Signals',
          codeRef: 'src/app/modules/services/services/counter.service.ts',
          route: '/services/state'
        },
        {
          name: 'Dependency Injection',
          description: 'providedIn, useClass, useFactory, InjectionToken',
          codeRef: 'src/app/modules/services/services/logger.service.ts',
          route: '/services/di'
        },
        {
          name: 'RxJS Operators',
          description: 'map, filter, switchMap, catchError, takeUntil',
          codeRef: 'src/app/modules/services/services/search.service.ts',
          route: '/services/rxjs'
        },
        {
          name: 'Computed Signals',
          description: 'Derived state with computed()',
          codeRef: 'src/app/modules/services/services/counter-signal.service.ts'
        }
      ]
    },
    {
      title: 'Configuration',
      icon: '⚙️',
      description: 'Environment-based configuration for different deployments.',
      route: '/forms/environment',
      features: [
        {
          name: 'Environment Files',
          description: 'Per-environment configuration',
          codeRef: 'src/environments/'
        },
        {
          name: 'API URL Config',
          description: 'Externalized API endpoints',
          codeRef: 'src/app/services/api.service.ts'
        },
        {
          name: 'Feature Flags',
          description: 'Enable/disable features per env',
          codeRef: 'src/environments/environment.ts'
        },
        {
          name: 'Build Configurations',
          description: 'angular.json fileReplacements',
          codeRef: 'angular.json (configurations)'
        }
      ]
    }
  ];

  quickLinks = [
    { label: 'Products', route: '/products', description: 'Routing demo with params' },
    { label: 'Forms', route: '/forms', description: 'Form patterns' },
    { label: 'Services', route: '/services', description: 'State & DI patterns' },
    { label: 'Dashboard', route: '/dashboard', description: 'Protected route (login required)' },
    { label: 'Admin', route: '/admin', description: 'Admin only (lazy loaded)' }
  ];

  testCommands = [
    { command: 'ng test', description: 'Run all unit tests' },
    { command: 'ng test --code-coverage', description: 'Run tests with coverage report' },
    { command: 'ng build', description: 'Build for development' },
    { command: 'ng build --configuration=production', description: 'Production build' },
    { command: 'ng serve --configuration=staging', description: 'Serve with staging config' }
  ];
}
