import { Component } from '@angular/core';

@Component({
  selector: 'app-forms-home',
  templateUrl: './forms-home.component.html',
  styleUrls: ['./forms-home.component.css']
})
export class FormsHomeComponent {
  formTypes = [
    {
      title: 'Template-Driven Forms',
      route: '/forms/template',
      description: 'Forms built using directives in the template. Uses ngModel for two-way data binding.',
      features: [
        'Two-way binding with ngModel',
        'Built-in validators (required, email, minlength)',
        'Template reference variables',
        'Form state tracking (pristine, dirty, touched, valid)'
      ]
    },
    {
      title: 'Reactive Forms',
      route: '/forms/reactive',
      description: 'Forms built programmatically using FormBuilder. More control and testability.',
      features: [
        'FormGroup and FormControl',
        'FormBuilder service',
        'Synchronous validators',
        'Cross-field validation (password match)',
        'Nested FormGroups'
      ]
    },
    {
      title: 'Advanced Forms',
      route: '/forms/advanced',
      description: 'Advanced reactive form patterns for complex use cases.',
      features: [
        'FormArray for dynamic fields',
        'Async validators',
        'Custom validator functions',
        'Value changes subscription',
        'Conditional validation'
      ]
    },
    {
      title: 'Environment Config',
      route: '/forms/environment',
      description: 'Externalize configuration like API URLs per environment using Angular environment files.',
      features: [
        'Environment-specific config files',
        'API URL per environment',
        'Feature flags',
        'Build-time file replacement',
        'Multiple environments (dev, staging, prod)'
      ]
    }
  ];
}
