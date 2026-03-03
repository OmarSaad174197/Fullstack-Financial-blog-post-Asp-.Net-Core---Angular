import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PortfolioItem } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private readonly http: HttpClient) {}

  getPortfolio(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(`${environment.apiBaseUrl}/Portfolio`);
  }

  add(symbol: string): Observable<void> {
    const params = new HttpParams().set('symbol', symbol);
    return this.http.post<void>(`${environment.apiBaseUrl}/Portfolio`, null, { params });
  }

  remove(symbol: string): Observable<void> {
    const params = new HttpParams().set('symbol', symbol);
    return this.http.delete<void>(`${environment.apiBaseUrl}/Portfolio`, { params });
  }
}
