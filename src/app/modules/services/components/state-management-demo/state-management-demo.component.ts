import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CounterService, CounterState } from '../../services/counter.service';
import { CounterSignalService } from '../../services/counter-signal.service';

@Component({
  selector: 'app-state-management-demo',
  templateUrl: './state-management-demo.component.html',
  styleUrls: ['./state-management-demo.component.css']
})
export class StateManagementDemoComponent implements OnInit, OnDestroy {
  // BehaviorSubject state
  behaviorSubjectState: CounterState | null = null;
  private destroy$ = new Subject<void>();

  // Code snippets
  codeSnippets = {
    behaviorSubject: `// counter.service.ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  // Private BehaviorSubject holds the state
  private readonly state = new BehaviorSubject<CounterState>({
    count: 0,
    lastAction: 'initialized',
    history: [0]
  });

  // Expose as Observable (read-only)
  readonly state$ = this.state.asObservable();

  increment(): void {
    const current = this.state.getValue();
    this.state.next({
      ...current,
      count: current.count + 1,
      lastAction: 'increment'
    });
  }
}`,

    signalService: `// counter-signal.service.ts
@Injectable({ providedIn: 'root' })
export class CounterSignalService {
  // Writable signal
  readonly count = signal(0);

  // Computed signal (derived, read-only)
  readonly doubleCount = computed(() => this.count() * 2);

  // Effect for side effects
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
  }
}`,

    subscribe: `// Component
ngOnInit() {
  this.counterService.state$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      this.state = state;
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}`,

    signalUsage: `// Template with Signals
<p>Count: {{ counterSignal.count() }}</p>
<p>Double: {{ counterSignal.doubleCount() }}</p>

// No subscription needed!
// Signals auto-update the template`
  };

  constructor(
    public counterService: CounterService,
    public counterSignal: CounterSignalService
  ) {}

  ngOnInit(): void {
    // Subscribe to BehaviorSubject state
    this.counterService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.behaviorSubjectState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // BehaviorSubject actions
  incrementSubject(): void {
    this.counterService.increment();
  }

  decrementSubject(): void {
    this.counterService.decrement();
  }

  resetSubject(): void {
    this.counterService.reset();
  }

  // Signal actions
  incrementSignal(): void {
    this.counterSignal.increment();
  }

  decrementSignal(): void {
    this.counterSignal.decrement();
  }

  resetSignal(): void {
    this.counterSignal.reset();
  }
}
