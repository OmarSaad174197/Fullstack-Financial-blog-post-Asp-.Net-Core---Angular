import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddStockRequest, StockDto, StockQuery, UpdateStockRequest } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private readonly http: HttpClient) {}

  getAll(query?: StockQuery): Observable<StockDto[]> {
    let params = new HttpParams();
    if (query) {
      if (query.symbol) params = params.set('symbol', query.symbol);
      if (query.companyName) params = params.set('companyName', query.companyName);
      if (query.sortBy) params = params.set('sortBy', query.sortBy);
      if (typeof query.isDescinding === 'boolean') {
        params = params.set('isDescinding', query.isDescinding.toString());
      }
      if (query.pageNumber) params = params.set('pageNumber', query.pageNumber.toString());
      if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());
    }
    return this.http.get<StockDto[]>(`${environment.apiBaseUrl}/Stock`, { params });
  }

  getById(id: number): Observable<StockDto> {
    return this.http.get<StockDto>(`${environment.apiBaseUrl}/Stock/${id}`);
  }

  create(payload: AddStockRequest): Observable<StockDto> {
    return this.http.post<StockDto>(`${environment.apiBaseUrl}/Stock`, payload);
  }

  update(id: number, payload: UpdateStockRequest): Observable<StockDto> {
    return this.http.put<StockDto>(`${environment.apiBaseUrl}/Stock/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/Stock/${id}`);
  }
}
