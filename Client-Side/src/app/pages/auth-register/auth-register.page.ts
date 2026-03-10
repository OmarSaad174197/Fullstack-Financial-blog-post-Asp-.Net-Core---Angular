import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-register.page.html',
  styleUrl: './auth-register.page.css'
})
export class AuthRegisterPageComponent {
  isLoading = false;
  error = '';
  showPassword = false;

  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.registerForm = this.fb.group({
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
    if (this.registerForm.invalid) {
      this.error = 'Please fix the highlighted fields before continuing.';
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.error = '';

    const payload = {
      userName: this.registerForm.value.userName ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    };

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'Registration failed. Try a different username or email.';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
