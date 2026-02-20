import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class ConsoleLoggerService extends LoggerService {
  private logs: string[] = [];

  log(message: string): void {
    const entry = `[ConsoleLogger] INFO: ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  warn(message: string): void {
    const entry = `[ConsoleLogger] WARN: ${message}`;
    this.logs.push(entry);
    console.warn(entry);
  }

  error(message: string): void {
    const entry = `[ConsoleLogger] ERROR: ${message}`;
    this.logs.push(entry);
    console.error(entry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}
