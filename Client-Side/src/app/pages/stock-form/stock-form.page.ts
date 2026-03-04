import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-form.page.html',
  styleUrl: './stock-form.page.css'
})
export class StockFormPageComponent implements OnInit {
  isEdit = false;
  isLoading = false;
  error = '';
  stockId: number | null = null;

  stockForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stockService: StockService
  ) {
    this.stockForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.maxLength(10)]],
      companyName: ['', [Validators.required, Validators.maxLength(10)]],
      purchase: [0, [Validators.required, Validators.min(1), Validators.max(1000000000)]],
      lastDiv: [0, [Validators.required, Validators.min(0.001), Validators.max(100)]],
      industry: ['', [Validators.required, Validators.maxLength(10)]],
      marketCapacity: [0, [Validators.required, Validators.min(1), Validators.max(5000000000)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.stockId = id;
      this.loadStock(id);
    }
  }

  loadStock(id: number): void {
    this.isLoading = true;
    this.stockService.getById(id).subscribe({
      next: (stock) => {
        this.stockForm.patchValue(stock);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load stock for editing.';
        this.isLoading = false;
      }
    });
  }

  submit(): void {
    if (this.stockForm.invalid) {
      this.error = 'Please fix the highlighted fields before saving.';
      this.stockForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.error = '';
    const payload = {
      symbol: this.stockForm.value.symbol ?? '',
      companyName: this.stockForm.value.companyName ?? '',
      purchase: Number(this.stockForm.value.purchase ?? 0),
      lastDiv: Number(this.stockForm.value.lastDiv ?? 0),
      industry: this.stockForm.value.industry ?? '',
      marketCapacity: Number(this.stockForm.value.marketCapacity ?? 0)
    };

    if (this.isEdit && this.stockId) {
      this.stockService.update(this.stockId, payload).subscribe({
        next: (stock) => this.router.navigate(['/stocks', stock.id]),
        error: (err) => {
          this.error = this.toErrorMessage(err, 'Unable to update stock.');
          this.isLoading = false;
        }
      });
      return;
    }

    this.stockService.create(payload).subscribe({
      next: (stock) => this.router.navigate(['/stocks', stock.id]),
      error: (err) => {
        this.error = this.toErrorMessage(err, 'Unable to create stock.');
        this.isLoading = false;
      }
    });
  }

  private toErrorMessage(err: unknown, fallback: string): string {
    if (!err || typeof err !== 'object') return fallback;
    const httpErr = err as { error?: any };
    if (typeof httpErr.error === 'string') return httpErr.error;
    if (httpErr.error?.title) return httpErr.error.title;
    const errors = httpErr.error?.errors;
    if (errors && typeof errors === 'object') {
      const key = Object.keys(errors)[0];
      const value = errors[key];
      if (Array.isArray(value) && value[0]) return value[0];
      if (typeof value === 'string') return value;
    }
    return fallback;
  }
}
