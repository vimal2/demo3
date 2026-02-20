import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-template-forms-demo',
  templateUrl: './template-forms-demo.component.html',
  styleUrls: ['./template-forms-demo.component.css']
})
export class TemplateFormsDemoComponent {
  // Form model
  contact: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    newsletter: false
  };

  // Subject options
  subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'sales', label: 'Sales Question' },
    { value: 'feedback', label: 'Feedback' }
  ];

  // Form submission state
  submitted = false;
  submittedData: ContactForm | null = null;

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submitted = true;
      this.submittedData = { ...this.contact };
      console.log('Form submitted:', this.submittedData);
    }
  }

  onReset(form: NgForm): void {
    form.resetForm();
    this.contact = {
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
      newsletter: false
    };
    this.submitted = false;
    this.submittedData = null;
  }
}
