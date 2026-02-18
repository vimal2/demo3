import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Welcome to Angular Routing Demo';

  features = [
    { name: 'Basic Routing', description: 'Navigate between pages using routerLink' },
    { name: 'Route Parameters', description: 'Pass dynamic values in URLs' },
    { name: 'Query Parameters', description: 'Add optional parameters to routes' },
    { name: 'Programmatic Navigation', description: 'Navigate using Router service' },
    { name: 'Nested Routes', description: 'Child routes within parent components' },
    { name: 'Lazy Loading', description: 'Load modules on demand for better performance' },
    { name: 'Route Guards', description: 'Protect routes with authentication' },
    { name: 'Resolvers', description: 'Pre-fetch data before route activation' }
  ];
}
