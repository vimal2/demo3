import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // API URL from environment configuration
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    if (environment.features.enableDebugMode) {
      console.log(`[ApiService] Initialized with API URL: ${this.apiUrl}`);
      console.log(`[ApiService] Environment: ${environment.envName}`);
    }
  }

  // Expose environment info for demo purposes
  getEnvironmentInfo(): {
    envName: string;
    apiUrl: string;
    production: boolean;
    features: { enableAnalytics: boolean; enableDebugMode: boolean };
  } {
    return {
      envName: environment.envName,
      apiUrl: environment.apiUrl,
      production: environment.production,
      features: environment.features
    };
  }

  // Generic GET request
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    this.logRequest('GET', url);

    return this.http.get<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    this.logRequest('POST', url, data);

    return this.http.post<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    this.logRequest('PUT', url, data);

    return this.http.put<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    this.logRequest('DELETE', url);

    return this.http.delete<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Simulated API call for demo (doesn't require actual backend)
  simulateApiCall<T>(mockData: T, delayMs: number = 500): Observable<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      data: mockData,
      message: 'Success (simulated)',
      timestamp: new Date()
    };

    this.logRequest('SIMULATED', `${this.apiUrl}/mock`);

    return of(response).pipe(delay(delayMs));
  }

  // Private helper methods
  private logRequest(method: string, url: string, data?: any): void {
    if (environment.features.enableDebugMode) {
      console.log(`[ApiService] ${method} ${url}`, data || '');
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    if (environment.features.enableDebugMode) {
      console.error('[ApiService] Error:', errorMessage, error);
    }

    return throwError(() => new Error(errorMessage));
  }
}
