import { Injectable } from '@angular/core';

// Abstract base class for logger
export abstract class LoggerService {
  abstract log(message: string): void;
  abstract warn(message: string): void;
  abstract error(message: string): void;
  abstract getLogs(): string[];
}

// Default implementation - Console Logger
@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService extends LoggerService {
  private logs: string[] = [];

  log(message: string): void {
    const entry = `[LOG] ${new Date().toLocaleTimeString()}: ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  warn(message: string): void {
    const entry = `[WARN] ${new Date().toLocaleTimeString()}: ${message}`;
    this.logs.push(entry);
    console.warn(entry);
  }

  error(message: string): void {
    const entry = `[ERROR] ${new Date().toLocaleTimeString()}: ${message}`;
    this.logs.push(entry);
    console.error(entry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// Alternative implementation - stores logs with prefixes
@Injectable()
export class PrefixedLoggerService extends LoggerService {
  private logs: string[] = [];
  private prefix = '[APP]';

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  log(message: string): void {
    const entry = `${this.prefix} LOG: ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  warn(message: string): void {
    const entry = `${this.prefix} WARN: ${message}`;
    this.logs.push(entry);
    console.warn(entry);
  }

  error(message: string): void {
    const entry = `${this.prefix} ERROR: ${message}`;
    this.logs.push(entry);
    console.error(entry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// Another implementation - Silent logger (for testing/production)
@Injectable()
export class SilentLoggerService extends LoggerService {
  private logs: string[] = [];

  log(message: string): void {
    this.logs.push(`[SILENT LOG] ${message}`);
    // No console output
  }

  warn(message: string): void {
    this.logs.push(`[SILENT WARN] ${message}`);
  }

  error(message: string): void {
    this.logs.push(`[SILENT ERROR] ${message}`);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}
