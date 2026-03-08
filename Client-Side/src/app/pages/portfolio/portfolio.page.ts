import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioItem } from '../../models/portfolio.model';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portfolio.page.html',
  styleUrl: './portfolio.page.css'
})
export class PortfolioPageComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  isLoading = true;
  error = '';

  addForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly portfolioService: PortfolioService) {
    this.addForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.isLoading = true;
    this.error = '';
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.portfolio = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load portfolio.';
        this.isLoading = false;
      }
    });
  }

  addSymbol(): void {
    if (this.addForm.invalid) {
      this.error = 'Please enter a valid symbol (max 10 characters).';
      this.addForm.markAllAsTouched();
      return;
    }
    this.error = '';
    const symbol = this.addForm.value.symbol ?? '';
    this.portfolioService.add(symbol).subscribe({
      next: () => {
        this.addForm.reset();
        this.loadPortfolio();
      },
      error: () => {
        this.error = 'Unable to add symbol.';
      }
    });
  }

  removeSymbol(symbol: string): void {
    this.portfolioService.remove(symbol).subscribe({
      next: () => this.loadPortfolio(),
      error: () => {
        this.error = 'Unable to remove symbol.';
      }
    });
  }
}
