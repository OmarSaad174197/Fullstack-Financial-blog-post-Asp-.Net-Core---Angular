import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, NewUser, RegisterRequest } from '../models/auth.model';

const STORAGE_KEY = 'fintech_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSubject: BehaviorSubject<NewUser | null>;
  public readonly user$: Observable<NewUser | null>;

  constructor(private readonly http: HttpClient) {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.userSubject = new BehaviorSubject<NewUser | null>(stored ? JSON.parse(stored) : null);
    this.user$ = this.userSubject.asObservable();
  }

  get currentUser(): NewUser | null {
    return this.userSubject.value;
  }

  get token(): string | null {
    return this.userSubject.value?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  register(payload: RegisterRequest): Observable<NewUser> {
    return this.http
      .post<NewUser>(`${environment.apiBaseUrl}/Account/Register`, payload)
      .pipe(tap((user) => this.setUser(user)));
  }

  login(payload: LoginRequest): Observable<NewUser> {
    return this.http
      .post<NewUser>(`${environment.apiBaseUrl}/Account/Login`, payload)
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
  }

  private setUser(user: NewUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
