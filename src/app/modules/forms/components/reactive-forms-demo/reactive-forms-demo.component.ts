import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reactive-forms-demo',
  templateUrl: './reactive-forms-demo.component.html',
  styleUrls: ['./reactive-forms-demo.component.css']
})
export class ReactiveFormsDemoComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  submittedData: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      // Basic fields
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],

      // Password group with cross-field validation
      passwords: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator
        ]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator }),

      // Nested address group
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [
          Validators.required,
          Validators.pattern(/^\d{5}(-\d{4})?$/)
        ]]
      }),

      // Additional fields
      phone: ['', Validators.pattern(/^[\d\s\-\+\(\)]+$/)],
      birthDate: [''],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  // Custom validator: Password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric;
    return valid ? null : { passwordStrength: true };
  }

  // Cross-field validator: Password match
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Convenience getters for form controls
  get f() { return this.registrationForm.controls; }
  get passwordsGroup() { return this.registrationForm.get('passwords') as FormGroup; }
  get addressGroup() { return this.registrationForm.get('address') as FormGroup; }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submitted = true;
      this.submittedData = this.registrationForm.value;
      console.log('Registration submitted:', this.submittedData);
    } else {
      this.markAllAsTouched();
    }
  }

  onReset(): void {
    this.registrationForm.reset();
    this.submitted = false;
    this.submittedData = null;
  }

  private markAllAsTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(childKey => {
          control.get(childKey)?.markAsTouched();
        });
      }
    });
  }

  // Helper to check if a control has an error
  hasError(controlPath: string, errorType: string): boolean {
    const control = this.registrationForm.get(controlPath);
    return control?.hasError(errorType) && control?.touched || false;
  }
}
