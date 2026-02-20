import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterSignalService {
  // Writable signal for the count
  readonly count = signal(0);

  // Writable signal for tracking last action
  readonly lastAction = signal('initialized');

  // Writable signal for history
  readonly history = signal<number[]>([0]);

  // Computed signal - derived state (read-only)
  readonly doubleCount = computed(() => this.count() * 2);

  // Computed signal - is positive
  readonly isPositive = computed(() => this.count() > 0);

  // Computed signal - is negative
  readonly isNegative = computed(() => this.count() < 0);

  // Computed signal - absolute value
  readonly absoluteCount = computed(() => Math.abs(this.count()));

  constructor() {
    // Effect runs whenever signals it reads change
    // Useful for side effects like logging, analytics, localStorage
    effect(() => {
      console.log(`[Signal Effect] Count changed to: ${this.count()}`);
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
    this.lastAction.set('increment');
    this.addToHistory();
  }

  decrement(): void {
    this.count.update(c => c - 1);
    this.lastAction.set('decrement');
    this.addToHistory();
  }

  reset(): void {
    this.count.set(0);
    this.lastAction.set('reset');
    this.history.set([0]);
  }

  setCount(value: number): void {
    this.count.set(value);
    this.lastAction.set(`set to ${value}`);
    this.addToHistory();
  }

  private addToHistory(): void {
    this.history.update(h => [...h.slice(-9), this.count()]);
  }
}
