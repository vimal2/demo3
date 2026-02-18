import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  hasUnsavedChanges = false;
  notes = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  onNotesChange(): void {
    this.hasUnsavedChanges = true;
  }

  saveChanges(): void {
    // Simulate saving
    this.hasUnsavedChanges = false;
    alert('Changes saved!');
  }

  // This method will be called by the ConfirmLeaveGuard
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
}
