import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-login.page.html',
  styleUrl: './auth-login.page.css'
})
export class AuthLoginPageComponent {
  isLoading = false;
  error = '';
  showPassword = false;

  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
        ]
      ]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.error = 'Please fix the highlighted fields before continuing.';
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.error = '';

    const payload = {
      userName: this.loginForm.value.userName ?? '',
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.login(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'Login failed. Check your credentials.';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
