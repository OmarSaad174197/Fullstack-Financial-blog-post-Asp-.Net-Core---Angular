import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { StockDto } from '../../models/stock.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePageComponent implements OnInit {
  featuredStocks: StockDto[] = [];
  isLoading = true;
  error = '';

  constructor(private readonly stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getAll({ pageSize: 6 }).subscribe({
      next: (data) => {
        this.featuredStocks = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load featured stocks.';
        this.isLoading = false;
      }
    });
  }
}
