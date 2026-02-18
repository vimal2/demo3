import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isAdmin = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get the return URL from query parameters
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }

  login(): void {
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password, this.isAdmin);
      if (success) {
        // Programmatic navigation after login
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    } else {
      this.errorMessage = 'Please enter username and password';
    }
  }
}
