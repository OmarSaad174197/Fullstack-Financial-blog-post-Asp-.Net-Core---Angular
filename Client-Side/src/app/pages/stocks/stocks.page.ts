import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { StockDto, StockQuery } from '../../models/stock.model';

@Component({
  selector: 'app-stocks-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stocks.page.html',
  styleUrl: './stocks.page.css'
})
export class StocksPageComponent implements OnInit {
  stocks: StockDto[] = [];
  isLoading = false;
  error = '';
  pageNumber = 1;

  filterForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly stockService: StockService) {
    this.filterForm = this.fb.group({
      symbol: [''],
      companyName: [''],
      sortBy: ['Symbol'],
      isDescinding: [false],
      pageSize: [10]
    });
  }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.isLoading = true;
    this.error = '';
    const query: StockQuery = {
      symbol: this.filterForm.value.symbol || undefined,
      companyName: this.filterForm.value.companyName || undefined,
      sortBy: this.filterForm.value.sortBy || undefined,
      isDescinding: this.filterForm.value.isDescinding ?? undefined,
      pageNumber: this.pageNumber,
      pageSize: this.filterForm.value.pageSize ?? 10
    };

    this.stockService.getAll(query).subscribe({
      next: (data) => {
        this.stocks = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load stocks from the API.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadStocks();
  }

  nextPage(): void {
    this.pageNumber += 1;
    this.loadStocks();
  }

  prevPage(): void {
    if (this.pageNumber === 1) return;
    this.pageNumber -= 1;
    this.loadStocks();
  }
}
