import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer, Subject } from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  delay,
  retry
} from 'rxjs/operators';

export interface SearchResult {
  id: number;
  title: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Mock data for search
  private readonly mockData: SearchResult[] = [
    { id: 1, title: 'Angular Fundamentals', category: 'Framework' },
    { id: 2, title: 'RxJS Operators Guide', category: 'Library' },
    { id: 3, title: 'TypeScript Basics', category: 'Language' },
    { id: 4, title: 'Angular Routing', category: 'Framework' },
    { id: 5, title: 'Angular Forms', category: 'Framework' },
    { id: 6, title: 'RxJS Subjects', category: 'Library' },
    { id: 7, title: 'Angular Services', category: 'Framework' },
    { id: 8, title: 'TypeScript Generics', category: 'Language' },
    { id: 9, title: 'Angular Testing', category: 'Framework' },
    { id: 10, title: 'RxJS Error Handling', category: 'Library' }
  ];

  // Track operations for demo
  private operationLog: string[] = [];

  getOperationLog(): string[] {
    return [...this.operationLog];
  }

  clearLog(): void {
    this.operationLog = [];
  }

  // Simulated API search with delay
  search(term: string): Observable<SearchResult[]> {
    this.operationLog.push(`API call: search("${term}")`);

    // Simulate API delay
    return of(this.mockData).pipe(
      delay(500),
      map(results => results.filter(r =>
        r.title.toLowerCase().includes(term.toLowerCase())
      )),
      tap(results => {
        this.operationLog.push(`Results: ${results.length} items found`);
      })
    );
  }

  // Demonstrate map operator
  demoMap(): Observable<string[]> {
    this.clearLog();
    this.operationLog.push('Source: [1, 2, 3, 4, 5]');
    this.operationLog.push('Operator: map(x => x * 2)');

    return of([1, 2, 3, 4, 5]).pipe(
      map(arr => arr.map(x => x * 2)),
      map(arr => arr.map(x => `Value: ${x}`)),
      tap(result => this.operationLog.push(`Result: [${result.join(', ')}]`))
    );
  }

  // Demonstrate filter operator
  demoFilter(): Observable<number[]> {
    this.clearLog();
    this.operationLog.push('Source: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]');
    this.operationLog.push('Operator: filter(x => x % 2 === 0)');

    return of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
      map(arr => arr.filter(x => x % 2 === 0)),
      tap(result => this.operationLog.push(`Result: [${result.join(', ')}]`))
    );
  }

  // Demonstrate tap operator (side effects)
  demoTap(): Observable<number> {
    this.clearLog();
    this.operationLog.push('Source: of(42)');
    this.operationLog.push('Operator: tap(x => console.log(x))');

    return of(42).pipe(
      tap(value => this.operationLog.push(`tap: Side effect - value is ${value}`)),
      tap(value => this.operationLog.push(`tap: Could log, save to storage, etc.`)),
      map(value => value * 2),
      tap(value => this.operationLog.push(`tap: After map - value is now ${value}`))
    );
  }

  // Demonstrate catchError operator
  demoCatchError(shouldFail: boolean): Observable<string> {
    this.clearLog();
    this.operationLog.push(`Source: ${shouldFail ? 'throwError()' : 'of("Success")'}`);
    this.operationLog.push('Operator: catchError(err => of("Recovered"))');

    const source$ = shouldFail
      ? throwError(() => new Error('Simulated error!'))
      : of('Success!');

    return source$.pipe(
      tap(() => this.operationLog.push('Processing...')),
      catchError(error => {
        this.operationLog.push(`catchError: Caught "${error.message}"`);
        this.operationLog.push('catchError: Returning fallback value');
        return of('Recovered from error!');
      }),
      tap(result => this.operationLog.push(`Final result: ${result}`))
    );
  }

  // Demonstrate switchMap operator
  demoSwitchMap(searchTerms$: Observable<string>): Observable<SearchResult[]> {
    this.clearLog();
    this.operationLog.push('Operator: switchMap - cancels previous requests');

    return searchTerms$.pipe(
      tap(term => this.operationLog.push(`Input: "${term}"`)),
      debounceTime(300),
      tap(term => this.operationLog.push(`After debounce: "${term}"`)),
      distinctUntilChanged(),
      tap(term => this.operationLog.push(`After distinctUntilChanged: "${term}"`)),
      switchMap(term => {
        if (!term.trim()) {
          return of([]);
        }
        this.operationLog.push(`switchMap: Starting search for "${term}"`);
        return this.search(term);
      })
    );
  }

  // Demonstrate takeUntil pattern (for component cleanup)
  createAutoCompleteStream(
    input$: Observable<string>,
    destroy$: Subject<void>
  ): Observable<SearchResult[]> {
    return input$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      switchMap(term => this.search(term)),
      // takeUntil will complete when destroy$ emits
      // This is the pattern for automatic cleanup
    );
  }
}
