import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'fintech_theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeSubject: BehaviorSubject<ThemeMode>;
  readonly theme$;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? null;
    const prefersLight =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    const initialTheme: ThemeMode = stored ?? (prefersLight ? 'light' : 'dark');
    this.themeSubject = new BehaviorSubject<ThemeMode>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(initialTheme);
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
