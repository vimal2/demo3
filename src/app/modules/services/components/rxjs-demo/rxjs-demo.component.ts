import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchService, SearchResult } from '../../services/search.service';

interface OperatorDemo {
  name: string;
  description: string;
  category: 'transformation' | 'filtering' | 'error' | 'combination';
}

@Component({
  selector: 'app-rxjs-demo',
  templateUrl: './rxjs-demo.component.html',
  styleUrls: ['./rxjs-demo.component.css']
})
export class RxjsDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTerms$ = new Subject<string>();

  // Search demo
  searchTerm = '';
  searchResults: SearchResult[] = [];
  isSearching = false;

  // Operator demos
  operationLog: string[] = [];
  selectedOperator = 'map';
  demoResult: string = '';

  // Error handling demo
  shouldFail = false;
  errorResult = '';

  operators: OperatorDemo[] = [
    { name: 'map', description: 'Transform each emitted value', category: 'transformation' },
    { name: 'filter', description: 'Only emit values that pass a condition', category: 'filtering' },
    { name: 'tap', description: 'Perform side effects without modifying values', category: 'transformation' },
    { name: 'catchError', description: 'Handle errors and provide fallback', category: 'error' },
    { name: 'switchMap', description: 'Map to observable, cancel previous', category: 'combination' },
    { name: 'takeUntil', description: 'Complete when notifier emits', category: 'filtering' }
  ];

  codeSnippets: { [key: string]: string } = {
    map: `// map - Transform values
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  map(x => x * 2)
).subscribe(console.log);
// Output: 2, 4, 6, 8, 10`,

    filter: `// filter - Conditional filtering
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log);
// Output: 2, 4, 6, 8, 10`,

    tap: `// tap - Side effects (debugging, logging)
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

of(42).pipe(
  tap(value => console.log('Before:', value)),
  map(value => value * 2),
  tap(value => console.log('After:', value))
).subscribe();
// Console: Before: 42, After: 84`,

    catchError: `// catchError - Error handling
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

throwError(() => new Error('Oops!')).pipe(
  catchError(err => {
    console.error('Caught:', err.message);
    return of('Fallback value');
  })
).subscribe(console.log);
// Output: Fallback value`,

    switchMap: `// switchMap - Flatten & cancel previous
import { fromEvent } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

fromEvent(input, 'input').pipe(
  debounceTime(300),
  switchMap(event =>
    // Previous HTTP request is cancelled
    // when new input arrives
    this.http.get(\`/api/search?q=\${event.target.value}\`)
  )
).subscribe(results => {
  this.results = results;
});`,

    takeUntil: `// takeUntil - Automatic unsubscribe
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.myService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,

    searchPipeline: `// Complete search pipeline
searchResults$ = this.searchInput$.pipe(
  debounceTime(300),        // Wait for typing pause
  distinctUntilChanged(),   // Ignore if same value
  filter(term => term.length >= 2),  // Min 2 chars
  switchMap(term =>         // Cancel prev, start new
    this.searchService.search(term).pipe(
      catchError(err => {
        console.error(err);
        return of([]);      // Return empty on error
      })
    )
  ),
  takeUntil(this.destroy$)  // Cleanup on destroy
);`
  };

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // Set up search with switchMap
    this.searchService.demoSwitchMap(this.searchTerms$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
        this.isSearching = false;
        this.updateLog();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm = term;
    this.isSearching = true;
    this.searchTerms$.next(term);
  }

  runOperatorDemo(operator: string): void {
    this.selectedOperator = operator;
    this.demoResult = '';

    switch (operator) {
      case 'map':
        this.searchService.demoMap()
          .pipe(takeUntil(this.destroy$))
          .subscribe(result => {
            this.demoResult = result.join(', ');
            this.updateLog();
          });
        break;

      case 'filter':
        this.searchService.demoFilter()
          .pipe(takeUntil(this.destroy$))
          .subscribe(result => {
            this.demoResult = result.join(', ');
            this.updateLog();
          });
        break;

      case 'tap':
        this.searchService.demoTap()
          .pipe(takeUntil(this.destroy$))
          .subscribe(result => {
            this.demoResult = result.toString();
            this.updateLog();
          });
        break;

      case 'catchError':
        this.runCatchErrorDemo();
        break;
    }
  }

  runCatchErrorDemo(): void {
    this.searchService.demoCatchError(this.shouldFail)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.errorResult = result;
        this.updateLog();
      });
  }

  toggleShouldFail(): void {
    this.shouldFail = !this.shouldFail;
    this.runCatchErrorDemo();
  }

  updateLog(): void {
    this.operationLog = this.searchService.getOperationLog();
  }

  clearLog(): void {
    this.searchService.clearLog();
    this.operationLog = [];
  }

  getOperatorCategory(category: string): OperatorDemo[] {
    return this.operators.filter(op => op.category === category);
  }
}
