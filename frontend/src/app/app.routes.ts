import { Routes } from '@angular/router';
import { LoginComponent } from './features/login.component';
import { PokedexComponent } from './features/pokedex/pokedex.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Rota pública
  { path: 'login', component: LoginComponent },

  // Rotas protegidas dentro do AppShell
  {
    path: '',
    component: PokedexComponent,
    canActivate: [authGuard],
    children: [
      { path: 'pokedex', component: PokedexComponent },
      // { path: 'favorites', component: FavoritesComponent },
      // { path: 'team', component: TeamComponent },
      { path: '', redirectTo: 'pokedex', pathMatch: 'full' }
    ]
  },

  // Rota coringa
  { path: '**', redirectTo: 'login' }
];