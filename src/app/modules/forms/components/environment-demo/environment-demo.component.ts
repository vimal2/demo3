import { Component, OnInit } from '@angular/core';
import { ApiService, ApiResponse } from '../../../../services/api.service';

interface MockUser {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-environment-demo',
  templateUrl: './environment-demo.component.html',
  styleUrls: ['./environment-demo.component.css']
})
export class EnvironmentDemoComponent implements OnInit {
  environmentInfo: ReturnType<ApiService['getEnvironmentInfo']> | null = null;
  apiResponse: ApiResponse<MockUser[]> | null = null;
  isLoading = false;
  errorMessage = '';

  // Accordion state (Angular-managed instead of Bootstrap JS)
  activePanel: number | null = 1;

  // Code snippets for display
  codeSnippets = {
    environmentFile: `// src/environments/environment.ts
export const environment = {
  production: false,
  envName: 'development',
  apiUrl: 'http://localhost:3000/api',
  features: {
    enableAnalytics: false,
    enableDebugMode: true
  }
};`,

    environmentProd: `// src/environments/environment.prod.ts
export const environment = {
  production: true,
  envName: 'production',
  apiUrl: 'https://api.example.com/api',
  features: {
    enableAnalytics: true,
    enableDebugMode: false
  }
};`,

    serviceUsage: `// api.service.ts
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(\`\${this.apiUrl}/\${endpoint}\`);
  }
}`,

    angularJson: `// angular.json - configurations section
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}`,

    buildCommands: `# Development (uses environment.ts)
ng serve

# Production (uses environment.prod.ts)
ng build --configuration=production

# Staging (uses environment.staging.ts)
ng build --configuration=staging
ng serve --configuration=staging`
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.environmentInfo = this.apiService.getEnvironmentInfo();
  }

  simulateApiCall(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiResponse = null;

    const mockUsers: MockUser[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
    ];

    this.apiService.simulateApiCall(mockUsers, 1000).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  clearResponse(): void {
    this.apiResponse = null;
    this.errorMessage = '';
  }

  togglePanel(panel: number): void {
    this.activePanel = this.activePanel === panel ? null : panel;
  }
}
