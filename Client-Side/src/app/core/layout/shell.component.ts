import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NewUser } from '../../models/auth.model';
import { Observable } from 'rxjs';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  readonly user$: Observable<NewUser | null>;
  readonly theme$: Observable<ThemeMode>;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService
  ) {
    this.user$ = this.authService.user$;
    this.theme$ = this.themeService.theme$;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
