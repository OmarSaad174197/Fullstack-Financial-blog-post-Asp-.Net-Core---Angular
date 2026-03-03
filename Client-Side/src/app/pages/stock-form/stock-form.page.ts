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
      symbol: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      purchase: [0, [Validators.required, Validators.min(0)]],
      lastDiv: [0, [Validators.required, Validators.min(0)]],
      industry: ['', [Validators.required]],
      marketCapacity: [0, [Validators.required, Validators.min(0)]]
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
    if (this.stockForm.invalid) return;
    this.isLoading = true;
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
        error: () => {
          this.error = 'Unable to update stock.';
          this.isLoading = false;
        }
      });
      return;
    }

    this.stockService.create(payload).subscribe({
      next: (stock) => this.router.navigate(['/stocks', stock.id]),
      error: () => {
        this.error = 'Unable to create stock.';
        this.isLoading = false;
      }
    });
  }
}
