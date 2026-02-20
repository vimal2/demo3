import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CounterState {
  count: number;
  lastAction: string;
  history: number[];
}

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  // Private BehaviorSubject holds the state
  private readonly state = new BehaviorSubject<CounterState>({
    count: 0,
    lastAction: 'initialized',
    history: [0]
  });

  // Expose state as Observable (read-only)
  readonly state$: Observable<CounterState> = this.state.asObservable();

  // Convenience observables for specific state slices
  get count$(): Observable<number> {
    return new Observable(subscriber => {
      this.state$.subscribe(state => subscriber.next(state.count));
    });
  }

  // Get current snapshot (for when you need sync access)
  get currentCount(): number {
    return this.state.getValue().count;
  }

  get currentState(): CounterState {
    return this.state.getValue();
  }

  increment(): void {
    const current = this.state.getValue();
    this.updateState({
      count: current.count + 1,
      lastAction: 'increment'
    });
  }

  decrement(): void {
    const current = this.state.getValue();
    this.updateState({
      count: current.count - 1,
      lastAction: 'decrement'
    });
  }

  reset(): void {
    this.state.next({
      count: 0,
      lastAction: 'reset',
      history: [0]
    });
  }

  setCount(value: number): void {
    this.updateState({
      count: value,
      lastAction: `set to ${value}`
    });
  }

  private updateState(partial: Partial<CounterState>): void {
    const current = this.state.getValue();
    const newCount = partial.count ?? current.count;
    this.state.next({
      ...current,
      ...partial,
      history: [...current.history.slice(-9), newCount] // Keep last 10
    });
  }
}
