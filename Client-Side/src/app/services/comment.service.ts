import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommentDto, CreateCommentRequest, UpdateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${environment.apiBaseUrl}/Comment`);
  }

  getById(id: number): Observable<CommentDto> {
    return this.http.get<CommentDto>(`${environment.apiBaseUrl}/Comment/${id}`);
  }

  create(stockId: number, payload: CreateCommentRequest): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${environment.apiBaseUrl}/Comment/${stockId}`, payload);
  }

  update(id: number, payload: UpdateCommentRequest): Observable<CommentDto> {
    return this.http.put<CommentDto>(`${environment.apiBaseUrl}/Comment/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/Comment/${id}`);
  }
}
