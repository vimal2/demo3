import { Component } from '@angular/core';

interface DemoSection {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  features: string[];
  codeRef: string;
}

@Component({
  selector: 'app-services-home',
  templateUrl: './services-home.component.html',
  styleUrls: ['./services-home.component.css']
})
export class ServicesHomeComponent {
  demos: DemoSection[] = [
    {
      title: 'State Management',
      description: 'Compare BehaviorSubject and Angular Signals patterns for reactive state management in services.',
      route: '/services/state',
      icon: '🔄',
      color: 'primary',
      features: [
        'BehaviorSubject pattern',
        'Angular Signals (signal, computed, effect)',
        'Observable state exposure',
        'Side-by-side comparison'
      ],
      codeRef: 'src/app/modules/services/services/counter.service.ts'
    },
    {
      title: 'Dependency Injection',
      description: 'Explore Angular\'s powerful DI system with different provider configurations and patterns.',
      route: '/services/di',
      icon: '💉',
      color: 'success',
      features: [
        'providedIn: root vs any',
        'Component-level providers',
        'useClass, useFactory, useValue',
        'InjectionToken for configs'
      ],
      codeRef: 'src/app/modules/services/services/logger.service.ts'
    },
    {
      title: 'RxJS Operators',
      description: 'Learn essential RxJS operators through interactive examples and live search demo.',
      route: '/services/rxjs',
      icon: '🔗',
      color: 'info',
      features: [
        'map, filter, tap operators',
        'catchError for error handling',
        'switchMap for HTTP requests',
        'takeUntil for cleanup'
      ],
      codeRef: 'src/app/modules/services/services/search.service.ts'
    }
  ];

  keyConceptsService = `// Service Best Practices
@Injectable({
  providedIn: 'root'  // Singleton, tree-shakable
})
export class DataService {
  // Private state
  private data$ = new BehaviorSubject<Data[]>([]);

  // Public read-only observable
  readonly data = this.data$.asObservable();

  // Methods to modify state
  addItem(item: Data): void {
    const current = this.data$.getValue();
    this.data$.next([...current, item]);
  }
}`;

  keyConceptsSignals = `// Signals (Angular 16+)
@Injectable({ providedIn: 'root' })
export class SignalService {
  // Writable signal
  readonly count = signal(0);

  // Computed (derived, read-only)
  readonly doubled = computed(() => this.count() * 2);

  // Effect for side effects
  constructor() {
    effect(() => console.log('Count:', this.count()));
  }

  increment() {
    this.count.update(c => c + 1);
  }
}`;
}
