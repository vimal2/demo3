import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-advanced-forms-demo',
  templateUrl: './advanced-forms-demo.component.html',
  styleUrls: ['./advanced-forms-demo.component.css']
})
export class AdvancedFormsDemoComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  submitted = false;
  submittedData: any = null;
  valueChangesLog: string[] = [];
  private subscriptions: Subscription[] = [];

  // Simulated taken usernames for async validation
  private takenUsernames = ['admin', 'user', 'test', 'demo', 'angular'];

  // Skill levels for dropdown
  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.setupValueChangesSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      // Username with async validator
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ], [this.usernameAvailabilityValidator()]],

      // Profile nested group
      profile: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        bio: ['', Validators.maxLength(500)]
      }),

      // Contact nested group with conditional validation
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        preferredContact: ['email']
      }),

      // Dynamic skills array
      skills: this.fb.array([]),

      // Work experience array with nested groups
      experience: this.fb.array([])
    });

    // Add initial skill
    this.addSkill();
  }

  // Async validator: Check username availability
  private usernameAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simulate API call with delay
      return of(control.value).pipe(
        delay(1000),
        map(username => {
          const isTaken = this.takenUsernames.includes(username.toLowerCase());
          return isTaken ? { usernameTaken: true } : null;
        })
      );
    };
  }

  // Setup value changes subscription for logging
  private setupValueChangesSubscription(): void {
    const sub = this.profileForm.valueChanges.subscribe(value => {
      const timestamp = new Date().toLocaleTimeString();
      this.valueChangesLog.unshift(`[${timestamp}] Form value changed`);
      // Keep only last 10 entries
      if (this.valueChangesLog.length > 10) {
        this.valueChangesLog.pop();
      }
    });
    this.subscriptions.push(sub);

    // Subscribe to preferred contact for conditional validation
    const contactSub = this.profileForm.get('contact.preferredContact')?.valueChanges.subscribe(
      preference => this.updateContactValidation(preference)
    );
    if (contactSub) {
      this.subscriptions.push(contactSub);
    }
  }

  // Conditional validation based on preferred contact
  private updateContactValidation(preference: string): void {
    const phoneControl = this.profileForm.get('contact.phone');
    const emailControl = this.profileForm.get('contact.email');

    if (preference === 'phone') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }

  // Skills FormArray accessors
  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill(): void {
    const skillGroup = this.fb.group({
      name: ['', Validators.required],
      level: ['Intermediate', Validators.required],
      yearsOfExperience: [1, [Validators.required, Validators.min(0), Validators.max(50)]]
    });
    this.skills.push(skillGroup);
  }

  removeSkill(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  // Experience FormArray accessors
  get experience(): FormArray {
    return this.profileForm.get('experience') as FormArray;
  }

  addExperience(): void {
    const expGroup = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['']
    });
    this.experience.push(expGroup);
  }

  removeExperience(index: number): void {
    this.experience.removeAt(index);
  }

  // Toggle current job - clear end date if current
  onCurrentJobChange(index: number): void {
    const exp = this.experience.at(index);
    if (exp.get('current')?.value) {
      exp.get('endDate')?.setValue('');
      exp.get('endDate')?.clearValidators();
    }
    exp.get('endDate')?.updateValueAndValidity();
  }

  // Form submission
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.submitted = true;
      this.submittedData = this.profileForm.value;
      console.log('Profile submitted:', this.submittedData);
    } else {
      this.markAllAsTouched(this.profileForm);
    }
  }

  onReset(): void {
    this.profileForm.reset();
    this.skills.clear();
    this.experience.clear();
    this.addSkill();
    this.submitted = false;
    this.submittedData = null;
    this.valueChangesLog = [];
  }

  private markAllAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      }
    });
  }

  // Helper methods
  hasError(path: string, error: string): boolean {
    const control = this.profileForm.get(path);
    return control?.hasError(error) && control?.touched || false;
  }

  isCheckingUsername(): boolean {
    return this.profileForm.get('username')?.pending || false;
  }
}
