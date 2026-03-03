import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell.component';
import { HomePageComponent } from './pages/home/home.page';
import { StocksPageComponent } from './pages/stocks/stocks.page';
import { StockDetailPageComponent } from './pages/stock-detail/stock-detail.page';
import { StockFormPageComponent } from './pages/stock-form/stock-form.page';
import { PortfolioPageComponent } from './pages/portfolio/portfolio.page';
import { AuthLoginPageComponent } from './pages/auth-login/auth-login.page';
import { AuthRegisterPageComponent } from './pages/auth-register/auth-register.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'stocks', component: StocksPageComponent },
      { path: 'stocks/new', component: StockFormPageComponent, canActivate: [authGuard] },
      { path: 'stocks/:id/edit', component: StockFormPageComponent, canActivate: [authGuard] },
      { path: 'stocks/:id', component: StockDetailPageComponent },
      { path: 'portfolio', component: PortfolioPageComponent, canActivate: [authGuard] }
    ]
  },
  { path: 'auth/login', component: AuthLoginPageComponent },
  { path: 'auth/register', component: AuthRegisterPageComponent },
  { path: '**', redirectTo: '' }
];
